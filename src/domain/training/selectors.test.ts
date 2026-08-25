import assert from "node:assert/strict";
import test from "node:test";

import { weeklyScheduleSeed } from "../../data/training-catalog.ts";
import {
  deriveProgress,
  getTrainingActivityWeeks,
  getWeekOverview,
} from "./selectors.ts";
import type { CompletedSession } from "./types.ts";

const completedSession: CompletedSession = {
  id: "history-1",
  scheduledFor: "2026-08-22",
  templateId: "chest-biceps-adaptation",
  workoutName: "Pecho + bíceps",
  startedAt: "2026-08-22T10:00:00.000Z",
  completedAt: "2026-08-22T10:30:00.000Z",
  durationSeconds: 1800,
  exercises: [
    {
      exerciseId: "dumbbell-flat-press",
      name: "Press plano con mancuernas",
      targetSets: 2,
      targetReps: 10,
      restSeconds: 60,
      sets: [
        {
          id: "set-1",
          order: 1,
          targetReps: 10,
          actualReps: 10,
          weightKg: 12.5,
          status: "completed",
          completedAt: "2026-08-22T10:05:00.000Z",
        },
        {
          id: "set-2",
          order: 2,
          targetReps: 10,
          actualReps: 10,
          weightKg: null,
          status: "completed",
          completedAt: "2026-08-22T10:10:00.000Z",
        },
      ],
    },
  ],
};

test("el progreso se deriva sólo de series completadas", () => {
  assert.deepEqual(deriveProgress([completedSession]), {
    completedSessions: 1,
    completedSets: 2,
    completedRepetitions: 20,
    totalVolumeKg: 125,
    lastCompletedAt: "2026-08-22T10:30:00.000Z",
  });
});

test("la semana usa fechas locales de lunes a domingo y el historial manda", () => {
  const week = getWeekOverview(weeklyScheduleSeed, [completedSession], "2026-08-22");

  assert.equal(week.length, 7);
  assert.equal(week[0]?.date, "2026-08-17");
  assert.equal(week[5]?.date, "2026-08-22");
  assert.equal(week[5]?.status, "completed");
});

test("arma doce semanas de actividad alineadas de lunes a domingo", () => {
  const weeks = getTrainingActivityWeeks([], "2026-08-25");

  assert.equal(weeks.length, 12);
  assert.equal(weeks[0]?.days[0]?.date, "2026-06-08");
  assert.equal(weeks[11]?.days[0]?.date, "2026-08-24");
  assert.equal(weeks[11]?.days[6]?.date, "2026-08-30");
  assert.equal(weeks[11]?.days[2]?.isFuture, true);
});

test("agrupa sesiones del mismo día y cuenta sólo series completadas", () => {
  const secondSession: CompletedSession = {
    ...completedSession,
    id: "history-2",
    exercises: [
      {
        ...completedSession.exercises[0]!,
        sets: [
          completedSession.exercises[0]!.sets[0]!,
          {
            ...completedSession.exercises[0]!.sets[1]!,
            id: "set-pending",
            status: "pending",
            completedAt: null,
          },
        ],
      },
    ],
  };
  const weeks = getTrainingActivityWeeks(
    [completedSession, secondSession],
    "2026-08-25",
  );
  const saturday = weeks.flatMap((week) => week.days).find(
    (day) => day.date === "2026-08-22",
  );

  assert.equal(saturday?.sessionCount, 2);
  assert.equal(saturday?.completedSets, 3);
  assert.equal(saturday?.intensity, 1);
});

test("eleva la intensidad visual a partir de diez series completadas", () => {
  const manySets: CompletedSession = {
    ...completedSession,
    exercises: [
      {
        ...completedSession.exercises[0]!,
        sets: Array.from({ length: 10 }, (_, index) => ({
          ...completedSession.exercises[0]!.sets[0]!,
          id: `set-${index + 1}`,
        })),
      },
    ],
  };
  const weeks = getTrainingActivityWeeks([manySets], "2026-08-25");
  const saturday = weeks.flatMap((week) => week.days).find(
    (day) => day.date === "2026-08-22",
  );

  assert.equal(saturday?.intensity, 3);
});
