import { exerciseCatalog, workoutTemplates } from "@/data/training-catalog";
import { getTrainingSectionLabel } from "@/domain/training/daily-plan";
import type { ExerciseSectionId } from "@/domain/training/types";
import { agentBridgeIsEnabled } from "@/server/agent-bridge-validation";

export const dynamic = "force-dynamic";

const sections = [
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
] as const satisfies readonly ExerciseSectionId[];

export async function GET() {
  if (!agentBridgeIsEnabled()) {
    return Response.json({ error: "Agent Bridge está disponible sólo en local." }, { status: 404 });
  }

  return Response.json(
    {
      sections: sections.map((sectionId) => ({
        id: sectionId,
        name: getTrainingSectionLabel(sectionId),
        exercises: exerciseCatalog
          .filter((exercise) => exercise.sectionId === sectionId)
          .map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            primaryMuscles: exercise.primaryMuscles,
            requiredEquipment: exercise.requiredEquipment,
          })),
        suggestedTemplate: workoutTemplates.find(
          (template) => template.sectionId === sectionId && template.id.includes("video"),
        )?.id,
      })),
      limits: {
        equipment: ["mancuernas", "barra", "banco plano/inclinable"],
        hasLegTraining: false,
        agentWritesRequireInAppConfirmation: true,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
