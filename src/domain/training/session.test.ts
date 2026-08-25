import assert from "node:assert/strict";
import test from "node:test";

import { exerciseCatalog, workoutTemplates } from "../../data/training-catalog.ts";
import {
  completeSet,
  createActiveSession,
  finishSession,
  getSessionElapsedSeconds,
  pauseSession,
  resumeSession,
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

test("calcula el cronómetro por timestamps aunque la app no esté abierta", () => {
  const session = createActiveSession({
    sessionId: "session-timer-1",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile,
  });
  const restored = JSON.parse(JSON.stringify(session));

  assert.equal(
    getSessionElapsedSeconds(restored, "2026-08-22T10:12:34.000Z"),
    754,
  );
});

test("pausar congela el cronómetro y retomar descuenta la pausa", () => {
  const session = createActiveSession({
    sessionId: "session-timer-2",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile,
  });
  const paused = pauseSession(session, "2026-08-22T10:05:00.000Z");

  assert.equal(
    getSessionElapsedSeconds(paused, "2026-08-22T10:15:00.000Z"),
    300,
  );

  const resumed = resumeSession(paused, "2026-08-22T10:15:00.000Z");

  assert.equal(
    getSessionElapsedSeconds(resumed, "2026-08-22T10:20:00.000Z"),
    600,
  );
});

test("finalizar guarda la duración activa sin sumar pausas", () => {
  const session = createActiveSession({
    sessionId: "session-timer-3",
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile,
  });
  const withSet = completeSet(session, {
    exerciseId: "dumbbell-flat-press",
    setId: "session-timer-3:dumbbell-flat-press:1",
    actualReps: 10,
    weightKg: null,
    completedAt: "2026-08-22T10:04:00.000Z",
  });
  const paused = pauseSession(withSet, "2026-08-22T10:05:00.000Z");
  const resumed = resumeSession(paused, "2026-08-22T10:15:00.000Z");
  const completed = finishSession(resumed, "2026-08-22T10:30:00.000Z");

  assert.equal(completed.durationSeconds, 1200);
});
