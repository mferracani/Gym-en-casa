import {
  exerciseCatalog,
  workoutTemplates,
} from "../../data/training-catalog.ts";
import { isWorkoutTemplateAvailable } from "./constraints.ts";
import type {
  CompletedSession,
  ExerciseDefinition,
  ExerciseSectionId,
  PlannedExercise,
  Profile,
  WorkoutTemplate,
} from "./types.ts";

export type DailyPlanSource = "local" | "chatgpt" | "openclaw";
export type PreferredTrainingSection = ExerciseSectionId | "recommend";

export interface DailyWorkoutPlan {
  id: string;
  source: DailyPlanSource;
  sectionId: ExerciseSectionId;
  name: string;
  rationale: string;
  estimatedMinutes: number;
  targetRir: 2 | 3;
  exercises: PlannedExercise[];
  advisories: string[];
  progression: string;
  generatedAt: string;
}

export interface TrainingPlannerContext {
  history: readonly CompletedSession[];
  profile: Profile;
  now: string;
}

export interface GenerateDailyWorkoutPlanInput {
  preferredSection: PreferredTrainingSection;
  context: TrainingPlannerContext;
  source?: DailyPlanSource;
}

const MAIN_SECTIONS = [
  "chest-biceps",
  "back-triceps",
  "shoulders",
] as const satisfies readonly ExerciseSectionId[];

const SECTION_LABELS: Record<ExerciseSectionId, string> = {
  "chest-biceps": "Pecho + bíceps",
  "back-triceps": "Espalda + tríceps",
  shoulders: "Hombros",
  abs: "Abdominales",
};

const TEMPLATE_BY_SECTION: Record<ExerciseSectionId, string> = {
  "chest-biceps": "chest-video-adaptation",
  "back-triceps": "back-video-adaptation",
  shoulders: "shoulders-video-adaptation",
  abs: "abs-video-adaptation",
};

const RECOVERY_WINDOW_MS = 48 * 60 * 60 * 1000;

function sectionForSession(session: CompletedSession) {
  const template = workoutTemplates.find(
    (candidate) => candidate.id === session.templateId,
  );

  if (template) return template.sectionId;

  const firstExercise = session.exercises[0];
  return exerciseCatalog.find(
    (exercise) => exercise.id === firstExercise?.exerciseId,
  )?.sectionId;
}

function lastCompletedAtBySection(history: readonly CompletedSession[]) {
  const result = new Map<ExerciseSectionId, number>();

  for (const session of history) {
    const sectionId = sectionForSession(session);
    const timestamp = Date.parse(session.completedAt);

    if (!sectionId || !Number.isFinite(timestamp)) continue;
    result.set(sectionId, Math.max(result.get(sectionId) ?? 0, timestamp));
  }

  return result;
}

function recommendedSection(
  history: readonly CompletedSession[],
  nowTimestamp: number,
) {
  const lastCompleted = lastCompletedAtBySection(history);
  const neverTrained = MAIN_SECTIONS.find(
    (sectionId) => !lastCompleted.has(sectionId),
  );

  if (neverTrained) {
    return { sectionId: neverTrained, reason: "untrained" as const };
  }

  const recovered = MAIN_SECTIONS.filter(
    (sectionId) =>
      nowTimestamp - (lastCompleted.get(sectionId) ?? 0) >= RECOVERY_WINDOW_MS,
  );

  if (recovered.length === 0) {
    return { sectionId: "abs" as const, reason: "recovery" as const };
  }

  const sectionId = [...recovered].sort(
    (left, right) =>
      (lastCompleted.get(left) ?? 0) - (lastCompleted.get(right) ?? 0),
  )[0];

  return { sectionId, reason: "oldest" as const };
}

function findTemplate(sectionId: ExerciseSectionId) {
  const template = workoutTemplates.find(
    (candidate) => candidate.id === TEMPLATE_BY_SECTION[sectionId],
  );

  if (!template) {
    throw new Error(`Falta la plantilla editorial de ${SECTION_LABELS[sectionId]}.`);
  }

  return template;
}

