import assert from "node:assert/strict";
import test from "node:test";

import { verifyWorkoutProposalFragment } from "./workout-proposal-link.ts";
import { getWorkoutProposalPublicKey } from "./workout-proposal-public-key.ts";

const SIGNED_PRODUCTION_KEY_FIXTURE =
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCIsImtpZCI6ImVudHJlbmEtY2FzYS1jaGF0Z3B0LXYxIn0.eyJ2ZXJzaW9uIjoxLCJhdWRpZW5jZSI6ImVudHJlbmEtY2FzYSIsInJlcXVlc3RJZCI6ImZpeHR1cmUtMDAxIiwic291cmNlIjoiY2hhdGdwdCIsInByZWZlcnJlZFNlY3Rpb24iOiJhYnMiLCJpc3N1ZWRBdCI6IjIwMjYtMDgtMjNUMTI6MDA6MDAuMDAwWiIsImV4cGlyZXNBdCI6IjIwMjYtMDgtMjNUMTI6MTU6MDAuMDAwWiJ9.y1WYqPSYGQuuBT9aPR4fEprmVLqJjAEYc2N_SKSuUa7FsNcJ7IgtOhac5GGpYjxg6lqez9sZCpUOBHFkTWKaBg";

test("la clave pública incluida corresponde a la clave privada de despliegue", async () => {
  const result = await verifyWorkoutProposalFragment(
    `#proposal=${SIGNED_PRODUCTION_KEY_FIXTURE}`,
    await getWorkoutProposalPublicKey(),
    new Date("2026-08-23T12:05:00.000Z"),
  );

  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.proposal.requestId, "fixture-001");
});
