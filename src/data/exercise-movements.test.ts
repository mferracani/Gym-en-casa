import assert from "node:assert/strict";
import test from "node:test";

import {
  CHEST_VIDEO_ID,
  SHOULDER_VIDEO_ID,
  chestVideoMovements,
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

test("el video de pecho expone sus 8 movimientos en orden y sin duplicados", () => {
  assert.equal(chestVideoMovements.length, 8);
  assert.deepEqual(
    chestVideoMovements.map(({ order }) => order),
    Array.from({ length: 8 }, (_, index) => index + 1),
  );
  assert.equal(
    new Set(chestVideoMovements.map(({ exerciseId }) => exerciseId)).size,
    8,
  );
});

test("cada movimiento de pecho conserva su tramo exacto y la fuente original", () => {
  for (const movement of chestVideoMovements) {
    assert.equal(movement.videoId, CHEST_VIDEO_ID);
    assert.equal(movement.startSeconds >= 0, true);
    assert.equal(movement.endSeconds > movement.startSeconds, true);
    assert.equal(movement.endSeconds <= 280, true);
    assert.equal(getExerciseMovement(movement.exerciseId), movement);
  }
});

test("las dos flexiones del video de pecho no se confunden entre sí", () => {
  const handlePushUp = getExerciseMovement("dumbbell-handle-push-up");
  const staggeredPushUp = getExerciseMovement("staggered-dumbbell-push-up");

  assert.match(handlePushUp?.sourceExerciseName ?? "", /dos mancuernas/i);
  assert.match(staggeredPushUp?.sourceExerciseName ?? "", /escalonada/i);
  assert.notEqual(handlePushUp?.exerciseId, staggeredPushUp?.exerciseId);
});
