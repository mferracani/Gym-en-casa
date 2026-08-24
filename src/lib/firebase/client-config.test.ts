import assert from "node:assert/strict";
import test from "node:test";

import { parseFirebaseClientConfig } from "./client-config.ts";

test("acepta una configuración web completa", () => {
  const result = parseFirebaseClientConfig({
    apiKey: "api-key",
    appId: "app-id",
    authDomain: "entrena-casa.firebaseapp.com",
    projectId: "entrena-casa",
  });

  assert.deepEqual(result, {
    status: "ready",
    config: {
      apiKey: "api-key",
      appId: "app-id",
      authDomain: "entrena-casa.firebaseapp.com",
      projectId: "entrena-casa",
    },
  });
});

test("informa todas las variables ausentes sin inicializar Firebase", () => {
  const result = parseFirebaseClientConfig({
    apiKey: " ",
    appId: undefined,
    authDomain: "entrena-casa.firebaseapp.com",
    projectId: "",
  });

  assert.deepEqual(result, {
    status: "missing",
    missing: ["apiKey", "appId", "projectId"],
  });
});
