export function isExactExerciseSelection(
  selectedIds: readonly string[],
  suggestedIds: readonly string[],
): boolean {
  return (
    selectedIds.length === suggestedIds.length &&
    selectedIds.every((exerciseId, index) => exerciseId === suggestedIds[index])
  );
}
