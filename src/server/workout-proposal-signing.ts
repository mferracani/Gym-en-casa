import type { ExerciseSectionId } from "../domain/training/types.ts";
import {
  WORKOUT_PROPOSAL_KEY_ID,
  WORKOUT_PROPOSAL_TTL_MS,
  type WorkoutProposalClaims,
} from "../lib/agent/workout-proposal-link.ts";

interface SignWorkoutProposalInput {
  requestId: string;
  preferredSection: ExerciseSectionId;
  issuedAt?: Date;
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function encodeJson(value: unknown) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(value)));
}

export async function signWorkoutProposal(
  input: SignWorkoutProposalInput,
  privateKey: CryptoKey,
) {
  const issuedAt = input.issuedAt ?? new Date();
  const claims: WorkoutProposalClaims = {
    version: 1,
    audience: "entrena-casa",
    requestId: input.requestId,
    source: "chatgpt",
    preferredSection: input.preferredSection,
    issuedAt: issuedAt.toISOString(),
    expiresAt: new Date(issuedAt.getTime() + WORKOUT_PROPOSAL_TTL_MS).toISOString(),
  };
  const encodedHeader = encodeJson({
    alg: "EdDSA",
    typ: "JWT",
    kid: WORKOUT_PROPOSAL_KEY_ID,
  });
  const encodedPayload = encodeJson(claims);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign(
    "Ed25519",
    privateKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

export async function importWorkoutProposalPrivateKey(pem: string) {
  const normalized = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");
  if (!normalized) throw new Error("Falta la clave de firma de propuestas.");

  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    bytes,
    { name: "Ed25519" },
    false,
    ["sign"],
  );
}
