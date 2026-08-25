import { addLocalDays, getMonday } from "../../lib/date/local-date.ts";
import type {
  CompletedSession,
  LocalDate,
  ProgressSummary,
  WeekOverviewDay,
  WeeklyScheduleDay,
  Weekday,
} from "./types.ts";

export interface TrainingActivityDay {
  date: LocalDate;
  sessionCount: number;
  completedSets: number;
  durationSeconds: number;
  intensity: 0 | 1 | 2 | 3;
  isFuture: boolean;
}

export interface TrainingActivityWeek {
  monday: LocalDate;
  days: TrainingActivityDay[];
}

function activityIntensity(completedSets: number): 0 | 1 | 2 | 3 {
  if (completedSets === 0) return 0;
  if (completedSets <= 4) return 1;
  if (completedSets <= 9) return 2;
  return 3;
}

export function getTrainingActivityWeeks(
  history: readonly CompletedSession[],
  referenceDate: LocalDate,
  weekCount = 12,
): TrainingActivityWeek[] {
  const currentMonday = getMonday(referenceDate);
  const firstMonday = addLocalDays(
    currentMonday,
    -7 * Math.max(weekCount - 1, 0),
  );
  const byDate = new Map<
    LocalDate,
    { sessionCount: number; completedSets: number; durationSeconds: number }
  >();

  for (const session of history) {
    const current = byDate.get(session.scheduledFor) ?? {
      sessionCount: 0,
      completedSets: 0,
      durationSeconds: 0,
    };
    current.sessionCount += 1;
    current.completedSets += session.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.filter((set) => set.status === "completed").length,
      0,
    );
    current.durationSeconds += session.durationSeconds;
    byDate.set(session.scheduledFor, current);
  }

  return Array.from({ length: Math.max(weekCount, 0) }, (_, weekIndex) => {
    const monday = addLocalDays(firstMonday, weekIndex * 7);

    return {
      monday,
      days: Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addLocalDays(monday, dayIndex);
        const activity = byDate.get(date) ?? {
          sessionCount: 0,
          completedSets: 0,
          durationSeconds: 0,
        };

        return {
          date,
          ...activity,
          intensity: activityIntensity(activity.completedSets),
          isFuture: date > referenceDate,
        };
      }),
    };
  });
}

export function deriveProgress(
  history: readonly CompletedSession[],
): ProgressSummary {
  const completedSets = history.flatMap((session) =>
    session.exercises.flatMap((exercise) =>
      exercise.sets.filter((set) => set.status === "completed"),
    ),
  );
  const completedRepetitions = completedSets.reduce(
    (total, set) => total + (set.actualReps ?? 0),
    0,
  );
  const totalVolumeKg = completedSets.reduce((total, set) => {
    if (set.actualReps === null || set.weightKg === null) {
      return total;
    }

    return total + set.actualReps * set.weightKg;
  }, 0);
  const lastCompletedAt = history.reduce<string | null>(
    (latest, session) =>
      latest === null || session.completedAt > latest ? session.completedAt : latest,
    null,
  );

  return {
    completedSessions: history.length,
    completedSets: completedSets.length,
    completedRepetitions,
    totalVolumeKg,
    lastCompletedAt,
  };
}

export function getWeekOverview(
  schedule: readonly WeeklyScheduleDay[],
  history: readonly CompletedSession[],
  referenceDate: LocalDate,
): WeekOverviewDay[] {
  const monday = getMonday(referenceDate);
  const completedDates = new Set(history.map((session) => session.scheduledFor));

  return Array.from({ length: 7 }, (_, index) => {
    const weekday = (index + 1) as Weekday;
    const date = addLocalDays(monday, index);
    const plannedDay = schedule.find((day) => day.weekday === weekday);
    const kind = plannedDay?.kind ?? "rest";

    return {
      weekday,
      date,
      kind,
      workoutTemplateId: plannedDay?.workoutTemplateId,
      status: completedDates.has(date)
        ? "completed"
        : kind === "rest"
          ? "rest"
          : kind === "recovery"
            ? "recovery"
            : date === referenceDate
              ? "today"
              : "upcoming",
    };
  });
}
