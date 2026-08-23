import { handlePublicMcpRequest } from "@/server/public-mcp";
import {
  importWorkoutProposalPrivateKey,
  signWorkoutProposal,
} from "@/server/workout-proposal-signing";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

let signingKey: Promise<CryptoKey> | undefined;

function getSigningKey() {
  const pem = process.env.ENTRENA_CASA_PROPOSAL_SIGNING_KEY;
  if (!pem) throw new Error("Falta ENTRENA_CASA_PROPOSAL_SIGNING_KEY.");
  signingKey ??= importWorkoutProposalPrivateKey(pem);
  return signingKey;
}

function allowedOrigins() {
  const configured = process.env.ENTRENA_CASA_MCP_ALLOWED_ORIGINS;
  return new Set(
    configured
      ? configured.split(",").map((origin) => origin.trim()).filter(Boolean)
      : [],
  );
}

export async function POST(request: Request) {
  return handlePublicMcpRequest(request, {
    appBaseUrl:
      process.env.ENTRENA_CASA_PUBLIC_APP_URL ?? "http://localhost:3000/",
    allowedOrigins: allowedOrigins(),
    signProposal: async (input) =>
      signWorkoutProposal(input, await getSigningKey()),
  });
}

export async function GET() {
  return new Response("MCP notifications stream is not available.", {
    status: 405,
    headers: { allow: "POST, OPTIONS", "cache-control": "no-store" },
  });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const configuredOrigins = allowedOrigins();
  if (origin && !configuredOrigins.has(origin)) {
    return new Response("Origin not allowed", { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      allow: "POST, OPTIONS",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers":
        "accept, content-type, mcp-protocol-version",
      ...(origin
        ? { "access-control-allow-origin": origin, vary: "Origin" }
        : {}),
    },
  });
}
