import assert from "node:assert/strict";
import test from "node:test";

import { createInitialAppState } from "../../data/training-catalog.ts";
import type { CompletedSession } from "../../domain/training/types.ts";
import {
  createCloudStateDocument,
  parseCloudTrainingSnapshot,
} from "./cloud-state.ts";

const completedSession: CompletedSession = {
  id: "session-1",
  scheduledFor: "2026-08-22",
  templateId: "chest-biceps-adaptation",
  workoutName: "Pecho + bíceps",
  startedAt: "2026-08-22T10:00:00.000Z",
  completedAt: "2026-08-22T10:40:00.000Z",
  durationSeconds: 2400,
  exercises: [],
};

test("serializa el estado mutable sin duplicar el historial", () => {
  const state = {
    ...createInitialAppState(),
    history: [completedSession],
  };

  const document = createCloudStateDocument(
    state,
    "2026-08-23T10:00:00.000Z",
  );

  assert.equal("history" in document, false);
  assert.equal(document.updatedAt, "2026-08-23T10:00:00.000Z");
  assert.deepEqual(document.profile, state.profile);
});

test("reconstruye y valida el estado cloud con sesiones separadas", () => {
  const state = createInitialAppState();
  const document = createCloudStateDocument(
    state,
    "2026-08-23T10:00:00.000Z",
  );

  const snapshot = parseCloudTrainingSnapshot(document, [completedSession]);

  assert.equal(snapshot?.updatedAt, "2026-08-23T10:00:00.000Z");
  assert.deepEqual(snapshot?.state.history, [completedSession]);
});

test("rechaza documentos cloud incompletos", () => {
  assert.equal(
    parseCloudTrainingSnapshot(
      { schemaVersion: 2, updatedAt: "2026-08-23T10:00:00.000Z" },
      [],
    ),
    null,
  );
});
