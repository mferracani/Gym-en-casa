export const SHOULDER_VIDEO_ID = "qI7TfFGM0HE";
export const CHEST_VIDEO_ID = "tKijsY8sRmo";
export const BACK_VIDEO_ID = "CCLrgxrr8vM";
export const ABS_VIDEO_ID = "UtRrE-X-KPQ";

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

export const absVideoMovements = [
  {
    exerciseId: "seated-triple-leg-raise",
    order: 1,
    videoId: ABS_VIDEO_ID,
    startSeconds: 10,
    endSeconds: 34,
    sourceExerciseName: "Triple elevación",
    recommended: true,
  },
  {
    exerciseId: "lying-windshield-wiper",
    order: 2,
    videoId: ABS_VIDEO_ID,
    startSeconds: 34,
    endSeconds: 55,
    sourceExerciseName: "Wipers",
    recommended: false,
    editorialNote:
      "Variante rotacional avanzada: acortá el recorrido si la zona lumbar se despega del piso.",
  },
  {
    exerciseId: "floor-crunch",
    order: 3,
    videoId: ABS_VIDEO_ID,
    startSeconds: 55,
    endSeconds: 78,
    sourceExerciseName: "Crunch",
    recommended: false,
    editorialNote:
      "Alternativa simple. Elegí este crunch o una variante dinámica, no hace falta sumar todas.",
  },
  {
    exerciseId: "forearm-plank",
    order: 4,
    videoId: ABS_VIDEO_ID,
    startSeconds: 78,
    endSeconds: 103,
    sourceExerciseName: "Planchas",
    recommended: false,
    editorialNote:
      "El video propone medirla por tiempo; cortá la serie cuando pierdas la alineación.",
  },
  {
    exerciseId: "lying-leg-raise",
    order: 5,
    videoId: ABS_VIDEO_ID,
    startSeconds: 103,
    endSeconds: 129,
    sourceExerciseName: "Elevación de piernas",
    recommended: true,
  },
  {
    exerciseId: "cross-body-crunch",
    order: 6,
    videoId: ABS_VIDEO_ID,
    startSeconds: 129,
    endSeconds: 152,
    sourceExerciseName: "Crunches",
    recommended: false,
    editorialNote:
      "Variante cruzada opcional: alterná los lados sin tirar de la nuca.",
  },
  {
    exerciseId: "x-crunch",
    order: 7,
    videoId: ABS_VIDEO_ID,
    startSeconds: 152,
    endSeconds: 174,
    sourceExerciseName: "X crunches",
    recommended: true,
  },
  {
    exerciseId: "wide-stance-plank",
    order: 8,
    videoId: ABS_VIDEO_ID,
    startSeconds: 174,
    endSeconds: 196,
    sourceExerciseName: "Plancha abierta",
    recommended: false,
    editorialNote:
      "Variante isométrica: mantené manos y pies firmes y evitá hundir la zona lumbar.",
  },
  {
    exerciseId: "twisting-crunch",
    order: 9,
    videoId: ABS_VIDEO_ID,
    startSeconds: 196,
    endSeconds: 219,
    sourceExerciseName: "Crunch con giros",
    recommended: false,
    editorialNote:
      "Alternativa rotacional. Elegila en lugar del crunch cruzado si querés variar.",
  },
  {
    exerciseId: "side-plank-hip-dip",
    order: 10,
    videoId: ABS_VIDEO_ID,
    startSeconds: 219,
    endSeconds: 247,
    sourceExerciseName: "Planchas laterales",
    recommended: true,
  },
] as const satisfies readonly ExerciseMovement[];

