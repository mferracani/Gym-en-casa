import assert from "node:assert/strict";
import test from "node:test";

import {
  defaultProfile,
  exerciseCatalog,
  workoutTemplates,
} from "../../data/training-catalog.ts";
import {
  createWorkoutTemplateFromDailyPlan,
  generateDailyWorkoutPlan,
  isDailyWorkoutPlanValid,
} from "./daily-plan.ts";
import type {
  CompletedSession,
  ExerciseSectionId,
} from "./types.ts";

function completedSession(
  sectionId: ExerciseSectionId,
  completedAt: string,
  index: number,
): CompletedSession {
  const template = workoutTemplates.find(
    (item) => item.sectionId === sectionId,
  );

  if (!template) {
    throw new Error(`Falta una plantilla para ${sectionId}.`);
  }

  return {
    id: `session-${index}`,
    scheduledFor: completedAt.slice(0, 10),
    templateId: template.id,
    workoutName: template.name,
    startedAt: completedAt,
    completedAt,
    durationSeconds: template.estimatedMinutes * 60,
    exercises: [],
  };
}

test("genera una base avanzada acotada y preserva la receta editorial", () => {
  const plan = generateDailyWorkoutPlan({
    preferredSection: "chest-biceps",
    context: {
      history: [],
      profile: defaultProfile,
      now: "2026-08-22T12:00:00.000Z",
    },
  });

  assert.equal(plan.sectionId, "chest-biceps");
  assert.equal(plan.source, "local");
  assert.equal(plan.targetRir, 3);
  assert.equal(plan.exercises.length, 5);
  assert.equal(
    plan.exercises.reduce((total, exercise) => total + exercise.targetSets, 0),
    14,
  );
  assert.equal(
    isDailyWorkoutPlanValid(plan, exerciseCatalog, defaultProfile),
    true,
  );

  const template = createWorkoutTemplateFromDailyPlan(plan);
  assert.deepEqual(template.exercises, plan.exercises);
  assert.match(template.name, /Pecho \+ bíceps/);
});

test("recomienda una sección principal que todavía no fue trabajada", () => {
  const plan = generateDailyWorkoutPlan({
    preferredSection: "recommend",
    context: {
      history: [
        completedSession("chest-biceps", "2026-08-21T12:00:00.000Z", 1),
      ],
      profile: defaultProfile,
      now: "2026-08-22T12:00:00.000Z",
    },
  });

  assert.equal(plan.sectionId, "back-triceps");
  assert.match(plan.rationale, /equilibrar/i);
});

test("usa abdominales cuando las tres secciones principales están en recuperación", () => {
  const history = [
    completedSession("chest-biceps", "2026-08-22T08:00:00.000Z", 1),
    completedSession("back-triceps", "2026-08-21T18:00:00.000Z", 2),
    completedSession("shoulders", "2026-08-21T08:00:00.000Z", 3),
  ];
  const plan = generateDailyWorkoutPlan({
    preferredSection: "recommend",
    context: {
      history,
      profile: defaultProfile,
      now: "2026-08-22T12:00:00.000Z",
    },
  });

  assert.equal(plan.sectionId, "abs");
  assert.match(plan.rationale, /recuperación/i);
});

test("advierte si se fuerza una sección trabajada hace menos de 48 horas", () => {
  const plan = generateDailyWorkoutPlan({
    preferredSection: "shoulders",
    context: {
      history: [
        completedSession("shoulders", "2026-08-21T12:00:00.000Z", 1),
      ],
      profile: defaultProfile,
      now: "2026-08-22T12:00:00.000Z",
    },
  });

  assert.equal(
    plan.advisories.some((advisory) => /48 horas/i.test(advisory)),
    true,
  );
});

test("sube la intensidad sólo después de tres sesiones de la misma sección", () => {
  const now = "2026-08-22T12:00:00.000Z";
  const mixedPlan = generateDailyWorkoutPlan({
    preferredSection: "shoulders",
    context: {
      history: [
        completedSession("chest-biceps", "2026-08-10T12:00:00.000Z", 1),
        completedSession("back-triceps", "2026-08-12T12:00:00.000Z", 2),
        completedSession("abs", "2026-08-14T12:00:00.000Z", 3),
      ],
      profile: defaultProfile,
      now,
    },
  });
  const experiencedPlan = generateDailyWorkoutPlan({
    preferredSection: "shoulders",
    context: {
      history: [
        completedSession("shoulders", "2026-08-10T12:00:00.000Z", 4),
        completedSession("shoulders", "2026-08-12T12:00:00.000Z", 5),
        completedSession("shoulders", "2026-08-14T12:00:00.000Z", 6),
      ],
      profile: defaultProfile,
      now,
    },
  });

  assert.equal(mixedPlan.targetRir, 3);
  assert.equal(experiencedPlan.targetRir, 2);
});

test("rechaza ejercicios desconocidos o fuera de la sección", () => {
  const plan = generateDailyWorkoutPlan({
    preferredSection: "abs",
    context: {
      history: [],
      profile: defaultProfile,
      now: "2026-08-22T12:00:00.000Z",
    },
  });

  assert.equal(
    isDailyWorkoutPlanValid(
      {
        ...plan,
        exercises: [
          ...plan.exercises,
          { exerciseId: "dumbbell-flat-press", targetSets: 3, targetReps: 10 },
        ],
      },
      exerciseCatalog,
      defaultProfile,
    ),
    false,
  );
});
