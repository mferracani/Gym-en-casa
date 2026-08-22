import type {
  EquipmentId,
  ExerciseDefinition,
  Profile,
  WorkoutTemplate,
} from "./types.ts";

export function getMissingExerciseEquipment(
  exercise: ExerciseDefinition,
  profile: Profile,
): EquipmentId[] {
  const missing = exercise.requiredEquipment.filter(
    (equipment) => !profile.equipment[equipment],
  );

  if (
    exercise.requiresRack &&
    !profile.equipment.rack &&
    !missing.includes("rack")
  ) {
    missing.push("rack");
  }

  return missing;
}

export function isExerciseAvailable(
  exercise: ExerciseDefinition,
  profile: Profile,
): boolean {
  return getMissingExerciseEquipment(exercise, profile).length === 0;
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
