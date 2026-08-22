import type {
  ExerciseDefinition,
  Profile,
  WorkoutTemplate,
} from "./types.ts";

export function isExerciseAvailable(
  exercise: ExerciseDefinition,
  profile: Profile,
): boolean {
  if (exercise.requiresRack && !profile.equipment.rack) {
    return false;
  }

  return exercise.requiredEquipment.every(
    (equipment) => profile.equipment[equipment],
  );
}

export function isWorkoutTemplateAvailable(
  template: WorkoutTemplate,
  exercises: readonly ExerciseDefinition[],
  profile: Profile,
): boolean {
  const catalog = new Map(exercises.map((exercise) => [exercise.id, exercise]));

  return template.exercises.every((plannedExercise) => {
    const exercise = catalog.get(plannedExercise.exerciseId);
    return exercise ? isExerciseAvailable(exercise, profile) : false;
  });
}

export function getAvailableWorkoutTemplates(
  templates: readonly WorkoutTemplate[],
  exercises: readonly ExerciseDefinition[],
  profile: Profile,
): WorkoutTemplate[] {
  return templates.filter((template) =>
    isWorkoutTemplateAvailable(template, exercises, profile),
  );
}
