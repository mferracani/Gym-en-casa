import type { ExerciseSectionId } from "../../domain/training/types.ts";

export const WORKOUT_PROPOSAL_KEY_ID = "entrena-casa-chatgpt-v1";
export const WORKOUT_PROPOSAL_TTL_MS = 15 * 60 * 1_000;

const MAX_TOKEN_LENGTH = 2_048;
const SECTIONS = new Set<ExerciseSectionId>([
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
]);

export interface WorkoutProposalClaims {
  version: 1;
  audience: "entrena-casa";
  requestId: string;
  source: "chatgpt";
  preferredSection: ExerciseSectionId;
  issuedAt: string;
  expiresAt: string;
}

export type WorkoutProposalVerification =
  | { ok: true; proposal: WorkoutProposalClaims }
  | {
      ok: false;
      reason:
        | "invalid-fragment"
        | "invalid-signature"
        | "invalid-payload"
        | "expired";
    };

function base64UrlToBytes(value: string) {
  if (!/^[a-zA-Z0-9_-]+$/.test(value)) return null;

  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
      Math.ceil(value.length / 4) * 4,
      "=",
    );
    const binary = atob(padded);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

function decodeJsonPart(value: string): unknown {
  const bytes = base64UrlToBytes(value);
  if (!bytes) return null;

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function isClaims(value: unknown): value is WorkoutProposalClaims {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, [
      "version",
      "audience",
      "requestId",
      "source",
      "preferredSection",
      "issuedAt",
      "expiresAt",
    ])
  ) {
    return false;
  }

  return (
    value.version === 1 &&
    value.audience === "entrena-casa" &&
    typeof value.requestId === "string" &&
    /^[a-zA-Z0-9._:-]{3,80}$/.test(value.requestId) &&
    value.source === "chatgpt" &&
    typeof value.preferredSection === "string" &&
    SECTIONS.has(value.preferredSection as ExerciseSectionId) &&
    typeof value.issuedAt === "string" &&
    typeof value.expiresAt === "string"
  );
}

export function buildWorkoutProposalLink(baseUrl: string, token: string) {
  const url = new URL(baseUrl);
  url.hash = new URLSearchParams({ proposal: token }).toString();
  return url.toString();
}

export async function verifyWorkoutProposalFragment(
  fragment: string,
  publicKey: CryptoKey,
  now = new Date(),
): Promise<WorkoutProposalVerification> {
  const token = new URLSearchParams(fragment.replace(/^#/, "")).get("proposal");
  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: "invalid-fragment" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "invalid-fragment" };
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = decodeJsonPart(encodedHeader);
  const payload = decodeJsonPart(encodedPayload);
  const signature = base64UrlToBytes(encodedSignature);

  if (
    !isRecord(header) ||
    !hasExactKeys(header, ["alg", "typ", "kid"]) ||
    header.alg !== "EdDSA" ||
    header.typ !== "JWT" ||
    header.kid !== WORKOUT_PROPOSAL_KEY_ID ||
    !signature
  ) {
    return { ok: false, reason: "invalid-payload" };
  }

  const validSignature = await crypto.subtle.verify(
    "Ed25519",
    publicKey,
    signature,
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  if (!validSignature) return { ok: false, reason: "invalid-signature" };
  if (!isClaims(payload)) return { ok: false, reason: "invalid-payload" };

  const issuedAt = Date.parse(payload.issuedAt);
  const expiresAt = Date.parse(payload.expiresAt);
  const nowTimestamp = now.getTime();
  if (
    !Number.isFinite(issuedAt) ||
    !Number.isFinite(expiresAt) ||
    expiresAt - issuedAt !== WORKOUT_PROPOSAL_TTL_MS ||
    issuedAt > nowTimestamp + 60_000
  ) {
    return { ok: false, reason: "invalid-payload" };
  }
  if (expiresAt <= nowTimestamp) return { ok: false, reason: "expired" };

  return { ok: true, proposal: payload };
}
