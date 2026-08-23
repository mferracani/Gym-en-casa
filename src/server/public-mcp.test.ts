import assert from "node:assert/strict";
import test from "node:test";

import { handlePublicMcpRequest } from "./public-mcp.ts";

function mcpRequest(body: unknown, origin?: string) {
  return new Request("https://entrena-casa.example/mcp", {
    method: "POST",
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json",
      ...(origin ? { origin } : {}),
    },
    body: JSON.stringify(body),
  });
}

const dependencies = {
  appBaseUrl: "http://localhost:3000/",
  signProposal: async ({ requestId }: { requestId: string }) =>
    `signed-${requestId}`,
};

test("negocia MCP stateless y publica sólo las herramientas seguras", async () => {
  const initialize = await handlePublicMcpRequest(
    mcpRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-11-25", capabilities: {} },
    }),
    dependencies,
  );
  assert.equal(initialize.status, 200);
  const initializePayload = await initialize.json();
  assert.equal(initializePayload.result.protocolVersion, "2025-11-25");
  assert.deepEqual(initializePayload.result.capabilities, { tools: {} });

  const listed = await handlePublicMcpRequest(
    mcpRequest({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }),
    dependencies,
  );
  const listedPayload = await listed.json();
  assert.deepEqual(
    listedPayload.result.tools.map((tool: { name: string }) => tool.name),
    [
      "list_training_catalog",
      "suggest_workout",
      "queue_workout_proposal",
    ],
  );
  assert.equal(JSON.stringify(listedPayload).includes("get_training_context"), false);
  assert.equal(
    listedPayload.result.tools.every(
      (tool: { annotations: { readOnlyHint: boolean } }) =>
        tool.annotations.readOnlyHint,
    ),
    true,
  );
});

test("devuelve una rutina editorial sin leer datos locales", async () => {
  const response = await handlePublicMcpRequest(
    mcpRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "suggest_workout",
        arguments: { preferredSection: "back-triceps" },
      },
    }),
    dependencies,
  );
  const payload = await response.json();
  const serialized = JSON.stringify(payload);

  assert.equal(response.status, 200);
  assert.equal(payload.result.structuredContent.plan.sectionId, "back-triceps");
  assert.equal(serialized.includes("activeSession"), false);
  assert.equal(serialized.includes("history"), false);
  assert.equal(serialized.includes("localStorage"), false);
  assert.equal(serialized.includes("profile"), false);
});

test("crea un enlace firmado que sigue requiriendo confirmación local", async () => {
  const response = await handlePublicMcpRequest(
    mcpRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "queue_workout_proposal",
        arguments: {
          requestId: "chatgpt-20260823-004",
          preferredSection: "shoulders",
        },
      },
    }),
    dependencies,
  );
  const payload = await response.json();
  const proposal = payload.result.structuredContent.proposal;

  assert.equal(response.status, 200);
  assert.equal(proposal.appUrl.startsWith("http://localhost:3000/#proposal="), true);
  assert.equal(proposal.appUrl.endsWith("signed-chatgpt-20260823-004"), true);
  assert.match(payload.result.content[0].text, /confirmar/i);
});

test("rechaza orígenes web, schemas extra y herramientas privadas", async () => {
  const forbidden = await handlePublicMcpRequest(
    mcpRequest({ jsonrpc: "2.0", id: 5, method: "tools/list", params: {} }, "https://evil.example"),
    dependencies,
  );
  assert.equal(forbidden.status, 403);

  const privateTool = await handlePublicMcpRequest(
    mcpRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: { name: "get_training_context", arguments: {} },
    }),
    dependencies,
  );
  const privatePayload = await privateTool.json();
  assert.equal(privatePayload.error.code, -32601);

  const extraField = await handlePublicMcpRequest(
    mcpRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "suggest_workout",
        arguments: { preferredSection: "abs", history: [] },
      },
    }),
    dependencies,
  );
  const extraPayload = await extraField.json();
  assert.equal(extraPayload.error.code, -32602);
});
