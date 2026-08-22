import assert from "node:assert/strict";
import test from "node:test";

import { exerciseCatalog, workoutTemplates } from "../../data/training-catalog.ts";
import {
  completeSet,
  createActiveSession,
  finishSession,
} from "./session.ts";
import type { Profile } from "./types.ts";

const profile: Profile = {
  id: "local-profile",
  displayName: "Mati",
  defaultRestSeconds: 60,
  weightUnit: "kg",
  equipment: {
    dumbbells: true,
    barbell: true,
    "flat-bench": true,
    "adjustable-bench": true,
    rack: false,
  },
};

test("inicia una sesión con snapshot independiente del catálogo", () => {
  const template = workoutTemplates[0];
  const session = createActiveSession({
    sessionId: "session-1",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template,
    exercises: exerciseCatalog,
    profile,
  });

  assert.equal(session.exercises.length, template.exercises.length);
  assert.equal(session.exercises[0]?.name, "Press plano con mancuernas");
  assert.notEqual(session.exercises[0], template.exercises[0]);
  assert.equal(session.exercises[0]?.sets.length, 3);
});

test("finaliza sólo una sesión con series realizadas y conserva los registros", () => {
  const session = createActiveSession({
    sessionId: "session-2",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile,
  });
  const withFirstSet = completeSet(session, {
    exerciseId: "dumbbell-flat-press",
    setId: "session-2:dumbbell-flat-press:1",
    actualReps: 10,
    weightKg: 12.5,
    completedAt: "2026-08-22T10:05:00.000Z",
  });
  const completed = finishSession(withFirstSet, "2026-08-22T10:35:00.000Z");

  assert.equal(completed.durationSeconds, 2100);
  assert.equal(completed.exercises[0]?.sets[0]?.status, "completed");
  assert.equal(completed.exercises[0]?.sets[0]?.weightKg, 12.5);
});

test("no permite finalizar una sesión sin series completadas", () => {
  const session = createActiveSession({
    sessionId: "session-3",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile,
  });

  assert.throws(() => finishSession(session, "2026-08-22T10:01:00.000Z"));
});
