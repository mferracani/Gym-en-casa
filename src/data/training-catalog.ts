import type {
  AppState,
  ExerciseDefinition,
  Profile,
  WeeklyScheduleDay,
  WorkoutTemplate,
} from "../domain/training/types.ts";
import { shoulderVideoMovements } from "./exercise-movements.ts";

export const shoulderVideoExerciseIds: string[] = shoulderVideoMovements.map(
  ({ exerciseId }) => exerciseId,
);

export const exerciseCatalog: ExerciseDefinition[] = [
  {
    id: "dumbbell-flat-press",
    sectionId: "chest-biceps",
    name: "Press plano con mancuernas",
    primaryMuscles: ["Pecho"],
    secondaryMuscles: ["Tríceps", "Deltoide anterior"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 90,
    techniqueCues: [
      "Apoyá pies, glúteos y espalda en el banco.",
      "Bajá las mancuernas con control.",
      "Mantené las muñecas alineadas.",
    ],
  },
  {
    id: "dumbbell-incline-press",
    sectionId: "chest-biceps",
    name: "Press inclinado con mancuernas",
    primaryMuscles: ["Pecho"],
    secondaryMuscles: ["Tríceps", "Deltoide anterior"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 90,
    techniqueCues: [
      "Usá una inclinación moderada del banco.",
      "Mantené los omóplatos apoyados.",
      "Subí sin chocar las mancuernas.",
    ],
  },
  {
    id: "dumbbell-fly",
    sectionId: "chest-biceps",
    name: "Aperturas con mancuernas",
    primaryMuscles: ["Pecho"],
    secondaryMuscles: ["Deltoide anterior"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Conservá una flexión suave de codos.",
      "Abrí sólo hasta un rango cómodo.",
      "Cerrá con control, sin golpear las mancuernas.",
    ],
  },
  {
    id: "barbell-curl",
    sectionId: "chest-biceps",
    name: "Curl de bíceps con barra",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    requiredEquipment: ["barbell"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Mantené los codos cerca del torso.",
      "Evitá balancear la espalda.",
      "Bajá la barra de forma controlada.",
    ],
  },
  {
    id: "hammer-curl",
    sectionId: "chest-biceps",
    name: "Curl martillo",
    primaryMuscles: ["Bíceps", "Braquial"],
    secondaryMuscles: ["Braquiorradial"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Usá agarre neutro durante todo el recorrido.",
      "Mantené los codos quietos.",
      "Evitá usar impulso.",
    ],
  },
  {
    id: "seated-alternating-dumbbell-curl",
    sectionId: "chest-biceps",
    name: "Curl alternado sentado con supinación",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Braquial", "Braquiorradial"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Sentate estable con los pies apoyados.",
      "Girando la palma hacia arriba, llevá una mancuerna al hombro.",
      "Alterná sin balancear el torso.",
    ],
  },
  {
    id: "incline-dumbbell-curl",
    sectionId: "chest-biceps",
    name: "Curl inclinado con mancuernas",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Braquial"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyá la espalda y dejá los brazos caer.",
      "Mantené los codos detrás del torso.",
      "Subí y bajá sin mover los hombros.",
    ],
  },
  {
    id: "concentration-curl",
    sectionId: "chest-biceps",
    name: "Curl de concentración",
    primaryMuscles: ["Bíceps"],
    secondaryMuscles: ["Braquial"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyá el codo en la cara interna del muslo.",
      "Flexioná sin despegar el brazo del apoyo.",
      "Completá ambos lados con el mismo control.",
    ],
  },
  {
    id: "one-arm-dumbbell-row",
    sectionId: "back-triceps",
    name: "Remo a una mano apoyado en banco",
    primaryMuscles: ["Dorsal ancho", "Romboides"],
    secondaryMuscles: ["Trapecio medio", "Bíceps", "Deltoide posterior"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 75,
    techniqueCues: [
      "Apoyá mano y rodilla con la espalda neutra.",
      "Llevá la mancuerna hacia la cadera.",
      "Evitá rotar el torso.",
    ],
  },
  {
    id: "chest-supported-dumbbell-row",
    sectionId: "back-triceps",
    name: "Remo con pecho apoyado",
    primaryMuscles: ["Romboides", "Trapecio medio"],
    secondaryMuscles: ["Dorsal ancho", "Bíceps", "Deltoide posterior"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 75,
    techniqueCues: [
      "Apoyá el pecho en el banco inclinado.",
      "Remá hacia las costillas sin levantar el torso.",
      "Bajá hasta extender los brazos con control.",
    ],
  },
  {
    id: "lying-dumbbell-triceps-extension",
    sectionId: "back-triceps",
    name: "Extensión de tríceps acostado",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: ["Estabilizadores del hombro"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Mantené los brazos apuntando al techo.",
      "Flexioná sólo los codos.",
      "Bajá las mancuernas junto a las sienes con control.",
    ],
  },
  {
    id: "seated-overhead-dumbbell-triceps-extension",
    sectionId: "back-triceps",
    name: "Extensión de tríceps sobre la cabeza",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: ["Core", "Estabilizadores escapulares"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Sujetá una mancuerna con ambas manos.",
      "Mantené los codos orientados al frente.",
      "Extendé sin arquear la espalda.",
    ],
  },
  {
    id: "bench-supported-triceps-kickback",
    sectionId: "back-triceps",
    name: "Patada de tríceps apoyada en banco",
    primaryMuscles: ["Tríceps"],
    secondaryMuscles: ["Deltoide posterior", "Core"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Fijá el brazo paralelo al torso.",
      "Extendé el codo sin mover el hombro.",
      "Volvé lento y completá ambos lados.",
    ],
  },
  {
    id: "seated-dumbbell-shoulder-press",
    sectionId: "shoulders",
    name: "Press de hombros sentado",
    primaryMuscles: ["Deltoide anterior", "Deltoide medio"],
    secondaryMuscles: ["Tríceps", "Serrato anterior"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 75,
    techniqueCues: [
      "Apoyá la espalda y mantené las costillas abajo.",
      "Presioná hacia arriba con muñecas neutras.",
      "Bajá de forma controlada.",
    ],
  },
  {
    id: "dumbbell-scaption",
    sectionId: "shoulders",
    name: "Elevación en plano escapular",
    primaryMuscles: ["Deltoide medio", "Deltoide anterior"],
    secondaryMuscles: ["Trapecio", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Elevá los brazos unos 30 grados por delante del cuerpo.",
      "Mantené los pulgares orientados hacia arriba.",
      "Detenete a la altura de los hombros.",
    ],
  },
  {
    id: "suitcase-carry",
    sectionId: "abs",
    name: "Caminata con mancuerna a un lado",
    primaryMuscles: ["Oblicuos", "Core"],
    secondaryMuscles: ["Antebrazo", "Glúteos", "Trapecio"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 45,
    techniqueCues: [
      "Caminá erguido sin inclinarte hacia la carga.",
      "Mantené el abdomen activo.",
      "Completá la misma distancia de cada lado.",
    ],
  },
  {
    id: "incline-plank-dumbbell-drag",
    sectionId: "abs",
    name: "Plancha inclinada con arrastre",
    primaryMuscles: ["Oblicuos", "Transverso abdominal"],
    secondaryMuscles: ["Serrato anterior", "Hombros"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 45,
    techniqueCues: [
      "Apoyá las manos en el banco y alineá el cuerpo.",
      "Arrastrá la mancuerna sin rotar la pelvis.",
      "Alterná los lados con control.",
    ],
  },
  {
    id: "weighted-bench-crunch",
    sectionId: "abs",
    name: "Crunch corto con mancuerna",
    primaryMuscles: ["Recto abdominal"],
    secondaryMuscles: ["Oblicuos"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 45,
    techniqueCues: [
      "Usá una mancuerna liviana cerca del pecho.",
      "Elevá sólo hombros y parte alta de la espalda.",
      "No tires del cuello.",
    ],
  },
  {
    id: "dumbbell-dead-bug",
    sectionId: "abs",
    name: "Dead bug con mancuerna sostenida",
    primaryMuscles: ["Core"],
    secondaryMuscles: ["Flexores de cadera", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 45,
    techniqueCues: [
      "Pegá suavemente la zona lumbar al piso.",
      "Extendé brazo y pierna opuestos sin perder la postura.",
      "Movete lento y respirando.",
    ],
  },
  {
    id: "barbell-bench-press",
    sectionId: "chest-biceps",
    name: "Press de pecho con barra",
    primaryMuscles: ["Pecho"],
    secondaryMuscles: ["Tríceps", "Deltoide anterior"],
    requiredEquipment: ["barbell", "flat-bench", "rack"],
    requiresRack: true,
    defaultRestSeconds: 120,
    safetyNote: "Requiere rack para esta configuración de entrenamiento en casa.",
    techniqueCues: [
      "Usalo sólo con rack y soportes configurados.",
      "Mantené muñecas y antebrazos alineados.",
      "No entrenes al fallo sin asistencia.",
    ],
  },
  {
    id: "bent-over-dumbbell-rear-delt-fly",
    sectionId: "shoulders",
    name: "Pájaros inclinado de pie",
    primaryMuscles: ["Deltoide posterior"],
    secondaryMuscles: ["Romboides", "Trapecio medio"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Flexioná la cadera y conservá la espalda neutra.",
      "Abrí los brazos sin encoger los hombros.",
      "Volvé lento a la posición inicial.",
    ],
  },
  {
    id: "standing-double-dumbbell-front-raise",
    sectionId: "shoulders",
    name: "Elevación frontal doble",
    primaryMuscles: ["Deltoide anterior"],
    secondaryMuscles: ["Deltoide medio", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Mantené el torso quieto y el abdomen activo.",
      "Subí hasta la altura de los hombros.",
      "Usá poco peso y evitá el impulso.",
    ],
  },
  {
    id: "standing-dumbbell-lateral-raise",
    sectionId: "shoulders",
    name: "Elevación lateral doble",
    primaryMuscles: ["Deltoide medio"],
    secondaryMuscles: ["Supraespinoso", "Trapecio"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Dejá una flexión suave en los codos.",
      "Subí hasta la altura de los hombros.",
      "Mantené los hombros lejos de las orejas.",
    ],
  },
  {
    id: "dumbbell-upright-row",
    sectionId: "shoulders",
    name: "Remo vertical con mancuernas",
    primaryMuscles: ["Deltoide medio"],
    secondaryMuscles: ["Trapecio superior", "Bíceps"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    safetyNote:
      "No está preseleccionado. Si sentís pinzamiento, reemplazalo por una elevación lateral.",
    techniqueCues: [
      "Usá una carga muy liviana.",
      "No lleves los codos por encima de los hombros.",
      "Frená si aparece dolor o pinzamiento.",
    ],
  },
  {
    id: "alternating-dumbbell-front-raise",
    sectionId: "shoulders",
    name: "Elevación frontal alternada",
    primaryMuscles: ["Deltoide anterior"],
    secondaryMuscles: ["Deltoide medio", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Alterná los brazos sin rotar el torso.",
      "Subí sólo hasta la altura del hombro.",
      "Bajá cada mancuerna de forma controlada.",
    ],
  },
  {
    id: "alternating-dumbbell-shoulder-press",
    sectionId: "shoulders",
    name: "Press de hombros alternado",
    primaryMuscles: ["Deltoide anterior", "Deltoide medio"],
    secondaryMuscles: ["Tríceps", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 75,
    techniqueCues: [
      "Mantené las costillas abajo y el abdomen activo.",
      "Alterná sin inclinarte hacia los costados.",
      "Extendé los brazos sin bloquear los codos.",
    ],
  },
  {
    id: "two-hand-dumbbell-front-raise",
    sectionId: "shoulders",
    name: "Elevación frontal con una mancuerna",
    primaryMuscles: ["Deltoide anterior"],
    secondaryMuscles: ["Deltoide medio", "Serrato anterior"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Sujetá una mancuerna con ambas manos.",
      "Elevá hasta la altura de los hombros.",
      "Evitá arquear la espalda.",
    ],
  },
  {
    id: "seated-dumbbell-lateral-raise",
    sectionId: "shoulders",
    name: "Elevación lateral sentada",
    primaryMuscles: ["Deltoide medio"],
    secondaryMuscles: ["Supraespinoso", "Trapecio"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Sentate estable con los pies firmes.",
      "Elevá los codos hasta la línea de los hombros.",
      "No uses rebote.",
    ],
  },
  {
    id: "incline-bench-dumbbell-front-raise",
    sectionId: "shoulders",
    name: "Elevación frontal en banco inclinado",
    primaryMuscles: ["Deltoide anterior"],
    secondaryMuscles: ["Deltoide medio", "Serrato anterior"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyá la espalda en el banco inclinado.",
      "Subí con brazos largos y codos suaves.",
      "Detenete a la altura de los hombros.",
    ],
  },
  {
    id: "incline-bench-reverse-fly",
    sectionId: "shoulders",
    name: "Reverse fly con pecho apoyado",
    primaryMuscles: ["Deltoide posterior"],
    secondaryMuscles: ["Romboides", "Trapecio medio"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyá el pecho y dejá el cuello neutral.",
      "Abrí los brazos en línea con el torso.",
      "Juntá suavemente los omóplatos.",
    ],
  },
  {
    id: "bench-supported-rear-delt-row",
    sectionId: "shoulders",
    name: "Remo para deltoide a una mano",
    primaryMuscles: ["Deltoide posterior"],
    secondaryMuscles: ["Romboides", "Trapecio medio", "Bíceps"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyá una mano y una rodilla en el banco.",
      "Llevá el codo abierto hacia la línea del hombro.",
      "Evitá girar el torso.",
    ],
  },
  {
    id: "incline-side-lying-dumbbell-lateral-raise",
    sectionId: "shoulders",
    name: "Elevación lateral en banco inclinado",
    primaryMuscles: ["Deltoide medio"],
    secondaryMuscles: ["Supraespinoso"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Apoyate de lado sobre el banco.",
      "Elevá el brazo superior sin girar el torso.",
      "Trabajá con una carga liviana.",
    ],
  },
  {
    id: "seated-arnold-press",
    sectionId: "shoulders",
    name: "Press Arnold sentado",
    primaryMuscles: ["Deltoide anterior", "Deltoide medio"],
    secondaryMuscles: ["Tríceps", "Serrato anterior"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 75,
    techniqueCues: [
      "Empezá con las palmas hacia vos.",
      "Rotá mientras presionás hacia arriba.",
      "No arquees la zona lumbar.",
    ],
  },
  {
    id: "seated-double-dumbbell-front-raise",
    sectionId: "shoulders",
    name: "Elevación frontal doble sentada",
    primaryMuscles: ["Deltoide anterior"],
    secondaryMuscles: ["Deltoide medio", "Serrato anterior"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
    techniqueCues: [
      "Sentate erguido y apoyá bien los pies.",
      "Elevá ambas mancuernas hasta los hombros.",
      "Bajá sin perder el control.",
    ],
  },
];

export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: "chest-biceps-adaptation",
    sectionId: "chest-biceps",
    name: "Pecho + bíceps",
    kind: "strength",
    estimatedMinutes: 60,
    exercises: [
      { exerciseId: "dumbbell-flat-press", targetSets: 3, targetReps: 10 },
      { exerciseId: "dumbbell-incline-press", targetSets: 3, targetReps: 10 },
      { exerciseId: "dumbbell-fly", targetSets: 3, targetReps: 10 },
      {
        exerciseId: "seated-alternating-dumbbell-curl",
        targetSets: 3,
        targetReps: 10,
      },
      { exerciseId: "hammer-curl", targetSets: 3, targetReps: 10 },
    ],
  },
  {
    id: "back-triceps-adaptation",
    sectionId: "back-triceps",
    name: "Espalda + tríceps",
    kind: "strength",
    estimatedMinutes: 55,
    exercises: [
      { exerciseId: "one-arm-dumbbell-row", targetSets: 3, targetReps: 10 },
      {
        exerciseId: "chest-supported-dumbbell-row",
        targetSets: 3,
        targetReps: 10,
      },
      {
        exerciseId: "lying-dumbbell-triceps-extension",
        targetSets: 3,
        targetReps: 10,
      },
      {
        exerciseId: "seated-overhead-dumbbell-triceps-extension",
        targetSets: 3,
        targetReps: 10,
      },
      {
        exerciseId: "bench-supported-triceps-kickback",
        targetSets: 2,
        targetReps: 12,
      },
    ],
  },
  {
    id: "shoulders-video-adaptation",
    sectionId: "shoulders",
    name: "Hombros · selección video",
    kind: "strength",
    estimatedMinutes: 42,
    exercises: [
      {
        exerciseId: "alternating-dumbbell-shoulder-press",
        targetSets: 3,
        targetReps: 12,
      },
      {
        exerciseId: "standing-dumbbell-lateral-raise",
        targetSets: 3,
        targetReps: 12,
      },
      {
        exerciseId: "incline-bench-reverse-fly",
        targetSets: 3,
        targetReps: 12,
      },
      {
        exerciseId: "bench-supported-rear-delt-row",
        targetSets: 3,
        targetReps: 12,
      },
    ],
  },
  {
    id: "abs-adaptation",
    sectionId: "abs",
    name: "Abdominales",
    kind: "strength",
    estimatedMinutes: 30,
    exercises: [
      { exerciseId: "suitcase-carry", targetSets: 2, targetReps: 10 },
      {
        exerciseId: "incline-plank-dumbbell-drag",
        targetSets: 3,
        targetReps: 8,
      },
      { exerciseId: "weighted-bench-crunch", targetSets: 3, targetReps: 10 },
      { exerciseId: "dumbbell-dead-bug", targetSets: 3, targetReps: 8 },
    ],
  },
];

export function createSelectionWorkoutTemplate(
  exerciseIds: readonly string[],
): WorkoutTemplate {
  const uniqueIds = [...new Set(exerciseIds)];
  const catalogById = new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise]));
  const selectedExercises = uniqueIds.flatMap((exerciseId) => {
    const exercise = catalogById.get(exerciseId);
    return exercise ? [exercise] : [];
  });

  if (selectedExercises.length === 0) {
    throw new Error("Elegí al menos un ejercicio disponible.");
  }

  const sectionId = selectedExercises[0].sectionId;
  const isSingleSection = selectedExercises.every(
    (exercise) => exercise.sectionId === sectionId,
  );
  const name = isSingleSection && sectionId === "shoulders"
    ? "Hombros personalizado"
    : "Rutina personalizada";

  return {
    id: `custom-${sectionId}`,
    sectionId,
    name,
    kind: "strength",
    estimatedMinutes: Math.max(20, selectedExercises.length * 8),
    exercises: selectedExercises.map((exercise) => ({
      exerciseId: exercise.id,
      targetSets: 3,
      targetReps: exercise.sectionId === "shoulders" ? 12 : 10,
    })),
  };
}

export const defaultProfile: Profile = {
  id: "local-profile",
  displayName: "Mati",
  equipment: {
    dumbbells: true,
    barbell: true,
    "flat-bench": true,
    "adjustable-bench": true,
    rack: false,
  },
  defaultRestSeconds: 60,
  weightUnit: "kg",
};

export const weeklyScheduleSeed = [
  { weekday: 1, kind: "strength" },
  { weekday: 2, kind: "strength" },
  { weekday: 3, kind: "recovery" },
  { weekday: 4, kind: "strength" },
  { weekday: 5, kind: "strength" },
  { weekday: 6, kind: "strength", workoutTemplateId: "chest-biceps-adaptation" },
  { weekday: 7, kind: "rest" },
] satisfies WeeklyScheduleDay[];

export function createInitialAppState(): AppState {
  return {
    profile: {
      ...defaultProfile,
      equipment: { ...defaultProfile.equipment },
    },
    schedule: weeklyScheduleSeed.map((day) => ({ ...day })),
    activeSession: null,
    history: [],
  };
}
