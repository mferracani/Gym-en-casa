import assert from "node:assert/strict";
import test from "node:test";

import { createInitialAppState } from "../../data/training-catalog.ts";
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

  assert.equal(saveTrainingState(storage, state), true);
  assert.equal(loadTrainingState(storage, createInitialAppState).source, "stored");
});

test("recupera el estado inicial ante JSON corrupto", () => {
  const storage = createMemoryStorage();
  storage.setItem("entrena-casa:app-state", "{");

  const result = loadTrainingState(storage, createInitialAppState);

  assert.equal(result.source, "default");
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
  assert.equal(result.state.profile.id, "local-profile");
});
