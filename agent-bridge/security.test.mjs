import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedOrigin, parseAllowedOrigins } from "./security.mjs";

test("admite clientes locales y clientes MCP sin Origin", () => {
  const allowedOrigins = parseAllowedOrigins();

  assert.equal(isAllowedOrigin(undefined, allowedOrigins), true);
  assert.equal(isAllowedOrigin("http://localhost:3000", allowedOrigins), true);
  assert.equal(isAllowedOrigin("http://127.0.0.1:3000", allowedOrigins), true);
});

test("rechaza orígenes web no confiables y permite configurar una lista explícita", () => {
  const defaults = parseAllowedOrigins();
  assert.equal(isAllowedOrigin("https://example.com", defaults), false);
  assert.equal(isAllowedOrigin("null", defaults), false);

  const custom = parseAllowedOrigins("https://app.example.com");
  assert.equal(isAllowedOrigin("http://localhost:3000", custom), false);
  assert.equal(isAllowedOrigin("https://app.example.com", custom), true);
});
