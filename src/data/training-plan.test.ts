import assert from "node:assert/strict";
import test from "node:test";

import { todayPlan } from "./training-plan.ts";

test("el inicio concentra la información obligatoria del Sprint 1", () => {
  assert.equal(todayPlan.name, "Pecho + bíceps");
  assert.equal(todayPlan.durationMinutes, 60);
  assert.equal(todayPlan.exercises.length, 5);
  assert.deepEqual(todayPlan.scheme, { sets: 3, repetitions: 10 });
  assert.deepEqual(
    todayPlan.muscles.map(({ name, role }) => ({ name, role })),
    [
      { name: "Pecho", role: "principal" },
      { name: "Bíceps", role: "secundario" },
    ],
  );
});

test("la rutina respeta la restricción de seguridad por falta de rack", () => {
  assert.equal(todayPlan.equipment.hasRack, false);
  assert.equal(
    todayPlan.exercises.some((exercise) => exercise.id === "barbell-bench-press"),
    false,
  );
  assert.match(todayPlan.safetyNotice, /sin rack/i);
  assert.match(todayPlan.safetyNotice, /mancuernas/i);
});
