import { suggestAgentWorkout } from "@/server/agent-bridge-store";
import {
  agentBridgeIsEnabled,
  isAgentSuggestionRequest,
} from "@/server/agent-bridge-validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!agentBridgeIsEnabled()) {
    return Response.json({ error: "Agent Bridge está disponible sólo en local." }, { status: 404 });
  }

  const payload: unknown = await request.json().catch(() => null);
  if (!isAgentSuggestionRequest(payload)) {
    return Response.json({ error: "Pedido de sugerencia inválido." }, { status: 400 });
  }

  try {
    return Response.json(
      suggestAgentWorkout(payload.preferredSection, payload.source),
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "No se pudo sugerir una rutina." },
      { status: 409 },
    );
  }
}
