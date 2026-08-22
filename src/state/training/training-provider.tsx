"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  createSelectionWorkoutTemplate,
  createInitialAppState,
  exerciseCatalog,
  workoutTemplates,
} from "../../data/training-catalog.ts";
import { isWorkoutTemplateAvailable } from "../../domain/training/constraints.ts";
import { createActiveSession, finishSession } from "../../domain/training/session.ts";
import type {
  ActiveSession,
  AppState,
  CompletedSession,
  LocalDate,
  Profile,
  WeeklyScheduleDay,
} from "../../domain/training/types.ts";
import {
  localDateFromDate,
  weekdayForLocalDate,
} from "../../lib/date/local-date.ts";
import {
  loadTrainingState,
  saveTrainingState,
  STORAGE_KEY,
  type LoadResult,
} from "../../lib/storage/training-storage.ts";
import {
  trainingReducer,
  type TrainingAction,
} from "./reducer.ts";

type StorageWarning = LoadResult["warning"];

export type StartWorkoutResult =
  | { ok: true; session: ActiveSession }
  | {
      ok: false;
      reason:
        | "not-ready"
        | "content-pending"
        | "missing-template"
        | "invalid-selection"
        | "equipment";
    };

export type RecordSetResult =
  | { ok: true }
  | { ok: false; message: string };

export type FinishWorkoutResult =
  | { ok: true; session: CompletedSession }
  | { ok: false; message: string };

export interface TrainingContextValue {
  state: AppState;
  isHydrated: boolean;
  storageWarning?: StorageWarning;
  startWorkout: (
    scheduledFor?: LocalDate,
    templateId?: string,
  ) => StartWorkoutResult;
  startWorkoutSelection: (exerciseIds: readonly string[]) => StartWorkoutResult;
  recordSet: (input: {
    exerciseId: string;
    setId: string;
    actualReps: number;
    weightKg: number | null;
  }) => RecordSetResult;
  reopenSet: (exerciseId: string, setId: string) => void;
  navigateExercise: (exerciseIndex: number) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  discardWorkout: () => void;
  finishWorkout: () => FinishWorkoutResult;
  updateProfile: (profile: Profile) => void;
  updateSchedule: (day: WeeklyScheduleDay) => void;
  resetLocalData: () => void;
}

export const TrainingContext = createContext<TrainingContextValue | null>(null);

interface RuntimeState {
  state: AppState;
  isHydrated: boolean;
  storageWarning?: StorageWarning;
}

type RuntimeAction =
  | { type: "hydrate"; result: LoadResult }
  | { type: "training"; action: TrainingAction }
  | { type: "storage-warning"; warning: StorageWarning };

function runtimeReducer(
  runtime: RuntimeState,
  action: RuntimeAction,
): RuntimeState {
  switch (action.type) {
    case "hydrate":
      return {
        state: action.result.state,
        isHydrated: true,
        storageWarning: action.result.warning,
      };
    case "training":
      return {
        ...runtime,
        state: trainingReducer(runtime.state, action.action),
      };
    case "storage-warning":
      return { ...runtime, storageWarning: action.warning };
  }
}

