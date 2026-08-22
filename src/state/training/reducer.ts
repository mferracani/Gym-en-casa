import { completeSet } from "../../domain/training/session.ts";
import type {
  ActiveSession,
  AppState,
  CompletedSession,
  Profile,
  WeeklyScheduleDay,
} from "../../domain/training/types.ts";

export type TrainingAction =
  | { type: "state/replace"; state: AppState }
  | { type: "state/reset"; state: AppState }
  | { type: "session/start"; session: ActiveSession }
  | {
      type: "session/complete-set";
      exerciseId: string;
      setId: string;
      actualReps: number;
      weightKg: number | null;
      completedAt: string;
    }
  | {
      type: "session/reopen-set";
      exerciseId: string;
      setId: string;
    }
  | { type: "session/navigate"; exerciseIndex: number }
  | { type: "session/pause" }
  | { type: "session/resume" }
  | { type: "session/discard" }
  | { type: "session/finish"; session: CompletedSession }
  | { type: "profile/update"; profile: Profile }
  | { type: "schedule/update"; day: WeeklyScheduleDay };

function reopenSet(
  session: ActiveSession,
  exerciseId: string,
  setId: string,
): ActiveSession {
  return {
    ...session,
    exercises: session.exercises.map((exercise) =>
      exercise.exerciseId !== exerciseId
        ? exercise
        : {
            ...exercise,
            sets: exercise.sets.map((set) =>
              set.id !== setId
                ? set
                : {
                    ...set,
                    status: "pending" as const,
                    completedAt: null,
                  },
            ),
          },
    ),
  };
}

export function trainingReducer(
  state: AppState,
  action: TrainingAction,
): AppState {
  switch (action.type) {
    case "state/replace":
    case "state/reset":
      return action.state;

    case "session/start":
      return state.activeSession
        ? state
        : { ...state, activeSession: action.session };

    case "session/complete-set":
      return state.activeSession
        ? {
            ...state,
            activeSession: completeSet(state.activeSession, {
              exerciseId: action.exerciseId,
              setId: action.setId,
              actualReps: action.actualReps,
              weightKg: action.weightKg,
              completedAt: action.completedAt,
            }),
          }
        : state;

    case "session/reopen-set":
      return state.activeSession
        ? {
            ...state,
            activeSession: reopenSet(
              state.activeSession,
              action.exerciseId,
              action.setId,
            ),
          }
        : state;

    case "session/navigate": {
      if (!state.activeSession) {
        return state;
      }

      const lastIndex = Math.max(state.activeSession.exercises.length - 1, 0);
      const currentExerciseIndex = Math.min(
        Math.max(action.exerciseIndex, 0),
        lastIndex,
      );

      return {
        ...state,
        activeSession: { ...state.activeSession, currentExerciseIndex },
      };
    }

    case "session/pause":
    case "session/resume":
      return state.activeSession
        ? {
            ...state,
            activeSession: {
              ...state.activeSession,
              status: action.type === "session/pause" ? "paused" : "active",
            },
          }
        : state;

    case "session/discard":
      return state.activeSession ? { ...state, activeSession: null } : state;

    case "session/finish":
      if (
        !state.activeSession ||
        state.activeSession.id !== action.session.id
      ) {
        return state;
      }

      return {
        ...state,
        activeSession: null,
        history: [
          action.session,
          ...state.history.filter((item) => item.id !== action.session.id),
        ],
      };

    case "profile/update":
      return { ...state, profile: action.profile };

    case "schedule/update":
      return {
        ...state,
        schedule: state.schedule
          .map((day) =>
            day.weekday === action.day.weekday ? action.day : day,
          )
          .sort((a, b) => a.weekday - b.weekday),
      };
  }
}
