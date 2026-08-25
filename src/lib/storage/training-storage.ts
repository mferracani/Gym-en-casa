import type {
  ActiveSession,
  AppState,
  CompletedSession,
  Profile,
  SessionExercise,
  SetLog,
  WeeklyScheduleDay,
  WorkoutKind,
} from "../../domain/training/types.ts";

export const STORAGE_KEY = "entrena-casa:app-state";
export const CURRENT_SCHEMA_VERSION = 3;

export interface PersistedEnvelope {
  schemaVersion: number;
  updatedAt: string;
  data: AppState;
}

export interface LoadResult {
  state: AppState;
  source: "default" | "stored" | "migrated";
  updatedAt: string | null;
  warning?: "corrupt" | "unsupported" | "unavailable";
}

type ReadableStorage = Pick<Storage, "getItem" | "setItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isWorkoutKind(value: unknown): value is WorkoutKind {
  return value === "strength" || value === "recovery" || value === "rest";
}

function isSetLog(value: unknown): value is SetLog {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isFiniteNumber(value.order) &&
    isFiniteNumber(value.targetReps) &&
    (value.actualReps === null || isFiniteNumber(value.actualReps)) &&
    (value.weightKg === null || isFiniteNumber(value.weightKg)) &&
    (value.status === "pending" || value.status === "completed" || value.status === "skipped") &&
    (value.completedAt === null || isString(value.completedAt))
  );
}

function isSessionExercise(value: unknown): value is SessionExercise {
  return (
    isRecord(value) &&
    isString(value.exerciseId) &&
    isString(value.name) &&
    isFiniteNumber(value.targetSets) &&
    isFiniteNumber(value.targetReps) &&
    isFiniteNumber(value.restSeconds) &&
    Array.isArray(value.sets) &&
    value.sets.every(isSetLog)
  );
}

type LegacyActiveSession = Omit<
  ActiveSession,
  "pausedAt" | "pausedDurationSeconds"
>;

function isLegacyActiveSession(value: unknown): value is LegacyActiveSession {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.scheduledFor) &&
    isString(value.templateId) &&
    isString(value.workoutName) &&
    isString(value.startedAt) &&
    (value.status === "active" || value.status === "paused") &&
    isFiniteNumber(value.currentExerciseIndex) &&
    Array.isArray(value.exercises) &&
    value.exercises.every(isSessionExercise)
  );
}

function isActiveSession(value: unknown): value is ActiveSession {
  if (!isLegacyActiveSession(value)) {
    return false;
  }

  const withTimer = value as LegacyActiveSession & Record<string, unknown>;

  return (
    (withTimer.pausedAt === null || isString(withTimer.pausedAt)) &&
    isFiniteNumber(withTimer.pausedDurationSeconds) &&
    withTimer.pausedDurationSeconds >= 0
  );
}

function isCompletedSession(value: unknown): value is CompletedSession {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.scheduledFor) &&
    isString(value.templateId) &&
    isString(value.workoutName) &&
    isString(value.startedAt) &&
    isString(value.completedAt) &&
    isFiniteNumber(value.durationSeconds) &&
    Array.isArray(value.exercises) &&
    value.exercises.every(isSessionExercise)
  );
}

function isProfile(value: unknown): value is Profile {
  const equipmentKeys = [
    "dumbbells",
    "barbell",
    "flat-bench",
    "adjustable-bench",
    "rack",
  ] as const;

  if (!isRecord(value) || !isRecord(value.equipment)) {
    return false;
  }

  const equipment = value.equipment;

  return (
    value.id === "local-profile" &&
    isString(value.displayName) &&
    equipmentKeys.every((key) => typeof equipment[key] === "boolean") &&
    isFiniteNumber(value.defaultRestSeconds) &&
    value.weightUnit === "kg"
  );
}

function isScheduleDay(value: unknown): value is WeeklyScheduleDay {
  return (
    isRecord(value) &&
    isFiniteNumber(value.weekday) &&
    value.weekday >= 1 &&
    value.weekday <= 7 &&
    isWorkoutKind(value.kind) &&
    (value.workoutTemplateId === undefined || isString(value.workoutTemplateId))
  );
}

