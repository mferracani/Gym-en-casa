import {
  defaultProfile,
  exerciseCatalog,
  workoutTemplates,
} from "../data/training-catalog.ts";
import {
  generateDailyWorkoutPlan,
  getTrainingSectionLabel,
} from "../domain/training/daily-plan.ts";
import type { ExerciseSectionId } from "../domain/training/types.ts";
import { buildWorkoutProposalLink } from "../lib/agent/workout-proposal-link.ts";

const SUPPORTED_PROTOCOL_VERSIONS = new Set([
  "2025-11-25",
  "2025-06-18",
  "2025-03-26",
  "2024-11-05",
  "2024-10-07",
]);
const LATEST_PROTOCOL_VERSION = "2025-11-25";
const MAX_BODY_LENGTH = 32_768;
const PUBLIC_PLAN_DATE = "2026-01-01T12:00:00.000Z";
const SECTION_IDS = [
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
] as const satisfies readonly ExerciseSectionId[];
const SECTION_SET = new Set<ExerciseSectionId>(SECTION_IDS);

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: unknown;
}

interface PublicMcpDependencies {
  appBaseUrl: string;
  allowedOrigins?: ReadonlySet<string>;
  signProposal(input: {
    requestId: string;
    preferredSection: ExerciseSectionId;
    issuedAt?: Date;
  }): Promise<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function responseHeaders() {
  return {
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
  };
}

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: responseHeaders() });
}

function rpcError(id: JsonRpcRequest["id"], code: number, message: string) {
  return jsonResponse({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });
}

function toolResult(key: string, payload: unknown, message: string) {
  return {
    content: [{ type: "text", text: message }],
    structuredContent: { [key]: payload },
  };
}

function sectionInput(argumentsValue: unknown) {
  if (
    !isRecord(argumentsValue) ||
    !hasExactKeys(argumentsValue, ["preferredSection"]) ||
    typeof argumentsValue.preferredSection !== "string" ||
    !SECTION_SET.has(argumentsValue.preferredSection as ExerciseSectionId)
  ) {
    return null;
  }
  return argumentsValue.preferredSection as ExerciseSectionId;
}

function proposalInput(argumentsValue: unknown) {
  if (
    !isRecord(argumentsValue) ||
    !hasExactKeys(argumentsValue, ["requestId", "preferredSection"]) ||
    typeof argumentsValue.requestId !== "string" ||
    !/^[a-zA-Z0-9._:-]{3,80}$/.test(argumentsValue.requestId) ||
    typeof argumentsValue.preferredSection !== "string" ||
    !SECTION_SET.has(argumentsValue.preferredSection as ExerciseSectionId)
  ) {
    return null;
  }

  return {
    requestId: argumentsValue.requestId,
    preferredSection: argumentsValue.preferredSection as ExerciseSectionId,
  };
}

function publicCatalog() {
  return {
    sections: SECTION_IDS.map((sectionId) => ({
      id: sectionId,
      name: getTrainingSectionLabel(sectionId),
      exercises: exerciseCatalog
        .filter((exercise) => exercise.sectionId === sectionId)
        .map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          primaryMuscles: exercise.primaryMuscles,
          secondaryMuscles: exercise.secondaryMuscles,
          requiredEquipment: exercise.requiredEquipment,
        })),
      suggestedTemplate: workoutTemplates.find(
        (template) => template.sectionId === sectionId && template.id.includes("video"),
      )?.id,
    })),
    limits: {
      hasLegTraining: false,
      readsPersonalData: false,
      startsSessions: false,
      requiresInAppConfirmation: true,
    },
  };
}

function publicPlan(sectionId: ExerciseSectionId) {
  const plan = generateDailyWorkoutPlan({
    preferredSection: sectionId,
    source: "chatgpt",
    context: {
      history: [],
      profile: defaultProfile,
      now: PUBLIC_PLAN_DATE,
    },
  });
  return {
    source: plan.source,
    sectionId: plan.sectionId,
    name: plan.name,
    rationale: plan.rationale,
    estimatedMinutes: plan.estimatedMinutes,
    targetRir: plan.targetRir,
    exercises: plan.exercises,
    advisories: plan.advisories,
    progression: plan.progression,
  };
}

const sectionSchema = {
  type: "string",
  enum: SECTION_IDS,
  description: "Sección elegida explícitamente por la persona.",
};

