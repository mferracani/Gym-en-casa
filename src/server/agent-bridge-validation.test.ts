import assert from "node:assert/strict";
import test from "node:test";

import {
  agentBridgeIsEnabled,
  isAgentProposalRequest,
  isAgentTrainingContext,
} from "./agent-bridge-validation.ts";

test("acepta sólo contextos reducidos y completos", () => {
  assert.equal(
    isAgentTrainingContext({
      syncedAt: "2026-08-22T12:00:00.000Z",
      profile: {
        equipment: {
          dumbbells: true,
          barbell: true,
          "flat-bench": true,
          "adjustable-bench": true,
          rack: false,
        },
      },
      activeSession: null,
      history: [],
    }),
    true,
  );
  assert.equal(isAgentTrainingContext({ history: [] }), false);
  assert.equal(
    isAgentTrainingContext({
      syncedAt: "2026-08-22T12:00:00.000Z",
      profile: {
        equipment: {
          dumbbells: true,
          barbell: true,
          "flat-bench": true,
          "adjustable-bench": true,
          rack: false,
        },
      },
      activeSession: null,
      history: [],
      unexpected: "not-reduced",
    }),
    false,
  );
});

test("acota origen, sección e idempotency key de las propuestas", () => {
  assert.equal(
    isAgentProposalRequest({
      requestId: "openclaw-001",
      preferredSection: "recommend",
      source: "openclaw",
    }),
    true,
  );
  assert.equal(
    isAgentProposalRequest({
      requestId: "x",
      preferredSection: "legs",
      source: "unknown",
    }),
    false,
  );
});

test("habilita el bridge sólo en desarrollo y permite apagarlo explícitamente", () => {
  assert.equal(agentBridgeIsEnabled({ NODE_ENV: "development" }), true);
  assert.equal(agentBridgeIsEnabled({ NODE_ENV: "production" }), false);
  assert.equal(
    agentBridgeIsEnabled({
      NODE_ENV: "development",
      ENTRENA_CASA_AGENT_BRIDGE: "disabled",
    }),
    false,
  );
});
