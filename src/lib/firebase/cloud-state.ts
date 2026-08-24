import type { CloudTrainingSnapshot } from "../../domain/training/cloud-sync.ts";
import type {
  AppState,
  CompletedSession,
} from "../../domain/training/types.ts";
import {
  CURRENT_SCHEMA_VERSION,
  migratePersisted,
} from "../storage/training-storage.ts";

export interface CloudStateDocument {
  schemaVersion: number;
  updatedAt: string;
  profile: AppState["profile"];
  schedule: AppState["schedule"];
  activeSession: AppState["activeSession"];
}

export function createCloudStateDocument(
  state: AppState,
  updatedAt: string,
): CloudStateDocument {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt,
    profile: state.profile,
    schedule: state.schedule,
    activeSession: state.activeSession,
  };
}

export function parseCloudTrainingSnapshot(
  rawState: unknown,
  rawHistory: readonly unknown[],
): CloudTrainingSnapshot | null {
  if (typeof rawState !== "object" || rawState === null) {
    return null;
  }

  const stateDocument = rawState as Partial<CloudStateDocument>;
  const envelope = migratePersisted({
    schemaVersion: stateDocument.schemaVersion,
    updatedAt: stateDocument.updatedAt,
    data: {
      profile: stateDocument.profile,
      schedule: stateDocument.schedule,
      activeSession: stateDocument.activeSession,
      history: rawHistory as CompletedSession[],
    },
  });

  return envelope
    ? { state: envelope.data, updatedAt: envelope.updatedAt }
    : null;
}
