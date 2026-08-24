import type { AppState, CompletedSession } from "./types.ts";

export type LocalSnapshotSource = "default" | "stored" | "migrated";

export interface LocalTrainingSnapshot {
  state: AppState;
  source: LocalSnapshotSource;
  updatedAt: string | null;
}

export interface CloudTrainingSnapshot {
  state: AppState;
  updatedAt: string;
}

function timestampValue(value: string | null): number {
  if (!value) return 0;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function mergeHistory(
  primary: readonly CompletedSession[],
  secondary: readonly CompletedSession[],
): CompletedSession[] {
  const sessions = new Map<string, CompletedSession>();

  for (const session of [...primary, ...secondary]) {
    if (!sessions.has(session.id)) {
      sessions.set(session.id, session);
    }
  }

  return [...sessions.values()].sort((left, right) =>
    right.completedAt.localeCompare(left.completedAt),
  );
}

export function mergeTrainingSnapshots(
  local: LocalTrainingSnapshot,
  cloud: CloudTrainingSnapshot,
): AppState {
  const preferCloud =
    local.source === "default" ||
    timestampValue(cloud.updatedAt) > timestampValue(local.updatedAt);
  const primary = preferCloud ? cloud.state : local.state;
  const secondary = preferCloud ? local.state : cloud.state;

  return {
    ...primary,
    history: mergeHistory(primary.history, secondary.history),
  };
}
