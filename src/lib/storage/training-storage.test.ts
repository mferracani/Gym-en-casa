import assert from "node:assert/strict";
import test from "node:test";

import { createInitialAppState } from "../../data/training-catalog.ts";
import { exerciseCatalog, workoutTemplates } from "../../data/training-catalog.ts";
import { createActiveSession } from "../../domain/training/session.ts";
import {
  CURRENT_SCHEMA_VERSION,
  loadTrainingState,
  saveTrainingState,
} from "./training-storage.ts";

function createMemoryStorage() {
  const values = new Map<string, string>();

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
  } satisfies Pick<Storage, "getItem" | "setItem">;
}

test("guarda y recupera el envelope actual", () => {
  const storage = createMemoryStorage();
  const state = createInitialAppState();
  const updatedAt = "2026-08-23T12:00:00.000Z";

  assert.equal(saveTrainingState(storage, state, updatedAt), true);
  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "stored");
  assert.equal(result.updatedAt, updatedAt);
});

test("recupera el estado inicial ante JSON corrupto", () => {
  const storage = createMemoryStorage();
  storage.setItem("entrena-casa:app-state", "{");

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "default");
  assert.equal(result.updatedAt, null);
  assert.equal(result.warning, "corrupt");
});

test("no interpreta esquemas futuros como datos válidos", () => {
  const storage = createMemoryStorage();
  storage.setItem(
    "entrena-casa:app-state",
    JSON.stringify({
      schemaVersion: CURRENT_SCHEMA_VERSION + 1,
      updatedAt: "2026-08-22T10:00:00.000Z",
      data: createInitialAppState(),
    }),
  );

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "default");
  assert.equal(result.warning, "unsupported");
});

test("migra el envelope anterior a la versión vigente", () => {
  const storage = createMemoryStorage();
  storage.setItem(
    "entrena-casa:app-state",
    JSON.stringify({
      schemaVersion: 0,
      updatedAt: "2026-08-22T10:00:00.000Z",
      data: createInitialAppState(),
    }),
  );

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "migrated");
  assert.equal(result.updatedAt, "2026-08-22T10:00:00.000Z");
  assert.equal(result.state.profile.id, "local-profile");
});

test("migra la agenda guardada sin tocar el resto del estado", () => {
  const storage = createMemoryStorage();
  const previousState = {
    ...createInitialAppState(),
    schedule: [
      { weekday: 1, kind: "recovery" },
      {
        weekday: 2,
        kind: "strength",
        workoutTemplateId: "back-video-adaptation",
      },
      { weekday: 3, kind: "recovery" },
      { weekday: 4, kind: "strength" },
      { weekday: 5, kind: "strength" },
      {
        weekday: 6,
        kind: "strength",
        workoutTemplateId: "chest-biceps-adaptation",
      },
      { weekday: 7, kind: "strength" },
    ],
  } as const;

  storage.setItem(
    "entrena-casa:app-state",
    JSON.stringify({
      schemaVersion: 1,
      updatedAt: "2026-08-23T10:00:00.000Z",
      data: previousState,
    }),
  );

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "migrated");
  assert.deepEqual(result.state.profile, previousState.profile);
  assert.deepEqual(result.state.history, previousState.history);
  assert.deepEqual(result.state.activeSession, previousState.activeSession);
  assert.deepEqual(result.state.schedule, [
    { weekday: 1, kind: "recovery" },
    {
      weekday: 2,
      kind: "strength",
      workoutTemplateId: "back-video-adaptation",
    },
    { weekday: 3, kind: "rest" },
    { weekday: 4, kind: "strength" },
    { weekday: 5, kind: "rest" },
    { weekday: 6, kind: "strength" },
    { weekday: 7, kind: "rest" },
  ]);
});

test("migra una sesión activa anterior con estado inicial de cronómetro", () => {
  const storage = createMemoryStorage();
  const initial = createInitialAppState();
  const legacySession = JSON.parse(
    JSON.stringify(
      createActiveSession({
        sessionId: "legacy-active-session",
        scheduledFor: "2026-08-25",
        startedAt: "2026-08-25T10:00:00.000Z",
        template: workoutTemplates[0],
        exercises: exerciseCatalog,
        profile: initial.profile,
      }),
    ),
  );
  delete legacySession.pausedAt;
  delete legacySession.pausedDurationSeconds;

  storage.setItem(
    "entrena-casa:app-state",
    JSON.stringify({
      schemaVersion: 2,
      updatedAt: "2026-08-25T10:03:00.000Z",
      data: { ...initial, activeSession: legacySession },
    }),
  );

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "migrated");
  assert.equal(result.state.activeSession?.pausedAt, null);
  assert.equal(result.state.activeSession?.pausedDurationSeconds, 0);
});
