import assert from "node:assert/strict";
import test from "node:test";

import { weeklyScheduleSeed } from "./training-catalog.ts";

test("la agenda inicial sólo asigna Pecho + bíceps al sábado", () => {
  const assignedTemplates = weeklyScheduleSeed.filter(
    (day) => day.workoutTemplateId !== undefined,
  );

  assert.deepEqual(assignedTemplates, [
    {
      weekday: 6,
      kind: "strength",
      workoutTemplateId: "chest-biceps-adaptation",
    },
  ]);
});
