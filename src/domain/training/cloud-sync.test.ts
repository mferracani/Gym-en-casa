import assert from "node:assert/strict";
import test from "node:test";

import { createInitialAppState } from "../../data/training-catalog.ts";
import { mergeTrainingSnapshots } from "./cloud-sync.ts";
import type { AppState, CompletedSession } from "./types.ts";

function completedSession(id: string, completedAt: string): CompletedSession {
  return {
    id,
    scheduledFor: completedAt.slice(0, 10),
    templateId: "chest-biceps-adaptation",
    workoutName: "Pecho + bíceps",
    startedAt: completedAt,
    completedAt,
    durationSeconds: 1800,
    exercises: [],
  };
}

function stateWith(
  displayName: string,
  history: CompletedSession[],
): AppState {
  const initial = createInitialAppState();

  return {
    ...initial,
    profile: { ...initial.profile, displayName },
    history,
  };
}

test("la primera conexión importa la nube cuando el navegador no tiene datos", () => {
  const cloud = stateWith("Mati nube", [
    completedSession("remote-session", "2026-08-20T12:00:00.000Z"),
  ]);

  const merged = mergeTrainingSnapshots(
    {
      state: createInitialAppState(),
      source: "default",
      updatedAt: null,
    },
    { state: cloud, updatedAt: "2026-08-23T10:00:00.000Z" },
  );

  assert.equal(merged.profile.displayName, "Mati nube");
  assert.deepEqual(merged.history.map((session) => session.id), ["remote-session"]);
});

test("conserva el perfil local más reciente y suma sesiones remotas", () => {
  const local = stateWith("Mati local", [
    completedSession("local-session", "2026-08-22T12:00:00.000Z"),
  ]);
  const cloud = stateWith("Mati nube", [
    completedSession("remote-session", "2026-08-20T12:00:00.000Z"),
  ]);

  const merged = mergeTrainingSnapshots(
    {
      state: local,
      source: "stored",
      updatedAt: "2026-08-23T11:00:00.000Z",
    },
    { state: cloud, updatedAt: "2026-08-23T10:00:00.000Z" },
  );

  assert.equal(merged.profile.displayName, "Mati local");
  assert.deepEqual(merged.history.map((session) => session.id), [
    "local-session",
    "remote-session",
  ]);
});

test("usa los datos mutables de la nube más reciente sin perder historial local", () => {
  const local = stateWith("Mati local", [
    completedSession("local-session", "2026-08-20T12:00:00.000Z"),
  ]);
  const cloud = stateWith("Mati nube", [
    completedSession("remote-session", "2026-08-22T12:00:00.000Z"),
  ]);

  const merged = mergeTrainingSnapshots(
    {
      state: local,
      source: "stored",
      updatedAt: "2026-08-23T10:00:00.000Z",
    },
    { state: cloud, updatedAt: "2026-08-23T11:00:00.000Z" },
  );

  assert.equal(merged.profile.displayName, "Mati nube");
  assert.deepEqual(merged.history.map((session) => session.id), [
    "remote-session",
    "local-session",
  ]);
});

test("una sesión repetida mantiene el snapshot del estado ganador", () => {
  const localSession = completedSession(
    "shared-session",
    "2026-08-22T12:00:00.000Z",
  );
  const remoteSession = {
    ...localSession,
    workoutName: "Snapshot remoto",
  };

  const merged = mergeTrainingSnapshots(
    {
      state: stateWith("Mati local", [localSession]),
      source: "stored",
      updatedAt: "2026-08-23T10:00:00.000Z",
    },
    {
      state: stateWith("Mati nube", [remoteSession]),
      updatedAt: "2026-08-23T11:00:00.000Z",
    },
  );

  assert.equal(merged.history.length, 1);
  assert.equal(merged.history[0]?.workoutName, "Snapshot remoto");
});