const tools = [
  {
    name: "list_training_catalog",
    title: "Listar catálogo público de Entrena Casa",
    description:
      "Lista las secciones, ejercicios, músculos y equipo editorialmente disponibles. No lee datos personales.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "suggest_workout",
    title: "Sugerir una rutina pública",
    description:
      "Devuelve la base avanzada validada de una sección explícita. No conoce historial, equipo configurado ni sesiones locales.",
    inputSchema: {
      type: "object",
      properties: { preferredSection: sectionSchema },
      required: ["preferredSection"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "queue_workout_proposal",
    title: "Crear enlace de propuesta",
    description:
      "Crea un enlace firmado para revisar una rutina en Entrena Casa. No escribe datos ni inicia una sesión; la persona debe abrir y confirmar el enlace.",
    inputSchema: {
      type: "object",
      properties: {
        requestId: {
          type: "string",
          pattern: "^[a-zA-Z0-9._:-]{3,80}$",
          description: "Identificador estable del pedido.",
        },
        preferredSection: sectionSchema,
      },
      required: ["requestId", "preferredSection"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
] as const;

async function callTool(
  request: JsonRpcRequest,
  dependencies: PublicMcpDependencies,
) {
  if (!isRecord(request.params) || typeof request.params.name !== "string") {
    return rpcError(request.id, -32602, "Parámetros de tools/call inválidos.");
  }

  const argumentsValue = request.params.arguments ?? {};
  switch (request.params.name) {
    case "list_training_catalog":
      if (!isRecord(argumentsValue) || Object.keys(argumentsValue).length !== 0) {
        return rpcError(request.id, -32602, "El catálogo no acepta argumentos.");
      }
      return jsonResponse({
        jsonrpc: "2.0",
        id: request.id ?? null,
        result: toolResult(
          "catalog",
          publicCatalog(),
          "Catálogo público de Entrena Casa disponible.",
        ),
      });
    case "suggest_workout": {
      const sectionId = sectionInput(argumentsValue);
      if (!sectionId) return rpcError(request.id, -32602, "Sección inválida.");
      const plan = publicPlan(sectionId);
      return jsonResponse({
        jsonrpc: "2.0",
        id: request.id ?? null,
        result: toolResult(
          "plan",
          plan,
          `${plan.name}: ${plan.exercises.length} ejercicios, ${plan.estimatedMinutes} minutos y RIR ${plan.targetRir}.`,
        ),
      });
    }
    case "queue_workout_proposal": {
      const input = proposalInput(argumentsValue);
      if (!input) return rpcError(request.id, -32602, "Propuesta inválida.");

      try {
        const token = await dependencies.signProposal(input);
        const proposal = {
          requestId: input.requestId,
          preferredSection: input.preferredSection,
          appUrl: buildWorkoutProposalLink(dependencies.appBaseUrl, token),
          requiresInAppConfirmation: true,
          expiresInMinutes: 15,
        };
        return jsonResponse({
          jsonrpc: "2.0",
          id: request.id ?? null,
          result: toolResult(
            "proposal",
            proposal,
            "Abrí el enlace para revisar la rutina. Tenés que confirmar en Entrena Casa antes de guardar o iniciar algo.",
          ),
        });
      } catch {
        return jsonResponse({
          jsonrpc: "2.0",
          id: request.id ?? null,
          result: {
            isError: true,
            content: [{ type: "text", text: "No se pudo firmar la propuesta." }],
          },
        });
      }
    }
    default:
      return rpcError(request.id, -32601, "Herramienta no disponible.");
  }
}

export async function handlePublicMcpRequest(
  request: Request,
  dependencies: PublicMcpDependencies,
) {
  const origin = request.headers.get("origin");
  if (origin && !dependencies.allowedOrigins?.has(origin)) {
    return new Response("Origin not allowed", { status: 403 });
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return new Response("Content-Type must be application/json", { status: 415 });
  }

  const rawBody = await request.text();
  if (!rawBody || rawBody.length > MAX_BODY_LENGTH) {
    return new Response("Invalid request body", { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return rpcError(null, -32700, "JSON inválido.");
  }
  if (
    !isRecord(body) ||
    body.jsonrpc !== "2.0" ||
    typeof body.method !== "string" ||
    (Object.hasOwn(body, "id") &&
      body.id !== null &&
      typeof body.id !== "string" &&
      typeof body.id !== "number")
  ) {
    return rpcError(null, -32600, "Solicitud JSON-RPC inválida.");
  }
  const rpcRequest = body as unknown as JsonRpcRequest;

  if (!Object.hasOwn(body, "id")) {
    return new Response(null, { status: 202, headers: { "cache-control": "no-store" } });
  }

  if (rpcRequest.method === "initialize") {
    const requestedVersion =
      isRecord(rpcRequest.params) && typeof rpcRequest.params.protocolVersion === "string"
        ? rpcRequest.params.protocolVersion
        : LATEST_PROTOCOL_VERSION;
    if (!SUPPORTED_PROTOCOL_VERSIONS.has(requestedVersion)) {
      return rpcError(rpcRequest.id, -32602, "Versión MCP no soportada.");
    }

    return jsonResponse({
      jsonrpc: "2.0",
      id: rpcRequest.id ?? null,
      result: {
        protocolVersion: requestedVersion,
        capabilities: { tools: {} },
        serverInfo: { name: "entrena-casa-public", version: "0.2.0" },
        instructions:
          "Ask which supported section the user wants before suggesting a workout. This server never reads local history or starts sessions. queue_workout_proposal only returns a signed link that requires confirmation inside Entrena Casa. Never claim legs are covered.",
      },
    });
  }

  if (rpcRequest.method === "ping") {
    return jsonResponse({ jsonrpc: "2.0", id: rpcRequest.id ?? null, result: {} });
  }
  if (rpcRequest.method === "tools/list") {
    return jsonResponse({
      jsonrpc: "2.0",
      id: rpcRequest.id ?? null,
      result: { tools },
    });
  }
  if (rpcRequest.method === "tools/call") {
    return callTool(rpcRequest, dependencies);
  }

  return rpcError(rpcRequest.id, -32601, "Método no disponible.");
}
