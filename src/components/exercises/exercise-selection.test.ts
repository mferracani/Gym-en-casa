import assert from "node:assert/strict";
import test from "node:test";

import { isExactExerciseSelection } from "./exercise-selection.ts";

test("distingue dos selecciones con la misma cantidad pero ejercicios distintos", () => {
  assert.equal(
    isExactExerciseSelection(
      ["press-plano", "press-inclinado", "fly", "curl", "martillo"],
      ["press-piso", "press-inclinado", "fly-piso", "curl", "martillo"],
    ),
    false,
  );
});

test("confirma la sugerencia sólo cuando contenido y orden coinciden", () => {
  const suggestion = ["press-piso", "press-inclinado", "fly-piso"];

  assert.equal(isExactExerciseSelection(suggestion, suggestion), true);
  assert.equal(
    isExactExerciseSelection(
      ["press-inclinado", "press-piso", "fly-piso"],
      suggestion,
    ),
    false,
  );
});
