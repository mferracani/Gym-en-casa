import assert from "node:assert/strict";
import test from "node:test";

import { getExerciseMovement } from "../../data/exercise-movements.ts";
import {
  buildMovementSourceUrl,
  buildYouTubeEmbedUrl,
  isValidMovementSegment,
} from "./exercise-movement-utils.ts";

test("arma un embed de YouTube con el tramo exacto del ejercicio", () => {
  const movement = getExerciseMovement("bent-over-dumbbell-rear-delt-fly");

  assert.ok(movement);
  assert.equal(
    buildYouTubeEmbedUrl(movement),
    `https://www.youtube-nocookie.com/embed/${movement.videoId}?start=${movement.startSeconds}&end=${movement.endSeconds}&rel=0&playsinline=1`,
  );
});

test("ofrece un enlace a la fuente en el segundo de inicio", () => {
  const movement = getExerciseMovement("alternating-dumbbell-shoulder-press");

  assert.ok(movement);
  assert.equal(
    buildMovementSourceUrl(movement),
    `https://www.youtube.com/watch?v=${movement.videoId}&t=${movement.startSeconds}s`,
  );
});

test("arma el tramo exacto del press de pecho en piso", () => {
  const movement = getExerciseMovement("dumbbell-floor-press");

  assert.ok(movement);
  assert.equal(
    buildYouTubeEmbedUrl(movement),
    `https://www.youtube-nocookie.com/embed/${movement.videoId}?start=47&end=85&rel=0&playsinline=1`,
  );
  assert.equal(
    buildMovementSourceUrl(movement),
    `https://www.youtube.com/watch?v=${movement.videoId}&t=47s`,
  );
});

test("sólo acepta tramos de video con un final posterior al inicio", () => {
  assert.equal(isValidMovementSegment({ startSeconds: 18, endSeconds: 42 }), true);
  assert.equal(isValidMovementSegment({ startSeconds: 42, endSeconds: 42 }), false);
  assert.equal(isValidMovementSegment({ startSeconds: -1, endSeconds: 42 }), false);
});

test("no inventa un movimiento para ejercicios sin guía editorial", () => {
  assert.equal(getExerciseMovement("barbell-bench-press"), undefined);
});
