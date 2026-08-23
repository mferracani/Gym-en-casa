import assert from "node:assert/strict";
import test from "node:test";

import { defaultProfile } from "../data/training-catalog.ts";
import {
  decideAgentProposal,
  getAgentContext,
  getPendingAgentProposal,
  queueAgentProposal,
  resetAgentBridgeForTests,
  syncAgentContext,
} from "./agent-bridge-store.ts";

test.beforeEach(() => {
  resetAgentBridgeForTests();
});

test("sincroniza un contexto local reducido sin copiar los registros de series", () => {
  syncAgentContext({
    syncedAt: "2026-08-22T12:00:00.000Z",
    profile: { equipment: defaultProfile.equipment },
    activeSession: null,
    history: [],
  });

  assert.deepEqual(getAgentContext(), {
    syncedAt: "2026-08-22T12:00:00.000Z",
    profile: { equipment: defaultProfile.equipment },
    activeSession: null,
    history: [],
  });
});

test("encola una sola propuesta idempotente para confirmación en la app", () => {
  syncAgentContext({
    syncedAt: "2026-08-22T12:00:00.000Z",
    profile: { equipment: defaultProfile.equipment },
    activeSession: null,
    history: [],
  });

  const first = queueAgentProposal({
    requestId: "openclaw-001",
    preferredSection: "back-triceps",
    source: "openclaw",
  });
  const retry = queueAgentProposal({
    requestId: "openclaw-001",
    preferredSection: "back-triceps",
    source: "openclaw",
  });

  assert.equal(first.id, retry.id);
  assert.equal(getPendingAgentProposal()?.plan.sectionId, "back-triceps");

  decideAgentProposal(first.id, "accepted");
  assert.equal(getPendingAgentProposal(), null);
});

test("no permite proponer cambios antes de que la app sincronice su estado", () => {
  assert.throws(
    () =>
      queueAgentProposal({
        requestId: "chatgpt-001",
        preferredSection: "recommend",
        source: "chatgpt",
      }),
    /abrí Entrena Casa/i,
  );
});

test("no pisa una propuesta pendiente ni reutiliza un requestId con otro pedido", () => {
  syncAgentContext({
    syncedAt: "2026-08-22T12:00:00.000Z",
    profile: { equipment: defaultProfile.equipment },
    activeSession: null,
    history: [],
  });

  const pending = queueAgentProposal({
    requestId: "shared-001",
    preferredSection: "shoulders",
    source: "openclaw",
  });

  assert.throws(
    () =>
      queueAgentProposal({
        requestId: "other-001",
        preferredSection: "abs",
        source: "chatgpt",
      }),
    /propuesta pendiente/i,
  );
  assert.throws(
    () =>
      queueAgentProposal({
        requestId: "shared-001",
        preferredSection: "abs",
        source: "openclaw",
      }),
    /otra sección/i,
  );

  decideAgentProposal(pending.id, "rejected");
  const otherSource = queueAgentProposal({
    requestId: "shared-001",
    preferredSection: "abs",
    source: "chatgpt",
  });
  assert.equal(otherSource.plan.source, "chatgpt");
});