function createSessionId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [runtime, runtimeDispatch] = useReducer(runtimeReducer, undefined, () => ({
    state: createInitialAppState(),
    isHydrated: false,
    storageWarning: undefined,
  }));
  const { state, isHydrated, storageWarning } = runtime;
  const dispatch = useCallback(
    (action: TrainingAction) => {
      runtimeDispatch({ type: "training", action });
    },
    [],
  );

  useEffect(() => {
    const result = loadTrainingState(
      window.localStorage,
      createInitialAppState,
    );

    runtimeDispatch({ type: "hydrate", result });
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!saveTrainingState(window.localStorage, state)) {
      runtimeDispatch({ type: "storage-warning", warning: "unavailable" });
    }
  }, [isHydrated, state]);

  const startWorkout = useCallback(
    (
      scheduledFor = localDateFromDate(new Date()),
      explicitTemplateId?: string,
    ): StartWorkoutResult => {
      if (!isHydrated) {
        return { ok: false, reason: "not-ready" };
      }

      if (state.activeSession) {
        return { ok: true, session: state.activeSession };
      }

      const scheduledDay = state.schedule.find(
        (day) => day.weekday === weekdayForLocalDate(scheduledFor),
      );

      if (scheduledDay?.kind !== "strength") {
        return { ok: false, reason: "content-pending" };
      }

      const templateId = explicitTemplateId ?? scheduledDay.workoutTemplateId;

      if (!templateId) {
        return { ok: false, reason: "content-pending" };
      }

      const template = workoutTemplates.find((item) => item.id === templateId);

      if (!template) {
        return { ok: false, reason: "missing-template" };
      }

      try {
        const session = createActiveSession({
          sessionId: createSessionId(),
          scheduledFor,
          startedAt: new Date().toISOString(),
          template,
          exercises: exerciseCatalog,
          profile: state.profile,
        });

        dispatch({ type: "session/start", session });
        return { ok: true, session };
      } catch {
        return { ok: false, reason: "equipment" };
      }
    },
    [dispatch, isHydrated, state.activeSession, state.profile, state.schedule],
  );

  const startWorkoutSelection = useCallback(
    (exerciseIds: readonly string[]): StartWorkoutResult => {
      if (!isHydrated) {
        return { ok: false, reason: "not-ready" };
      }

      if (state.activeSession) {
        return { ok: true, session: state.activeSession };
      }

      let template;

      try {
        template = createSelectionWorkoutTemplate(exerciseIds);
      } catch {
        return { ok: false, reason: "invalid-selection" };
      }

      if (!isWorkoutTemplateAvailable(template, exerciseCatalog, state.profile)) {
        return { ok: false, reason: "equipment" };
      }

      try {
        const session = createActiveSession({
          sessionId: createSessionId(),
          scheduledFor: localDateFromDate(new Date()),
          startedAt: new Date().toISOString(),
          template,
          exercises: exerciseCatalog,
          profile: state.profile,
        });

        dispatch({ type: "session/start", session });
        return { ok: true, session };
      } catch {
        return { ok: false, reason: "invalid-selection" };
      }
    },
    [dispatch, isHydrated, state.activeSession, state.profile],
  );

  const recordSet = useCallback(
    ({
      exerciseId,
      setId,
      actualReps,
      weightKg,
    }: {
      exerciseId: string;
      setId: string;
      actualReps: number;
      weightKg: number | null;
    }): RecordSetResult => {
      if (!Number.isInteger(actualReps) || actualReps < 1) {
        return {
          ok: false,
          message: "Ingresá una cantidad de repeticiones mayor a cero.",
        };
      }

      if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
        return { ok: false, message: "Ingresá un peso válido en kg." };
      }

      dispatch({
        type: "session/complete-set",
        exerciseId,
        setId,
        actualReps,
        weightKg,
        completedAt: new Date().toISOString(),
      });

      return { ok: true };
    },
    [dispatch],
  );

  const reopenSet = useCallback((exerciseId: string, setId: string) => {
    dispatch({ type: "session/reopen-set", exerciseId, setId });
  }, [dispatch]);

  const navigateExercise = useCallback((exerciseIndex: number) => {
    dispatch({ type: "session/navigate", exerciseIndex });
  }, [dispatch]);

  const pauseWorkout = useCallback(() => {
    dispatch({ type: "session/pause" });
  }, [dispatch]);

  const resumeWorkout = useCallback(() => {
    dispatch({ type: "session/resume" });
  }, [dispatch]);

  const discardWorkout = useCallback(() => {
    dispatch({ type: "session/discard" });
  }, [dispatch]);

  const finishWorkout = useCallback((): FinishWorkoutResult => {
    if (!state.activeSession) {
      return { ok: false, message: "No hay un entrenamiento activo." };
    }

    try {
      const session = finishSession(
        state.activeSession,
        new Date().toISOString(),
      );
      dispatch({ type: "session/finish", session });
      return { ok: true, session };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "No se pudo finalizar el entrenamiento.",
      };
    }
  }, [dispatch, state.activeSession]);

  const updateProfile = useCallback((profile: Profile) => {
    dispatch({ type: "profile/update", profile });
  }, [dispatch]);

  const updateSchedule = useCallback((day: WeeklyScheduleDay) => {
    dispatch({ type: "schedule/update", day });
  }, [dispatch]);

  const resetLocalData = useCallback(() => {
    const initialState = createInitialAppState();
    dispatch({ type: "state/reset", state: initialState });

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      runtimeDispatch({ type: "storage-warning", warning: "unavailable" });
    }
  }, [dispatch]);

  const value = useMemo<TrainingContextValue>(
    () => ({
      state,
      isHydrated,
      storageWarning,
      startWorkout,
      startWorkoutSelection,
      recordSet,
      reopenSet,
      navigateExercise,
      pauseWorkout,
      resumeWorkout,
      discardWorkout,
      finishWorkout,
      updateProfile,
      updateSchedule,
      resetLocalData,
    }),
    [
      discardWorkout,
      finishWorkout,
      isHydrated,
      navigateExercise,
      pauseWorkout,
      recordSet,
      reopenSet,
      resetLocalData,
      resumeWorkout,
      startWorkout,
      startWorkoutSelection,
      state,
      storageWarning,
      updateProfile,
      updateSchedule,
    ],
  );

  return (
    <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>
  );
}
