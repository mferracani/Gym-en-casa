import { isWorkoutTemplateAvailable } from "./constraints.ts";
import type {
  ActiveSession,
  CompletedSession,
  ExerciseDefinition,
  Profile,
  SetLog,
  WorkoutTemplate,
} from "./types.ts";

interface CreateActiveSessionInput {
  sessionId: string;
  scheduledFor: string;
  startedAt: string;
  template: WorkoutTemplate;
  exercises: readonly ExerciseDefinition[];
  profile: Profile;
}

interface CompleteSetInput {
  exerciseId: string;
  setId: string;
  actualReps: number;
  weightKg: number | null;
  completedAt: string;
}

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new Error(`${label} debe ser un entero positivo.`);
  }
}

function assertNonNegativeFinite(value: number | null, label: string) {
  if (value !== null && (!Number.isFinite(value) || value < 0)) {
    throw new Error(`${label} debe ser un número mayor o igual a cero.`);
  }
}

export function createActiveSession({
  sessionId,
  scheduledFor,
  startedAt,
  template,
  exercises,
  profile,
}: CreateActiveSessionInput): ActiveSession {
  if (!isWorkoutTemplateAvailable(template, exercises, profile)) {
    throw new Error("La rutina no es compatible con el equipamiento disponible.");
  }

  const catalog = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  return {
    id: sessionId,
    scheduledFor,
    templateId: template.id,
    workoutName: template.name,
    startedAt,
    status: "active",
    pausedAt: null,
    pausedDurationSeconds: 0,
    currentExerciseIndex: 0,
    exercises: template.exercises.map((plannedExercise) => {
      const exercise = catalog.get(plannedExercise.exerciseId);

      if (!exercise) {
        throw new Error(`No existe el ejercicio ${plannedExercise.exerciseId}.`);
      }

      return {
        exerciseId: exercise.id,
        name: exercise.name,
        targetSets: plannedExercise.targetSets,
        targetReps: plannedExercise.targetReps,
        restSeconds: exercise.defaultRestSeconds,
        sets: Array.from({ length: plannedExercise.targetSets }, (_, index) => ({
          id: `${sessionId}:${exercise.id}:${index + 1}`,
          order: index + 1,
          targetReps: plannedExercise.targetReps,
          actualReps: null,
          weightKg: null,
          status: "pending" as const,
          completedAt: null,
        })),
      };
    }),
  };
}

function parseTimestamp(value: string, label: string): number {
  const timestamp = Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    throw new Error(`${label} no es válida.`);
  }

  return timestamp;
}

export function getSessionElapsedSeconds(
  session: ActiveSession,
  now: string,
): number {
  const startedAtMs = parseTimestamp(session.startedAt, "La fecha de inicio");
  const effectiveEnd =
    session.status === "paused" && session.pausedAt ? session.pausedAt : now;
  const endAtMs = parseTimestamp(effectiveEnd, "La fecha del cronómetro");

  return Math.max(
    0,
    Math.floor((endAtMs - startedAtMs) / 1000) - session.pausedDurationSeconds,
  );
}

export function pauseSession(
  session: ActiveSession,
  pausedAt: string,
): ActiveSession {
  if (session.status === "paused") {
    return session;
  }

  parseTimestamp(pausedAt, "La fecha de pausa");

  return { ...session, status: "paused", pausedAt };
}

export function resumeSession(
  session: ActiveSession,
  resumedAt: string,
): ActiveSession {
  if (session.status === "active") {
    return session;
  }

  const resumedAtMs = parseTimestamp(resumedAt, "La fecha de reanudación");
  const pausedAtMs = session.pausedAt
    ? parseTimestamp(session.pausedAt, "La fecha de pausa")
    : resumedAtMs;

  return {
    ...session,
    status: "active",
    pausedAt: null,
    pausedDurationSeconds:
      session.pausedDurationSeconds +
      Math.max(0, Math.floor((resumedAtMs - pausedAtMs) / 1000)),
  };
}

export function completeSet(
  session: ActiveSession,
  { exerciseId, setId, actualReps, weightKg, completedAt }: CompleteSetInput,
): ActiveSession {
  assertPositiveInteger(actualReps, "Las repeticiones");
  assertNonNegativeFinite(weightKg, "El peso");

  let didUpdate = false;
  const exercises = session.exercises.map((exercise) => {
    if (exercise.exerciseId !== exerciseId) {
      return exercise;
    }

    return {
      ...exercise,
      sets: exercise.sets.map((set): SetLog => {
        if (set.id !== setId) {
          return set;
        }

        if (set.status !== "pending") {
          throw new Error("La serie ya fue registrada.");
        }

        didUpdate = true;
        return {
          ...set,
          actualReps,
          weightKg,
          status: "completed",
          completedAt,
        };
      }),
    };
  });

  if (!didUpdate) {
    throw new Error("No existe la serie a registrar.");
  }

  return { ...session, exercises };
}

export function finishSession(
  session: ActiveSession,
  completedAt: string,
): CompletedSession {
  const completedSets = session.exercises.flatMap((exercise) => exercise.sets).filter(
    (set) => set.status === "completed",
  );

  if (completedSets.length === 0) {
    throw new Error("Registrá al menos una serie antes de finalizar.");
  }

  return {
    id: session.id,
    scheduledFor: session.scheduledFor,
    templateId: session.templateId,
    workoutName: session.workoutName,
    startedAt: session.startedAt,
    exercises: session.exercises,
    completedAt,
    durationSeconds: getSessionElapsedSeconds(session, completedAt),
  };
}
