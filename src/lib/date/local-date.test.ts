import assert from "node:assert/strict";
import test from "node:test";

import { getMonday, localDateFromDate } from "./local-date.ts";

test("calcula lunes y fecha local sin convertir a UTC", () => {
  const saturday = new Date(2026, 7, 22, 0, 30);

  assert.equal(localDateFromDate(saturday), "2026-08-22");
  assert.equal(getMonday("2026-08-22"), "2026-08-17");
});
