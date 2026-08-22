import assert from "node:assert/strict";
import test from "node:test";

import {
  exerciseCatalog,
  workoutTemplates,
} from "../../data/training-catalog.ts";
import {
  getAvailableWorkoutTemplates,
  getMissingExerciseEquipment,
  isExerciseAvailable,
  isWorkoutTemplateAvailable,
} from "./constraints.ts";
import type { Profile } from "./types.ts";

const profileWithoutRack: Profile = {
  id: "local-profile",
  displayName: "Mati",
  defaultRestSeconds: 60,
  weightUnit: "kg",
  equipment: {
    dumbbells: true,
    barbell: true,
    "flat-bench": true,
    "adjustable-bench": true,
    rack: false,
  },
};

test("excluye ejercicios que requieren rack aunque haya barra", () => {
  const barbellBenchPress = exerciseCatalog.find(
    (exercise) => exercise.id === "barbell-bench-press",
  );

  assert.ok(barbellBenchPress);
  assert.equal(isExerciseAvailable(barbellBenchPress, profileWithoutRack), false);
});

test("las plantillas publicadas son compatibles con el equipamiento sin rack", () => {
  const chestBiceps = workoutTemplates.find(
    (template) => template.id === "chest-biceps-adaptation",
  );

  assert.ok(chestBiceps);
  assert.equal(
    isWorkoutTemplateAvailable(chestBiceps, exerciseCatalog, profileWithoutRack),
    true,
  );
  assert.deepEqual(
    getAvailableWorkoutTemplates(
      workoutTemplates,
      exerciseCatalog,
      profileWithoutRack,
    ).map((template) => template.id),
    [
      "chest-biceps-adaptation",
      "back-triceps-adaptation",
      "shoulders-video-adaptation",
      "abs-adaptation",
    ],
  );
});

test("explica qué equipo falta antes de agregar un ejercicio", () => {
  const inclinePress = exerciseCatalog.find(
    (exercise) => exercise.id === "dumbbell-incline-press",
  );
  const profileWithoutAdjustableBench: Profile = {
    ...profileWithoutRack,
    equipment: {
      ...profileWithoutRack.equipment,
      "adjustable-bench": false,
    },
  };

  assert.ok(inclinePress);
  assert.deepEqual(
    getMissingExerciseEquipment(inclinePress, profileWithoutAdjustableBench),
    ["adjustable-bench"],
  );
});
