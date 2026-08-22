import assert from "node:assert/strict";
import test from "node:test";

import { weeklyScheduleSeed } from "../../data/training-catalog.ts";
import { deriveProgress, getWeekOverview } from "./selectors.ts";
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
