import {
  decideAgentProposal,
  getPendingAgentProposal,
  queueAgentProposal,
} from "@/server/agent-bridge-store";
import {
  agentBridgeIsEnabled,
  isAgentProposalDecision,
  isAgentProposalRequest,
} from "@/server/agent-bridge-validation";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!agentBridgeIsEnabled()) {
    return Response.json(
      { bridgeEnabled: false, proposal: null },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return Response.json(
    { bridgeEnabled: true, proposal: getPendingAgentProposal() },
    { headers: { "cache-control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!agentBridgeIsEnabled()) {
    return Response.json({ error: "Agent Bridge está disponible sólo en local." }, { status: 404 });
  }

  const payload: unknown = await request.json().catch(() => null);
  if (!isAgentProposalRequest(payload)) {
    return Response.json({ error: "Propuesta de entrenamiento inválida." }, { status: 400 });
  }

  try {
    return Response.json(queueAgentProposal(payload), { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "No se pudo preparar la propuesta." },
      { status: 409 },
    );
  }
}

export async function PATCH(request: Request) {
  if (!agentBridgeIsEnabled()) {
    return Response.json({ error: "Agent Bridge está disponible sólo en local." }, { status: 404 });
  }

  const payload: unknown = await request.json().catch(() => null);
  if (!isAgentProposalDecision(payload)) {
    return Response.json({ error: "Decisión de propuesta inválida." }, { status: 400 });
  }

  try {
    return Response.json(
      decideAgentProposal(payload.proposalId, payload.decision),
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "La propuesta ya no está disponible." },
      { status: 409 },
    );
  }
}
