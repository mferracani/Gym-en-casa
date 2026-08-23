import { createServer } from "node:http";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

import { createEntrenaCasaClient } from "./entrena-casa-client.mjs";
import { isAllowedOrigin, parseAllowedOrigins } from "./security.mjs";

const host = process.env.ENTRENA_CASA_AGENT_HOST ?? "127.0.0.1";
const port = Number(process.env.ENTRENA_CASA_AGENT_PORT ?? 8787);
const allowedOrigins = parseAllowedOrigins(
  process.env.ENTRENA_CASA_AGENT_ALLOWED_ORIGINS,
);
const source =
  process.env.ENTRENA_CASA_AGENT_SOURCE === "chatgpt" ? "chatgpt" : "openclaw";
const client = createEntrenaCasaClient();
const preferredSectionSchema = z.enum([
  "recommend",
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
]);

if (!new Set(["127.0.0.1", "localhost", "::1"]).has(host)) {
  throw new Error(
    "El Agent Bridge sin autenticación sólo puede escuchar en loopback.",
  );
}

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("ENTRENA_CASA_AGENT_PORT debe ser un puerto válido.");
}

function toolResult(key, payload, message) {
  return {
    structuredContent: { [key]: payload },
    content: [{ type: "text", text: message }],
  };
}

function createEntrenaCasaServer() {
  const server = new McpServer(
    { name: "entrena-casa", version: "0.1.0" },
    {
      instructions:
        "Call get_training_context before suggesting or queuing a workout. queue_workout_proposal only creates a pending proposal: the user must review and accept it inside Entrena Casa. Never claim that legs are covered by the current catalog.",
    },
  );

  server.registerTool(
    "get_training_context",
    {
      title: "Consultar contexto de entrenamiento",
      description:
        "Use this when you need the current local session and recent section history before advising or changing today's workout.",
      inputSchema: {},
      outputSchema: { context: z.unknown() },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async () => {
      const context = await client.getContext();
      return toolResult(
        "context",
        context,
        "Contexto local de Entrena Casa sincronizado.",
      );
    },
  );

  server.registerTool(
    "list_training_catalog",
    {
      title: "Listar catálogo de entrenamiento",
      description:
        "Use this when you need the exact supported sections, exercises, muscles, equipment and catalog limits.",
      inputSchema: {},
      outputSchema: { catalog: z.unknown() },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async () => {
      const catalog = await client.getCatalog();
      return toolResult(
        "catalog",
        catalog,
        "Catálogo validado de Entrena Casa disponible.",
      );
    },
  );

  server.registerTool(
    "suggest_workout",
    {
      title: "Sugerir entrenamiento",
      description:
        "Use this when the user wants a read-only workout suggestion based on local history and one supported section.",
      inputSchema: { preferredSection: preferredSectionSchema },
      outputSchema: { plan: z.unknown() },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: false,
      },
    },
    async ({ preferredSection }) => {
      const plan = await client.suggestWorkout({ preferredSection, source });
      return toolResult(
        "plan",
        plan,
        `${plan.name}: ${plan.exercises.length} ejercicios, ${plan.estimatedMinutes} minutos, RIR ${plan.targetRir}.`,
      );
    },
  );

  server.registerTool(
    "queue_workout_proposal",
    {
      title: "Proponer entrenamiento en la app",
      description:
        "Use this when the user explicitly wants ChatGPT or OpenClaw to prepare today's workout in Entrena Casa. It queues a proposal and never starts or overwrites a session without in-app confirmation.",
      inputSchema: {
        requestId: z
          .string()
          .regex(/^[a-zA-Z0-9._:-]{3,80}$/)
          .describe("Stable idempotency key for this requested change."),
        preferredSection: preferredSectionSchema,
      },
      outputSchema: { proposal: z.unknown() },
      annotations: {
        readOnlyHint: false,
        openWorldHint: false,
        destructiveHint: false,
        idempotentHint: true,
      },
    },
    async ({ requestId, preferredSection }) => {
      const proposal = await client.queueWorkout({
        requestId,
        preferredSection,
        source,
      });
      return toolResult(
        "proposal",
        proposal,
        "Propuesta enviada. El usuario debe revisarla y aceptarla dentro de Entrena Casa.",
      );
    },
  );

  return server;
}

const MCP_PATH = "/mcp";
const httpServer = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400).end("Missing URL");
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host ?? host}`);
  const origin = request.headers.origin;

  if (!isAllowedOrigin(origin, allowedOrigins)) {
    response.writeHead(403).end("Origin not allowed");
    return;
  }

  if (request.method === "GET" && url.pathname === "/") {
    response
      .writeHead(200, { "content-type": "application/json" })
      .end(JSON.stringify({ name: "entrena-casa", status: "ready", mcp: MCP_PATH }));
    return;
  }

  if (request.method === "OPTIONS" && url.pathname === MCP_PATH) {
    const headers = {
      "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, mcp-session-id",
      "Access-Control-Expose-Headers": "Mcp-Session-Id",
    };

    if (origin) {
      headers["Access-Control-Allow-Origin"] = origin;
      headers.Vary = "Origin";
    }

    response.writeHead(204, headers);
    response.end();
    return;
  }

  if (
    url.pathname === MCP_PATH &&
    request.method &&
    new Set(["POST", "GET", "DELETE"]).has(request.method)
  ) {
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
    }
    response.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");

    const mcpServer = createEntrenaCasaServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    response.on("close", () => {
      void transport.close();
      void mcpServer.close();
    });

    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(request, response);
    } catch (error) {
      console.error("Agent Bridge request failed:", error);
      if (!response.headersSent) {
        response.writeHead(500).end("Internal server error");
      }
    }
    return;
  }

  response.writeHead(404).end("Not Found");
});

httpServer.listen(port, host, () => {
  console.log(`Entrena Casa Agent Bridge: http://${host}:${port}${MCP_PATH}`);
});
