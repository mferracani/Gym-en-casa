import assert from "node:assert/strict";
import test from "node:test";

import {
  createSelectionWorkoutTemplate,
  exerciseCatalog,
  shoulderVideoExerciseIds,
  weeklyScheduleSeed,
  workoutTemplates,
} from "./training-catalog.ts";

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

test("los 14 ejercicios del video viven en la sección Hombros y usan mancuernas", () => {
  assert.equal(shoulderVideoExerciseIds.length, 14);

  const definitions = shoulderVideoExerciseIds.map((exerciseId) =>
    exerciseCatalog.find((exercise) => exercise.id === exerciseId),
  );

  assert.equal(definitions.every(Boolean), true);
  assert.equal(definitions.every((exercise) => exercise?.sectionId === "shoulders"), true);
  assert.equal(
    definitions.every((exercise) => exercise?.requiredEquipment.includes("dumbbells")),
    true,
  );
  assert.equal(definitions.every((exercise) => exercise?.requiresRack !== true), true);
});

test("la rutina sugerida de hombros es acotada y evita el remo vertical", () => {
  const template = workoutTemplates.find(
    ({ id }) => id === "shoulders-video-adaptation",
  );

  assert.ok(template);
  assert.equal(template.exercises.length, 4);
  assert.equal(
    template.exercises.every(({ exerciseId }) =>
      shoulderVideoExerciseIds.includes(exerciseId),
    ),
    true,
  );
  assert.equal(
    template.exercises.reduce((total, exercise) => total + exercise.targetSets, 0),
    12,
  );
  assert.equal(
    template.exercises.some(({ exerciseId }) => exerciseId === "dumbbell-upright-row"),
    false,
  );
});

test("una selección personalizada elimina duplicados y conserva el orden elegido", () => {
  const template = createSelectionWorkoutTemplate([
    "standing-dumbbell-lateral-raise",
    "alternating-dumbbell-shoulder-press",
    "standing-dumbbell-lateral-raise",
  ]);

  assert.deepEqual(
    template.exercises.map(({ exerciseId }) => exerciseId),
    [
      "standing-dumbbell-lateral-raise",
      "alternating-dumbbell-shoulder-press",
    ],
  );
  assert.equal(template.name, "Hombros personalizado");
});
