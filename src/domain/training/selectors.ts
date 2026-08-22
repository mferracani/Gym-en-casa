import { addLocalDays, getMonday } from "../../lib/date/local-date.ts";
import type {
  CompletedSession,
  LocalDate,
  ProgressSummary,
  WeekOverviewDay,
  WeeklyScheduleDay,
  Weekday,
} from "./types.ts";

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
