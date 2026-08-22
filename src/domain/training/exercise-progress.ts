import type { CompletedSession, SetLog } from "./types.ts";

export interface ExerciseProgress {
  exerciseId: string;
  name: string;
  completedSets: number;
  totalVolumeKg: number;
  maxWeightKg: number | null;
  lastReps: number | null;
  lastWeightKg: number | null;
  lastCompletedAt: string | null;
}

export interface HistoricalSessionSummary {
  id: string;
  workoutName: string;
  scheduledFor: string;
  completedAt: string;
  completedSets: number;
  completedRepetitions: number;
  totalVolumeKg: number;
}

function getCompletedSets(session: CompletedSession): SetLog[] {
  return session.exercises.flatMap((exercise) =>
    exercise.sets.filter((set) => set.status === "completed"),
  );
}

function getSetVolume(set: SetLog): number {
  if (set.actualReps === null || set.weightKg === null) {
    return 0;
  }

  return set.actualReps * set.weightKg;
}

export function getHistoricalSessionSummaries(
  history: readonly CompletedSession[],
): HistoricalSessionSummary[] {
  return [...history]
    .sort((left, right) => right.completedAt.localeCompare(left.completedAt))
    .map((session) => {
      const completedSets = getCompletedSets(session);

      return {
        id: session.id,
        workoutName: session.workoutName,
        scheduledFor: session.scheduledFor,
        completedAt: session.completedAt,
        completedSets: completedSets.length,
        completedRepetitions: completedSets.reduce(
          (total, set) => total + (set.actualReps ?? 0),
          0,
        ),
        totalVolumeKg: completedSets.reduce(
          (total, set) => total + getSetVolume(set),
          0,
        ),
      };
    });
}

export function getExerciseProgress(
  history: readonly CompletedSession[],
): ExerciseProgress[] {
  const byExercise = new Map<string, ExerciseProgress>();

  for (const session of history) {
    for (const exercise of session.exercises) {
      const completedSets = exercise.sets.filter(
        (set) => set.status === "completed",
      );

      if (completedSets.length === 0) {
        continue;
      }

      const current = byExercise.get(exercise.exerciseId) ?? {
        exerciseId: exercise.exerciseId,
        name: exercise.name,
        completedSets: 0,
        totalVolumeKg: 0,
        maxWeightKg: null,
        lastReps: null,
        lastWeightKg: null,
        lastCompletedAt: null,
      };

      current.completedSets += completedSets.length;
      current.totalVolumeKg += completedSets.reduce(
        (total, set) => total + getSetVolume(set),
        0,
      );

      for (const set of completedSets) {
        if (set.weightKg !== null) {
          current.maxWeightKg = Math.max(current.maxWeightKg ?? 0, set.weightKg);
        }

        const completedAt = set.completedAt ?? session.completedAt;

        if (current.lastCompletedAt === null || completedAt > current.lastCompletedAt) {
          current.lastCompletedAt = completedAt;
          current.lastReps = set.actualReps;
          current.lastWeightKg = set.weightKg;
        }
      }

      byExercise.set(exercise.exerciseId, current);
    }
  }

  return [...byExercise.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "es-AR"),
  );
}
