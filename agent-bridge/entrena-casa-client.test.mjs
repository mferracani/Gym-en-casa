import assert from "node:assert/strict";
import test from "node:test";

import { createEntrenaCasaClient } from "./entrena-casa-client.mjs";

test("consulta el contexto y encola una propuesta por HTTP local", async () => {
  const requests = [];
  const client = createEntrenaCasaClient({
    baseUrl: "http://localhost:3000",
    fetchImpl: async (url, init = {}) => {
      requests.push({ url, init });
      return new Response(
        JSON.stringify(
          url.endsWith("/context")
            ? { syncedAt: "2026-08-22T12:00:00.000Z", history: [] }
            : { id: "proposal-1", plan: { sectionId: "shoulders" } },
        ),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    },
  });

  await client.getContext();
  await client.queueWorkout({
    requestId: "openclaw-001",
    preferredSection: "shoulders",
    source: "openclaw",
  });

  assert.equal(requests[0].url, "http://localhost:3000/api/agent/context");
  assert.equal(requests[1].url, "http://localhost:3000/api/agent/proposals");
  assert.equal(requests[1].init.method, "POST");
});

test("convierte una respuesta no exitosa en un error útil", async () => {
  const client = createEntrenaCasaClient({
    baseUrl: "http://localhost:3000",
    fetchImpl: async () =>
      new Response(JSON.stringify({ error: "Abrí Entrena Casa primero." }), {
        status: 409,
        headers: { "content-type": "application/json" },
      }),
  });

  await assert.rejects(() => client.getContext(), /Abrí Entrena Casa primero/i);
});
