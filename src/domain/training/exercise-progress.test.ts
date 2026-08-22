import assert from "node:assert/strict";
import test from "node:test";

import {
  getExerciseProgress,
  getHistoricalSessionSummaries,
} from "./exercise-progress.ts";
import type { CompletedSession } from "./types.ts";

const history: CompletedSession[] = [
  {
    id: "session-older",
    scheduledFor: "2026-08-16",
    templateId: "chest-biceps-adaptation",
    workoutName: "Pecho + bíceps",
    startedAt: "2026-08-16T10:00:00.000Z",
    completedAt: "2026-08-16T10:35:00.000Z",
    durationSeconds: 2100,
    exercises: [
      {
        exerciseId: "dumbbell-flat-press",
        name: "Press plano con mancuernas",
        targetSets: 2,
        targetReps: 10,
        restSeconds: 60,
        sets: [
          {
            id: "older-1",
            order: 1,
            targetReps: 10,
            actualReps: 10,
            weightKg: 10,
            status: "completed",
            completedAt: "2026-08-16T10:05:00.000Z",
          },
          {
            id: "older-skipped",
            order: 2,
            targetReps: 10,
            actualReps: null,
            weightKg: 20,
            status: "skipped",
            completedAt: null,
          },
        ],
      },
    ],
  },
  {
    id: "session-latest",
    scheduledFor: "2026-08-22",
    templateId: "chest-biceps-adaptation",
    workoutName: "Pecho + bíceps",
    startedAt: "2026-08-22T10:00:00.000Z",
    completedAt: "2026-08-22T10:40:00.000Z",
    durationSeconds: 2400,
    exercises: [
      {
        exerciseId: "dumbbell-flat-press",
        name: "Press plano con mancuernas",
        targetSets: 2,
        targetReps: 10,
        restSeconds: 60,
        sets: [
          {
            id: "latest-1",
            order: 1,
            targetReps: 10,
            actualReps: 8,
            weightKg: 12.5,
            status: "completed",
            completedAt: "2026-08-22T10:05:00.000Z",
          },
          {
            id: "latest-pending",
            order: 2,
            targetReps: 10,
            actualReps: 10,
            weightKg: 30,
            status: "pending",
            completedAt: null,
          },
        ],
      },
    ],
  },
];

test("agrega por ejercicio sólo las series completadas y conserva el último registro", () => {
  assert.deepEqual(getExerciseProgress(history), [
    {
      exerciseId: "dumbbell-flat-press",
      name: "Press plano con mancuernas",
      completedSets: 2,
      totalVolumeKg: 200,
      maxWeightKg: 12.5,
      lastReps: 8,
      lastWeightKg: 12.5,
      lastCompletedAt: "2026-08-22T10:05:00.000Z",
    },
  ]);
});

test("resume cada sesión histórica de manera reconciliable", () => {
  assert.deepEqual(getHistoricalSessionSummaries(history), [
    {
      id: "session-latest",
      workoutName: "Pecho + bíceps",
      scheduledFor: "2026-08-22",
      completedAt: "2026-08-22T10:40:00.000Z",
      completedSets: 1,
      completedRepetitions: 8,
      totalVolumeKg: 100,
    },
    {
      id: "session-older",
      workoutName: "Pecho + bíceps",
      scheduledFor: "2026-08-16",
      completedAt: "2026-08-16T10:35:00.000Z",
      completedSets: 1,
      completedRepetitions: 10,
      totalVolumeKg: 100,
    },
  ]);
});
