import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWorkoutProposalLink,
  verifyWorkoutProposalFragment,
} from "./workout-proposal-link.ts";
import { signWorkoutProposal } from "../../server/workout-proposal-signing.ts";

async function createKeys() {
  return crypto.subtle.generateKey(
    { name: "Ed25519" },
    true,
    ["sign", "verify"],
  );
}

test("crea y verifica una propuesta firmada sin transportar el plan", async () => {
  const keys = await createKeys();
  const issuedAt = new Date("2026-08-23T12:00:00.000Z");
  const token = await signWorkoutProposal(
    {
      requestId: "chatgpt-20260823-001",
      preferredSection: "chest-biceps",
      issuedAt,
    },
    keys.privateKey,
  );
  const link = buildWorkoutProposalLink("http://localhost:3000/", token);
  const result = await verifyWorkoutProposalFragment(
    new URL(link).hash,
    keys.publicKey,
    issuedAt,
  );

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(result.proposal, {
    version: 1,
    audience: "entrena-casa",
    requestId: "chatgpt-20260823-001",
    source: "chatgpt",
    preferredSection: "chest-biceps",
    issuedAt: "2026-08-23T12:00:00.000Z",
    expiresAt: "2026-08-23T12:15:00.000Z",
  });
  assert.equal(link.includes("exercises"), false);
  assert.equal(link.includes("history"), false);
});

test("rechaza firmas alteradas, propuestas vencidas y fragments excesivos", async () => {
  const keys = await createKeys();
  const issuedAt = new Date("2026-08-23T12:00:00.000Z");
  const token = await signWorkoutProposal(
    {
      requestId: "chatgpt-20260823-002",
      preferredSection: "shoulders",
      issuedAt,
    },
    keys.privateKey,
  );
  const tokenParts = token.split(".");
  const signature = tokenParts[2];
  tokenParts[2] = `${signature.startsWith("a") ? "b" : "a"}${signature.slice(1)}`;
  const alteredToken = tokenParts.join(".");

  const altered = await verifyWorkoutProposalFragment(
    `#proposal=${alteredToken}`,
    keys.publicKey,
    issuedAt,
  );
  assert.deepEqual(altered, { ok: false, reason: "invalid-signature" });

  const expired = await verifyWorkoutProposalFragment(
    `#proposal=${token}`,
    keys.publicKey,
    new Date("2026-08-23T12:16:00.000Z"),
  );
  assert.deepEqual(expired, { ok: false, reason: "expired" });

  const oversized = await verifyWorkoutProposalFragment(
    `#proposal=${"x".repeat(2_049)}`,
    keys.publicKey,
    issuedAt,
  );
  assert.deepEqual(oversized, { ok: false, reason: "invalid-fragment" });
});

test("rechaza una propuesta válida para otra clave", async () => {
  const signerKeys = await createKeys();
  const verifierKeys = await createKeys();
  const issuedAt = new Date("2026-08-23T12:00:00.000Z");
  const token = await signWorkoutProposal(
    {
      requestId: "chatgpt-20260823-003",
      preferredSection: "abs",
      issuedAt,
    },
    signerKeys.privateKey,
  );

  const result = await verifyWorkoutProposalFragment(
    `#proposal=${token}`,
    verifierKeys.publicKey,
    issuedAt,
  );
  assert.deepEqual(result, { ok: false, reason: "invalid-signature" });
});