export const backVideoMovements = [
  {
    exerciseId: "renegade-dumbbell-row",
    order: 1,
    videoId: BACK_VIDEO_ID,
    startSeconds: 0,
    endSeconds: 34,
    sourceExerciseName: "Remo con mancuernas",
    recommended: false,
    editorialNote:
      "Variante avanzada: usá dos mancuernas hexagonales estables y evitá rotar la cadera.",
  },
  {
    exerciseId: "bent-over-double-dumbbell-row",
    order: 2,
    videoId: BACK_VIDEO_ID,
    startSeconds: 34,
    endSeconds: 53,
    sourceExerciseName: "Jalones con mancuernas",
    recommended: true,
  },
  {
    exerciseId: "underhand-bent-over-dumbbell-row",
    order: 3,
    videoId: BACK_VIDEO_ID,
    startSeconds: 53,
    endSeconds: 75,
    sourceExerciseName: "Jalones con agarre invertido",
    recommended: false,
    editorialNote:
      "Alternativa supina al remo inclinado bilateral; elegí una de las dos variantes.",
  },
  {
    exerciseId: "one-arm-dumbbell-row",
    order: 4,
    videoId: BACK_VIDEO_ID,
    startSeconds: 75,
    endSeconds: 95,
    sourceExerciseName: "Jalones en banco",
    recommended: true,
  },
  {
    exerciseId: "chest-supported-dumbbell-row",
    order: 5,
    videoId: BACK_VIDEO_ID,
    startSeconds: 95,
    endSeconds: 115,
    sourceExerciseName: "Jalones dobles en banco inclinado",
    recommended: false,
    editorialNote:
      "Variante estable. Alternala con el remo bilateral de pie para no repetir el mismo patrón.",
  },
  {
    exerciseId: "underhand-chest-supported-dumbbell-row",
    order: 6,
    videoId: BACK_VIDEO_ID,
    startSeconds: 115,
    endSeconds: 135,
    sourceExerciseName:
      "Jalones dobles con agarre invertido en banco inclinado",
    recommended: false,
    editorialNote:
      "Alternativa supina con banco. Usala en lugar del remo con pecho apoyado neutro.",
  },
  {
    exerciseId: "incline-chest-supported-dumbbell-shrug",
    order: 7,
    videoId: BACK_VIDEO_ID,
    startSeconds: 135,
    endSeconds: 155,
    sourceExerciseName: "Press para trapecio en banco inclinado",
    recommended: true,
  },
  {
    exerciseId: "standing-dumbbell-shrug",
    order: 8,
    videoId: BACK_VIDEO_ID,
    startSeconds: 155,
    endSeconds: 181,
    sourceExerciseName: "Press para trapecio con mancuernas",
    recommended: false,
    editorialNote:
      "Alternativa de pie. Elegí este encogimiento o el apoyado en banco, no ambos.",
  },
] as const satisfies readonly ExerciseMovement[];

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

export const chestVideoMovements = [
  {
    exerciseId: "incline-dumbbell-fly-press",
    order: 1,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 8,
    endSeconds: 44,
    sourceExerciseName: "Aperturas + press inclinado",
    recommended: false,
    editorialNote:
      "Combinación avanzada. Empezá con poco peso o elegí el press inclinado simple.",
  },
  {
    exerciseId: "dumbbell-floor-press",
    order: 2,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 47,
    endSeconds: 85,
    sourceExerciseName: "Press con mancuernas en el piso",
    recommended: true,
  },
  {
    exerciseId: "decline-dumbbell-floor-press",
    order: 3,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 88,
    endSeconds: 114,
    sourceExerciseName: "Press declinado con cadera elevada",
    recommended: false,
    editorialNote:
      "Variante opcional: exige sostener un puente estable durante toda la serie.",
  },
  {
    exerciseId: "dumbbell-floor-fly",
    order: 4,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 115,
    endSeconds: 145,
    sourceExerciseName: "Aperturas con mancuernas en el piso",
    recommended: true,
    editorialNote: "Usá poco peso y frená antes si el hombro pierde una posición cómoda.",
  },
  {
    exerciseId: "dumbbell-handle-push-up",
    order: 5,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 148,
    endSeconds: 180,
    sourceExerciseName: "Flexión sobre dos mancuernas",
    recommended: false,
    editorialNote:
      "Sólo con mancuernas hexagonales que no rueden. Si no, apoyá las manos en el piso.",
  },
  {
    exerciseId: "dumbbell-pullover-to-press",
    order: 6,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 183,
    endSeconds: 221,
    sourceExerciseName: "Pullover + press con mancuernas",
    recommended: false,
    editorialNote:
      "Combinación opcional: reducí el recorrido si el hombro se despega o molesta.",
  },
  {
    exerciseId: "close-grip-dumbbell-floor-press",
    order: 7,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 225,
    endSeconds: 245,
    sourceExerciseName: "Press cerrado en el piso",
    recommended: false,
    editorialNote: "Alternativa con más participación de tríceps; no hace falta sumarla a otro press.",
  },
  {
    exerciseId: "staggered-dumbbell-push-up",
    order: 8,
    videoId: CHEST_VIDEO_ID,
    startSeconds: 248,
    endSeconds: 275,
    sourceExerciseName: "Flexión escalonada sobre una mancuerna",
    recommended: false,
    editorialNote:
      "Variante asimétrica avanzada. Usá una mancuerna hexagonal estable y alterná el apoyo.",
  },
] as const satisfies readonly ExerciseMovement[];

const movementByExerciseId = new Map<string, ExerciseMovement>(
  [
    ...shoulderVideoMovements,
    ...chestVideoMovements,
    ...backVideoMovements,
    ...absVideoMovements,
  ].map((movement) => [movement.exerciseId, movement]),
);

export function getExerciseMovement(
  exerciseId: string,
): ExerciseMovement | undefined {
  return movementByExerciseId.get(exerciseId);
}
