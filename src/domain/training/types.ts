export type LocalDate = string;

export type EquipmentId =
  | "dumbbells"
  | "barbell"
  | "flat-bench"
  | "adjustable-bench"
  | "rack";

export type WorkoutKind = "strength" | "recovery" | "rest";
export type SessionStatus = "active" | "paused";
export type SetStatus = "pending" | "completed" | "skipped";
/** Monday-first index used by the editable recurring schedule (1 = Monday). */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryMuscles: string[];
  requiredEquipment: EquipmentId[];
  requiresRack?: boolean;
  defaultRestSeconds: number;
  safetyNote?: string;
}

export interface PlannedExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  kind: "strength";
  estimatedMinutes: number;
  exercises: PlannedExercise[];
}

export interface WeeklyScheduleDay {
  weekday: Weekday;
  kind: WorkoutKind;
  workoutTemplateId?: string;
}

export interface Profile {
  id: "local-profile";
  displayName: string;
  equipment: Record<EquipmentId, boolean>;
  defaultRestSeconds: number;
  weightUnit: "kg";
}

export interface SetLog {
  id: string;
  order: number;
  targetReps: number;
  actualReps: number | null;
  weightKg: number | null;
  status: SetStatus;
  completedAt: string | null;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  restSeconds: number;
  sets: SetLog[];
}

export interface ActiveSession {
  id: string;
  scheduledFor: LocalDate;
  templateId: string;
  workoutName: string;
  startedAt: string;
  status: SessionStatus;
  currentExerciseIndex: number;
  exercises: SessionExercise[];
}

export interface CompletedSession
  extends Omit<ActiveSession, "status" | "currentExerciseIndex"> {
  completedAt: string;
  durationSeconds: number;
}

export interface AppState {
  profile: Profile;
  schedule: WeeklyScheduleDay[];
  activeSession: ActiveSession | null;
  history: CompletedSession[];
}

export interface WeekOverviewDay {
  weekday: Weekday;
  date: LocalDate;
  kind: WorkoutKind;
  workoutTemplateId?: string;
  status: "completed" | "today" | "upcoming" | "recovery" | "rest";
}

export interface ProgressSummary {
  completedSessions: number;
  completedSets: number;
  completedRepetitions: number;
  totalVolumeKg: number;
  lastCompletedAt: string | null;
}
