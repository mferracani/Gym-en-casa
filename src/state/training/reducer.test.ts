import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialAppState,
  exerciseCatalog,
  workoutTemplates,
} from "../../data/training-catalog.ts";
import {
  createActiveSession,
  finishSession,
} from "../../domain/training/session.ts";
import { trainingReducer } from "./reducer.ts";

function createSession(id: string) {
  const state = createInitialAppState();

  return createActiveSession({
    sessionId: id,
    scheduledFor: "2026-08-22",
    startedAt: "2026-08-22T10:00:00.000Z",
    template: workoutTemplates[0],
    exercises: exerciseCatalog,
    profile: state.profile,
  });
}

test("mantiene una sola sesión activa", () => {
  const state = createInitialAppState();
  const first = createSession("session-1");
  const second = createSession("session-2");

  const withFirst = trainingReducer(state, {
    type: "session/start",
    session: first,
  });
  const withSecondAttempt = trainingReducer(withFirst, {
    type: "session/start",
    session: second,
  });

  assert.equal(withSecondAttempt.activeSession?.id, "session-1");
});

test("registra una serie, navega y pausa sin mutar el estado anterior", () => {
  const initial = createInitialAppState();
  const session = createSession("session-3");
  const started = trainingReducer(initial, {
    type: "session/start",
    session,
  });
  const setId = session.exercises[0]?.sets[0]?.id;

  assert.ok(setId);

  const completed = trainingReducer(started, {
    type: "session/complete-set",
    exerciseId: "dumbbell-flat-press",
    setId,
    actualReps: 9,
    weightKg: 12.5,
    completedAt: "2026-08-22T10:05:00.000Z",
  });
  const navigated = trainingReducer(completed, {
    type: "session/navigate",
    exerciseIndex: 1,
  });
  const paused = trainingReducer(navigated, { type: "session/pause" });

  assert.equal(
    started.activeSession?.exercises[0]?.sets[0]?.status,
    "pending",
  );
  assert.equal(
    completed.activeSession?.exercises[0]?.sets[0]?.actualReps,
    9,
  );
  assert.equal(navigated.activeSession?.currentExerciseIndex, 1);
  assert.equal(paused.activeSession?.status, "paused");
});

test("mueve una sesión terminada al historial y limpia la sesión activa", () => {
  const initial = createInitialAppState();
  const session = createSession("session-4");
  const setId = session.exercises[0]?.sets[0]?.id;

  assert.ok(setId);

  const started = trainingReducer(initial, {
    type: "session/start",
    session,
  });
  const withSet = trainingReducer(started, {
    type: "session/complete-set",
    exerciseId: "dumbbell-flat-press",
    setId,
    actualReps: 10,
    weightKg: null,
    completedAt: "2026-08-22T10:05:00.000Z",
  });

  assert.ok(withSet.activeSession);

  const historyEntry = finishSession(
    withSet.activeSession,
    "2026-08-22T10:30:00.000Z",
  );
  const finished = trainingReducer(withSet, {
    type: "session/finish",
    session: historyEntry,
  });

  assert.equal(finished.activeSession, null);
  assert.equal(finished.history[0]?.id, "session-4");
});

test("actualiza perfil y agenda recurrente de forma tipada", () => {
  const initial = createInitialAppState();
  const profileUpdated = trainingReducer(initial, {
    type: "profile/update",
    profile: { ...initial.profile, displayName: "Matías" },
  });
  const scheduleUpdated = trainingReducer(profileUpdated, {
    type: "schedule/update",
    day: { weekday: 1, kind: "rest" },
  });

  assert.equal(profileUpdated.profile.displayName, "Matías");
  assert.deepEqual(scheduleUpdated.schedule[0], {
    weekday: 1,
    kind: "rest",
  });
});