export function generateDailyWorkoutPlan({
  preferredSection,
  context,
  source = "local",
}: GenerateDailyWorkoutPlanInput): DailyWorkoutPlan {
  const nowTimestamp = Date.parse(context.now);

  if (!Number.isFinite(nowTimestamp)) {
    throw new Error("La fecha usada para planificar no es válida.");
  }

  const recommendation = recommendedSection(context.history, nowTimestamp);
  const sectionId =
    preferredSection === "recommend"
      ? recommendation.sectionId
      : preferredSection;
  const template = findTemplate(sectionId);
  const completedInSection = context.history.filter(
    (session) => sectionForSession(session) === sectionId,
  ).length;
  const targetRir: 2 | 3 = completedInSection >= 3 ? 2 : 3;
  const lastCompleted = lastCompletedAtBySection(context.history).get(sectionId);
  const isRecovering = Boolean(
    lastCompleted && nowTimestamp - lastCompleted < RECOVERY_WINDOW_MS,
  );
  const rationale =
    preferredSection !== "recommend"
      ? `Elegiste ${SECTION_LABELS[sectionId]}. La rutina prioriza movimientos complementarios sin repetir variantes equivalentes.`
      : recommendation.reason === "recovery"
        ? "Las tres secciones principales están dentro de su ventana de recuperación; hoy conviene un bloque de abdominales controlado."
        : recommendation.reason === "untrained"
          ? `Priorizamos ${SECTION_LABELS[sectionId]} para equilibrar las secciones que todavía no registran trabajo.`
          : `Priorizamos ${SECTION_LABELS[sectionId]} porque es la sección principal con más recuperación acumulada.`;
  const advisories = [
    `Terminá cada serie con ${targetRir} repeticiones en reserva; no hace falta llegar al fallo.`,
    "Este catálogo todavía no incluye piernas: la sugerencia no reemplaza un plan corporal completo.",
  ];

  if (isRecovering && preferredSection !== "recommend") {
    advisories.unshift(
      "Esta sección fue trabajada hace menos de 48 horas. Bajá la carga o elegí otra si seguís fatigado.",
    );
  }

  const plan: DailyWorkoutPlan = {
    id: `daily-${source}-${sectionId}-${nowTimestamp}`,
    source,
    sectionId,
    name: `${SECTION_LABELS[sectionId]} · base avanzada`,
    rationale,
    estimatedMinutes: template.estimatedMinutes,
    targetRir,
    exercises: template.exercises.map((exercise) => ({ ...exercise })),
    advisories,
    progression:
      "Cuando completes el objetivo con la técnica estable en dos sesiones seguidas, subí la carga mínima disponible y conservá el mismo RIR.",
    generatedAt: new Date(nowTimestamp).toISOString(),
  };

  if (!isDailyWorkoutPlanValid(plan, exerciseCatalog, context.profile)) {
    throw new Error("No se pudo crear una rutina compatible con tu equipo.");
  }

  return plan;
}

export function isDailyWorkoutPlanValid(
  plan: DailyWorkoutPlan,
  catalog: readonly ExerciseDefinition[],
  profile: Profile,
) {
  if (
    plan.exercises.length < 4 ||
    plan.exercises.length > 6 ||
    ![2, 3].includes(plan.targetRir)
  ) {
    return false;
  }

  const uniqueIds = new Set(plan.exercises.map((exercise) => exercise.exerciseId));
  if (uniqueIds.size !== plan.exercises.length) return false;

  const definitions = plan.exercises.map((plannedExercise) =>
    catalog.find((exercise) => exercise.id === plannedExercise.exerciseId),
  );

  if (
    definitions.some(
      (definition) => !definition || definition.sectionId !== plan.sectionId,
    )
  ) {
    return false;
  }

  if (
    plan.exercises.some(
      ({ targetSets, targetReps }) =>
        !Number.isInteger(targetSets) ||
        targetSets < 2 ||
        targetSets > 4 ||
        !Number.isInteger(targetReps) ||
        targetReps < 6 ||
        targetReps > 15,
    )
  ) {
    return false;
  }

  const template = createWorkoutTemplateFromDailyPlan(plan);
  return isWorkoutTemplateAvailable(template, catalog, profile);
}

export function createWorkoutTemplateFromDailyPlan(
  plan: DailyWorkoutPlan,
): WorkoutTemplate {
  return {
    id: plan.id,
    sectionId: plan.sectionId,
    name: plan.name,
    kind: "strength",
    estimatedMinutes: plan.estimatedMinutes,
    exercises: plan.exercises.map((exercise) => ({ ...exercise })),
  };
}

export function getTrainingSectionLabel(sectionId: ExerciseSectionId) {
  return SECTION_LABELS[sectionId];
}
