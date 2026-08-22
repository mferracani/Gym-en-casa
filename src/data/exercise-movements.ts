export const SHOULDER_VIDEO_ID = "qI7TfFGM0HE";

export interface ExerciseMovement {
  exerciseId: string;
  order: number;
  videoId: string;
  startSeconds: number;
  endSeconds: number;
  sourceExerciseName: string;
  recommended: boolean;
  editorialNote?: string;
}

export const shoulderVideoMovements = [
  {
    exerciseId: "bent-over-dumbbell-rear-delt-fly",
    order: 1,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 7,
    endSeconds: 24,
    sourceExerciseName: "Fly con mancuernas",
    recommended: true,
  },
  {
    exerciseId: "standing-double-dumbbell-front-raise",
    order: 2,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 27,
    endSeconds: 39,
    sourceExerciseName: "Elevación frontal doble",
    recommended: false,
    editorialNote: "Accesorio opcional: el press de hombros ya trabaja el deltoide anterior.",
  },
  {
    exerciseId: "standing-dumbbell-lateral-raise",
    order: 3,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 42,
    endSeconds: 54,
    sourceExerciseName: "Elevación lateral doble",
    recommended: true,
  },
  {
    exerciseId: "dumbbell-upright-row",
    order: 4,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 58,
    endSeconds: 69,
    sourceExerciseName: "Remo vertical con mancuernas",
    recommended: false,
    editorialNote:
      "No forma parte de la sugerencia inicial. Si sentís pinzamiento, reemplazalo por una elevación lateral.",
  },
  {
    exerciseId: "alternating-dumbbell-front-raise",
    order: 5,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 72,
    endSeconds: 84,
    sourceExerciseName: "Elevación frontal alternada",
    recommended: false,
    editorialNote: "Accesorio opcional: no hace falta combinar todas las variantes frontales.",
  },
  {
    exerciseId: "alternating-dumbbell-shoulder-press",
    order: 6,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 87,
    endSeconds: 99,
    sourceExerciseName: "Press de hombros alternado",
    recommended: true,
  },
  {
    exerciseId: "two-hand-dumbbell-front-raise",
    order: 7,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 102,
    endSeconds: 116,
    sourceExerciseName: "Elevación frontal con mancuerna",
    recommended: false,
    editorialNote: "Elegí esta variante o una elevación frontal con dos mancuernas, no ambas.",
  },
  {
    exerciseId: "seated-dumbbell-lateral-raise",
    order: 8,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 123,
    endSeconds: 137,
    sourceExerciseName: "Fly en banco plano",
    recommended: false,
    editorialNote: "Variante estable de la elevación lateral; alternala con la versión de pie.",
  },
  {
    exerciseId: "incline-bench-dumbbell-front-raise",
    order: 9,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 140,
    endSeconds: 153,
    sourceExerciseName: "Elevación en banco inclinado",
    recommended: false,
    editorialNote: "Accesorio opcional para el deltoide anterior.",
  },
  {
    exerciseId: "incline-bench-reverse-fly",
    order: 10,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 156,
    endSeconds: 167,
    sourceExerciseName: "Fly en banco inclinado",
    recommended: true,
  },
  {
    exerciseId: "bench-supported-rear-delt-row",
    order: 11,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 170,
    endSeconds: 179,
    sourceExerciseName: "Remo para deltoide a una mano",
    recommended: true,
  },
  {
    exerciseId: "incline-side-lying-dumbbell-lateral-raise",
    order: 12,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 184,
    endSeconds: 195,
    sourceExerciseName: "Elevación lateral en banco inclinado",
    recommended: false,
    editorialNote: "Variante unilateral opcional; alternala con otra elevación lateral.",
  },
  {
    exerciseId: "seated-arnold-press",
    order: 13,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 198,
    endSeconds: 209,
    sourceExerciseName: "Press de Arnold en banco",
    recommended: false,
    editorialNote: "Usalo como alternativa al press alternado, no como segundo press obligatorio.",
  },
  {
    exerciseId: "seated-double-dumbbell-front-raise",
    order: 14,
    videoId: SHOULDER_VIDEO_ID,
    startSeconds: 214,
    endSeconds: 228,
    sourceExerciseName: "Elevación frontal doble",
    recommended: false,
    editorialNote: "Variante sentada; elegí una sola elevación frontal por sesión.",
  },
] as const satisfies readonly ExerciseMovement[];

const movementByExerciseId = new Map<string, ExerciseMovement>(
  shoulderVideoMovements.map((movement) => [movement.exerciseId, movement]),
);

export function getExerciseMovement(
  exerciseId: string,
): ExerciseMovement | undefined {
  return movementByExerciseId.get(exerciseId);
}
