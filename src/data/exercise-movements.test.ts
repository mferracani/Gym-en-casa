import assert from "node:assert/strict";
import test from "node:test";

import {
  ABS_VIDEO_ID,
  BACK_VIDEO_ID,
  CHEST_VIDEO_ID,
  SHOULDER_VIDEO_ID,
  absVideoMovements,
  backVideoMovements,
  chestVideoMovements,
  getExerciseMovement,
  shoulderVideoMovements,
} from "./exercise-movements.ts";

test("el video de abdominales expone sus 10 movimientos en orden y sin duplicados", () => {
  assert.equal(absVideoMovements.length, 10);
  assert.deepEqual(
    absVideoMovements.map(({ order }) => order),
    Array.from({ length: 10 }, (_, index) => index + 1),
  );
  assert.equal(
    new Set(absVideoMovements.map(({ exerciseId }) => exerciseId)).size,
    10,
  );
});

test("cada movimiento de abdominales conserva un tramo reproducible del video fuente", () => {
  for (const movement of absVideoMovements) {
    assert.equal(movement.videoId, ABS_VIDEO_ID);
    assert.equal(movement.startSeconds >= 0, true);
    assert.equal(movement.endSeconds > movement.startSeconds, true);
    assert.equal(movement.endSeconds <= 252, true);
    assert.equal(getExerciseMovement(movement.exerciseId), movement);
  }
});

test("el video de espalda expone sus 8 movimientos en orden y sin duplicados", () => {
  assert.equal(backVideoMovements.length, 8);
  assert.deepEqual(
    backVideoMovements.map(({ order }) => order),
    Array.from({ length: 8 }, (_, index) => index + 1),
  );
  assert.equal(
    new Set(backVideoMovements.map(({ exerciseId }) => exerciseId)).size,
    8,
  );
});

test("cada movimiento de espalda conserva un tramo reproducible del video fuente", () => {
  for (const movement of backVideoMovements) {
    assert.equal(movement.videoId, BACK_VIDEO_ID);
    assert.equal(movement.startSeconds >= 0, true);
    assert.equal(movement.endSeconds > movement.startSeconds, true);
    assert.equal(movement.endSeconds <= 181, true);
    assert.equal(getExerciseMovement(movement.exerciseId), movement);
  }
});

test("las variantes supinas de espalda no se mezclan con las de agarre neutro", () => {
  const standingUnderhand = getExerciseMovement(
    "underhand-bent-over-dumbbell-row",
  );
  const supportedUnderhand = getExerciseMovement(
    "underhand-chest-supported-dumbbell-row",
  );

  assert.match(standingUnderhand?.sourceExerciseName ?? "", /agarre invertido/i);
  assert.match(supportedUnderhand?.sourceExerciseName ?? "", /agarre invertido/i);
  assert.notEqual(standingUnderhand?.exerciseId, supportedUnderhand?.exerciseId);
});

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
