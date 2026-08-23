import {
  getAgentContext,
  syncAgentContext,
} from "@/server/agent-bridge-store";
import {
  agentBridgeIsEnabled,
  isAgentTrainingContext,
} from "@/server/agent-bridge-validation";

export const dynamic = "force-dynamic";

function unavailable() {
  return Response.json({ error: "Agent Bridge está disponible sólo en local." }, { status: 404 });
}

export async function GET() {
  if (!agentBridgeIsEnabled()) return unavailable();

  const context = getAgentContext();
  return context
    ? Response.json(context, { headers: { "cache-control": "no-store" } })
    : Response.json(
        { error: "Abrí Entrena Casa primero para sincronizar el estado local." },
        { status: 409 },
      );
}

export async function POST(request: Request) {
  if (!agentBridgeIsEnabled()) return unavailable();

  const payload: unknown = await request.json().catch(() => null);
  if (!isAgentTrainingContext(payload)) {
    return Response.json({ error: "Contexto de entrenamiento inválido." }, { status: 400 });
  }

  syncAgentContext(payload);
  return Response.json({ ok: true });
}