function isAppState(value: unknown): value is AppState {
  return (
    isRecord(value) &&
    isProfile(value.profile) &&
    Array.isArray(value.schedule) &&
    value.schedule.every(isScheduleDay) &&
    (value.activeSession === null || isActiveSession(value.activeSession)) &&
    Array.isArray(value.history) &&
    value.history.every(isCompletedSession)
  );
}

function isLegacyAppState(
  value: unknown,
): value is Omit<AppState, "activeSession"> & {
  activeSession: LegacyActiveSession | null;
} {
  return (
    isRecord(value) &&
    isProfile(value.profile) &&
    Array.isArray(value.schedule) &&
    value.schedule.every(isScheduleDay) &&
    (value.activeSession === null || isLegacyActiveSession(value.activeSession)) &&
    Array.isArray(value.history) &&
    value.history.every(isCompletedSession)
  );
}

function migrateWeeklySchedule(
  schedule: readonly WeeklyScheduleDay[],
): WeeklyScheduleDay[] {
  return schedule.map((day) => {
    if (day.weekday === 3 || day.weekday === 5 || day.weekday === 7) {
      return { weekday: day.weekday, kind: "rest" };
    }

    if (
      day.weekday === 6 &&
      day.kind === "strength" &&
      day.workoutTemplateId === "chest-biceps-adaptation"
    ) {
      return { weekday: 6, kind: "strength" };
    }

    return { ...day };
  });
}

export function migratePersisted(raw: unknown): PersistedEnvelope | null {
  if (!isRecord(raw) || !isFiniteNumber(raw.schemaVersion) || !isString(raw.updatedAt)) {
    return null;
  }

  if (raw.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return null;
  }

  if (
    raw.schemaVersion !== 0 &&
    raw.schemaVersion !== 1 &&
    raw.schemaVersion !== 2 &&
    raw.schemaVersion !== CURRENT_SCHEMA_VERSION
  ) {
    return null;
  }

  if (raw.schemaVersion === CURRENT_SCHEMA_VERSION) {
    if (!isAppState(raw.data)) {
      return null;
    }

    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      updatedAt: raw.updatedAt,
      data: raw.data,
    };
  }

  if (!isLegacyAppState(raw.data)) {
    return null;
  }

  const data: AppState = {
    ...raw.data,
    schedule:
      raw.schemaVersion === 0 || raw.schemaVersion === 1
        ? migrateWeeklySchedule(raw.data.schedule)
        : raw.data.schedule,
    activeSession: raw.data.activeSession
      ? {
          ...raw.data.activeSession,
          pausedAt:
            raw.data.activeSession.status === "paused" ? raw.updatedAt : null,
          pausedDurationSeconds: 0,
        }
      : null,
  };

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt: raw.updatedAt,
    data,
  };
}

export function loadTrainingState(
  storage: Pick<ReadableStorage, "getItem">,
  createDefaultState: () => AppState,
): LoadResult {
  let serialized: string | null;

  try {
    serialized = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      state: createDefaultState(),
      source: "default",
      updatedAt: null,
      warning: "unavailable",
    };
  }

  if (serialized === null) {
    return { state: createDefaultState(), source: "default", updatedAt: null };
  }

  try {
    const parsed: unknown = JSON.parse(serialized);
    const schemaVersion = isRecord(parsed) ? parsed.schemaVersion : undefined;
    const migrated = migratePersisted(parsed);

    if (!migrated) {
      return {
        state: createDefaultState(),
        source: "default",
        updatedAt: null,
        warning:
          isFiniteNumber(schemaVersion) && schemaVersion > CURRENT_SCHEMA_VERSION
            ? "unsupported"
            : "corrupt",
      };
    }

    return {
      state: migrated.data,
      source: migrated.schemaVersion === CURRENT_SCHEMA_VERSION && schemaVersion === CURRENT_SCHEMA_VERSION
        ? "stored"
        : "migrated",
      updatedAt: migrated.updatedAt,
    };
  } catch {
    return {
      state: createDefaultState(),
      source: "default",
      updatedAt: null,
      warning: "corrupt",
    };
  }
}

export function saveTrainingState(
  storage: Pick<ReadableStorage, "setItem">,
  state: AppState,
  updatedAt = new Date().toISOString(),
): boolean {
  const envelope: PersistedEnvelope = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    updatedAt,
    data: state,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
}
