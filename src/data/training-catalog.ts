import type {
  AppState,
  ExerciseDefinition,
  Profile,
  WeeklyScheduleDay,
  WorkoutTemplate,
} from "../domain/training/types.ts";

export const exerciseCatalog = [
  {
    id: "dumbbell-flat-press",
    name: "Press plano con mancuernas",
    primaryMuscles: ["Pecho"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 90,
  },
  {
    id: "dumbbell-incline-press",
    name: "Press inclinado con mancuernas",
    primaryMuscles: ["Pecho"],
    requiredEquipment: ["dumbbells", "adjustable-bench"],
    defaultRestSeconds: 90,
  },
  {
    id: "dumbbell-fly",
    name: "Aperturas con mancuernas",
    primaryMuscles: ["Pecho"],
    requiredEquipment: ["dumbbells", "flat-bench"],
    defaultRestSeconds: 60,
  },
  {
    id: "barbell-curl",
    name: "Curl de bíceps con barra",
    primaryMuscles: ["Bíceps"],
    requiredEquipment: ["barbell"],
    defaultRestSeconds: 60,
  },
  {
    id: "hammer-curl",
    name: "Curl martillo",
    primaryMuscles: ["Bíceps", "Braquial"],
    requiredEquipment: ["dumbbells"],
    defaultRestSeconds: 60,
  },
  {
    id: "barbell-bench-press",
    name: "Press de pecho con barra",
    primaryMuscles: ["Pecho"],
    requiredEquipment: ["barbell", "flat-bench", "rack"],
    requiresRack: true,
    defaultRestSeconds: 120,
    safetyNote: "Requiere rack para esta configuración de entrenamiento en casa.",
  },
] satisfies ExerciseDefinition[];

export const workoutTemplates = [
  {
    id: "chest-biceps-adaptation",
    name: "Pecho + bíceps",
    kind: "strength",
    estimatedMinutes: 60,
    exercises: [
      { exerciseId: "dumbbell-flat-press", targetSets: 3, targetReps: 10 },
      { exerciseId: "dumbbell-incline-press", targetSets: 3, targetReps: 10 },
      { exerciseId: "dumbbell-fly", targetSets: 3, targetReps: 10 },
      { exerciseId: "barbell-curl", targetSets: 3, targetReps: 10 },
      { exerciseId: "hammer-curl", targetSets: 3, targetReps: 10 },
    ],
  },
] satisfies WorkoutTemplate[];

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
