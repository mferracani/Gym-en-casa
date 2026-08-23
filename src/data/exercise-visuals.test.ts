import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  chestBicepsMuscleMapVisual,
  exerciseVisualsById,
  getExerciseVisual,
  muscleMapVisualsBySection,
} from "./exercise-visuals.ts";
import {
  absVideoExerciseIds,
  backVideoExerciseIds,
  chestVideoExerciseIds,
  shoulderVideoExerciseIds,
  workoutTemplates,
} from "./training-catalog.ts";

test("cada ejercicio de la rutina editorial tiene un visual asociado", () => {
  const exerciseIds = workoutTemplates[0].exercises.map(
    ({ exerciseId }) => exerciseId,
  );

  assert.equal(exerciseIds.length, 5);
  assert.deepEqual(
    exerciseIds.map((exerciseId) => getExerciseVisual(exerciseId)),
    exerciseIds.map((exerciseId) => exerciseVisualsById[exerciseId]),
  );
  assert.equal(
    exerciseIds.every((exerciseId) => getExerciseVisual(exerciseId) !== undefined),
    true,
  );
});

test("no se publica un visual para el press con barra que requiere rack", () => {
  assert.equal(getExerciseVisual("barbell-bench-press"), undefined);
  assert.equal("barbell-bench-press" in exerciseVisualsById, false);
});

test("los visuales tienen rutas públicas, textos alternativos y dimensiones reales", () => {
  const approvedLegacyVisuals = {
    "dumbbell-flat-press": {
      src: "/images/exercises/dumbbell-flat-press.webp",
      alt: "Posiciones baja y alta del press plano con mancuernas, con el pecho resaltado",
      width: 1586,
      height: 992,
    },
    "dumbbell-incline-press": {
      src: "/images/exercises/dumbbell-incline-press.webp",
      alt: "Posiciones baja y alta del press con mancuernas sobre banco inclinado a 30 grados",
      width: 1534,
      height: 1025,
    },
    "dumbbell-fly": {
      src: "/images/exercises/dumbbell-fly.webp",
      alt: "Posiciones abierta y cerrada de las aperturas con mancuernas, con el pecho resaltado",
      width: 1586,
      height: 992,
    },
    "barbell-curl": {
      src: "/images/exercises/barbell-curl.webp",
      alt: "Posiciones baja y flexionada del curl con barra, con los bíceps resaltados",
      width: 1586,
      height: 992,
    },
    "hammer-curl": {
      src: "/images/exercises/hammer-curl.webp",
      alt: "Posiciones baja y flexionada del curl martillo con agarre neutro",
      width: 1586,
      height: 992,
    },
  };

  assert.deepEqual(
    Object.fromEntries(
      Object.keys(approvedLegacyVisuals).map((exerciseId) => [
        exerciseId,
        exerciseVisualsById[exerciseId],
      ]),
    ),
    approvedLegacyVisuals,
  );
  assert.deepEqual(chestBicepsMuscleMapVisual, {
    src: "/images/exercises/chest-biceps-muscle-map.webp",
    alt: "Vista frontal y posterior con pecho y bíceps resaltados",
    width: 1024,
    height: 1536,
  });
});

test("todos los ejercicios publicados en una rutina tienen una guía visual", () => {
  const exerciseIds = new Set(
    workoutTemplates.flatMap((template) =>
      template.exercises.map(({ exerciseId }) => exerciseId),
    ),
  );

  assert.equal(
    [...exerciseIds].every((exerciseId) => getExerciseVisual(exerciseId) !== undefined),
    true,
  );
});

test("todos los movimientos extraídos de videos tienen una lámina propia", () => {
  const videoExerciseIds = [
    ...shoulderVideoExerciseIds,
    ...chestVideoExerciseIds,
    ...backVideoExerciseIds,
    ...absVideoExerciseIds,
  ];

  assert.equal(videoExerciseIds.length, 40);
  assert.equal(
    videoExerciseIds.every((exerciseId) => getExerciseVisual(exerciseId) !== undefined),
    true,
  );
  assert.equal(
    videoExerciseIds.every((exerciseId) => {
      const visual = getExerciseVisual(exerciseId);
      return visual
        ? existsSync(path.join(process.cwd(), "public", visual.src))
        : false;
    }),
    true,
  );
});

test("cada sección funcional tiene un mapa muscular optimizado", () => {
  assert.deepEqual(Object.keys(muscleMapVisualsBySection), [
    "chest-biceps",
    "back-triceps",
    "shoulders",
    "abs",
  ]);
  assert.equal(
    Object.values(muscleMapVisualsBySection).every(({ src }) =>
      src.endsWith(".webp"),
    ),
    true,
  );
});
