import assert from "node:assert/strict";
import test from "node:test";

import {
  SHOULDER_VIDEO_ID,
  getExerciseMovement,
  shoulderVideoMovements,
} from "./exercise-movements.ts";

test("el video de hombros expone sus 14 movimientos en orden y sin duplicados", () => {
  assert.equal(shoulderVideoMovements.length, 14);
  assert.deepEqual(
    shoulderVideoMovements.map(({ order }) => order),
    Array.from({ length: 14 }, (_, index) => index + 1),
  );
  assert.equal(
    new Set(shoulderVideoMovements.map(({ exerciseId }) => exerciseId)).size,
    14,
  );
});

test("cada movimiento apunta a un tramo reproducible del video fuente", () => {
  for (const movement of shoulderVideoMovements) {
    assert.equal(movement.videoId, SHOULDER_VIDEO_ID);
    assert.equal(movement.startSeconds >= 0, true);
    assert.equal(movement.endSeconds > movement.startSeconds, true);
    assert.equal(movement.endSeconds <= 230, true);
    assert.equal(getExerciseMovement(movement.exerciseId), movement);
  }
});

test("el remo vertical conserva una advertencia editorial y no se presenta como sugerido", () => {
  const uprightRow = getExerciseMovement("dumbbell-upright-row");

  assert.equal(uprightRow?.recommended, false);
  assert.match(uprightRow?.editorialNote ?? "", /elevaci.n lateral/i);
});
