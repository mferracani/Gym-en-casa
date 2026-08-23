import assert from "node:assert/strict";
import test from "node:test";

import {
  absVideoExerciseIds,
  backVideoExerciseIds,
  chestVideoExerciseIds,
  createSelectionWorkoutTemplate,
  exerciseCatalog,
  shoulderVideoExerciseIds,
  weeklyScheduleSeed,
  workoutTemplates,
} from "./training-catalog.ts";

test("los 10 ejercicios del video de abdominales viven en Abdominales y no requieren equipo", () => {
  assert.equal(absVideoExerciseIds.length, 10);

  const definitions = absVideoExerciseIds.map((exerciseId) =>
    exerciseCatalog.find((exercise) => exercise.id === exerciseId),
  );

  assert.equal(definitions.every(Boolean), true);
  assert.equal(definitions.every((exercise) => exercise?.sectionId === "abs"), true);
  assert.equal(
    definitions.every((exercise) => exercise?.requiredEquipment.length === 0),
    true,
  );
});

test("la sugerencia de abdominales usa cuatro movimientos del video", () => {
  const template = workoutTemplates.find(
    ({ id }) => id === "abs-video-adaptation",
  );

  assert.ok(template);
  assert.deepEqual(
    template.exercises.map(({ exerciseId }) => exerciseId),
    [
      "seated-triple-leg-raise",
      "lying-leg-raise",
      "x-crunch",
      "side-plank-hip-dip",
    ],
  );
  assert.equal(
    template.exercises.reduce((total, exercise) => total + exercise.targetSets, 0),
    12,
  );
});

test("los 8 ejercicios del video de espalda viven en Espalda + tríceps y no requieren rack", () => {
  assert.equal(backVideoExerciseIds.length, 8);

  const definitions = backVideoExerciseIds.map((exerciseId) =>
    exerciseCatalog.find((exercise) => exercise.id === exerciseId),
  );

  assert.equal(definitions.every(Boolean), true);
  assert.equal(
    definitions.every((exercise) => exercise?.sectionId === "back-triceps"),
    true,
  );
  assert.equal(
    definitions.every((exercise) => exercise?.requiredEquipment.includes("dumbbells")),
    true,
  );
  assert.equal(definitions.every((exercise) => exercise?.requiresRack !== true), true);
});

test("la sugerencia de espalda usa tres tirones y conserva dos ejercicios de tríceps", () => {
  const template = workoutTemplates.find(
    ({ id }) => id === "back-video-adaptation",
  );

  assert.ok(template);
  assert.deepEqual(
    template.exercises.map(({ exerciseId }) => exerciseId),
    [
      "bent-over-double-dumbbell-row",
      "one-arm-dumbbell-row",
      "incline-chest-supported-dumbbell-shrug",
      "lying-dumbbell-triceps-extension",
      "seated-overhead-dumbbell-triceps-extension",
    ],
  );
  assert.equal(
    template.exercises.reduce((total, exercise) => total + exercise.targetSets, 0),
    15,
  );
});

test("la agenda inicial reserva miércoles, viernes y domingo para descanso", () => {
  assert.deepEqual(weeklyScheduleSeed, [
    { weekday: 1, kind: "strength" },
    { weekday: 2, kind: "strength" },
    { weekday: 3, kind: "rest" },
    { weekday: 4, kind: "strength" },
    { weekday: 5, kind: "rest" },
    { weekday: 6, kind: "strength" },
    { weekday: 7, kind: "rest" },
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

test("los 8 ejercicios del video de pecho viven en Pecho + bíceps y no requieren rack", () => {
  assert.equal(chestVideoExerciseIds.length, 8);

  const definitions = chestVideoExerciseIds.map((exerciseId) =>
    exerciseCatalog.find((exercise) => exercise.id === exerciseId),
  );

  assert.equal(definitions.every(Boolean), true);
  assert.equal(
    definitions.every((exercise) => exercise?.sectionId === "chest-biceps"),
    true,
  );
  assert.equal(
    definitions.every((exercise) => exercise?.requiredEquipment.includes("dumbbells")),
    true,
  );
  assert.equal(definitions.every((exercise) => exercise?.requiresRack !== true), true);
});

test("la sugerencia de pecho usa una adaptación acotada y conserva bíceps", () => {
  const template = workoutTemplates.find(
    ({ id }) => id === "chest-video-adaptation",
  );

  assert.ok(template);
  assert.deepEqual(
    template.exercises.map(({ exerciseId }) => exerciseId),
    [
      "dumbbell-floor-press",
      "dumbbell-incline-press",
      "dumbbell-floor-fly",
      "seated-alternating-dumbbell-curl",
      "hammer-curl",
    ],
  );
  assert.equal(
    template.exercises.reduce((total, exercise) => total + exercise.targetSets, 0),
    14,
  );
  assert.equal(
    template.exercises.some(({ exerciseId }) =>
      [
        "decline-dumbbell-floor-press",
        "dumbbell-handle-push-up",
        "dumbbell-pullover-to-press",
        "staggered-dumbbell-push-up",
      ].includes(exerciseId),
    ),
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
