"use client";

import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { Clock } from "@phosphor-icons/react/Clock";
import { Pause } from "@phosphor-icons/react/Pause";
import { Play } from "@phosphor-icons/react/Play";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { X } from "@phosphor-icons/react/X";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getExerciseVisual } from "@/data/exercise-visuals";
import { getExerciseMovement } from "@/data/exercise-movements";
import { exerciseCatalog } from "@/data/training-catalog";
import { getSessionElapsedSeconds } from "@/domain/training/session";
import type { EquipmentId, SetLog } from "@/domain/training/types";
import { useTraining } from "@/state/training/use-training";

import { ExerciseMovementModal } from "./exercise-movement-modal";
import styles from "./workout-session-screen.module.css";

const equipmentLabels: Record<EquipmentId, string> = {
  dumbbells: "Mancuernas",
  barbell: "Barra con discos",
  "flat-bench": "Banco plano",
  "adjustable-bench": "Banco inclinable",
  rack: "Rack",
};

interface SetDraft {
  reps: string;
  weightKg: string;
}

function getSetDraft(set: SetLog, draft?: SetDraft): SetDraft {
  return (
    draft ?? {
      reps: String(set.actualReps ?? set.targetReps),
      weightKg: set.weightKg === null ? "" : String(set.weightKg),
    }
  );
}

function formatElapsedTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function WorkoutSessionScreen() {
  const router = useRouter();
  const {
    isHydrated,
    state,
    navigateExercise,
    pauseWorkout,
    recordSet,
    reopenSet,
    resumeWorkout,
    discardWorkout,
    finishWorkout,
  } = useTraining();
  const [drafts, setDrafts] = useState<Record<string, SetDraft>>({});
  const [message, setMessage] = useState("");
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [timerNow, setTimerNow] = useState(() => new Date().toISOString());
  const headingRef = useRef<HTMLHeadingElement>(null);
  const discardRef = useRef<HTMLButtonElement>(null);

  const session = state.activeSession;
  const exerciseCatalogById = useMemo(
    () => new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise])),
    [],
  );
  const currentExercise = session?.exercises[session.currentExerciseIndex];
  const currentExerciseId = currentExercise?.exerciseId;
  const currentDefinition = currentExercise
    ? exerciseCatalogById.get(currentExercise.exerciseId)
    : undefined;
  const currentExerciseVisual = currentExerciseId
    ? getExerciseVisual(currentExerciseId)
    : undefined;
  const currentExerciseMovement = currentExerciseId
    ? getExerciseMovement(currentExerciseId)
    : undefined;
  const totalSets = session?.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  ) ?? 0;
  const completedSets = session?.exercises.flatMap((exercise) => exercise.sets).filter(
    (set) => set.status === "completed",
  ) ?? [];
  const volumeKg = completedSets.reduce(
    (total, set) => total + (set.actualReps ?? 0) * (set.weightKg ?? 0),
    0,
  );
  const isPaused = session?.status === "paused";
  const elapsedSeconds = session
    ? getSessionElapsedSeconds(session, timerNow)
    : 0;
  const showRackWarning =
    currentDefinition?.primaryMuscles.includes("Pecho") &&
    !state.profile.equipment.rack;
  const safetyMessage =
    currentDefinition?.safetyNote ??
    currentExerciseMovement?.editorialNote ??
    (showRackWarning
      ? "Sin rack: esta rutina evita el press de pecho con barra. Usá mancuernas."
      : undefined);

  useEffect(() => {
    if (currentExerciseId) {
      headingRef.current?.focus();
    }
  }, [currentExerciseId, showSummary]);

  useEffect(() => {
    if (showDiscardConfirmation) {
      discardRef.current?.focus();
    }
  }, [showDiscardConfirmation]);

  useEffect(() => {
    if (!session || isPaused) {
      return;
    }

    const updateTimer = () => setTimerNow(new Date().toISOString());
    updateTimer();
    const intervalId = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, session]);

  function updateDraft(setId: string, field: keyof SetDraft, value: string) {
    setDrafts((current) => {
      if (!currentExercise) {
        return current;
      }

      const set = currentExercise.sets.find((item) => item.id === setId);

      if (!set) {
        return current;
      }

      return {
        ...current,
        [setId]: {
          ...getSetDraft(set, current[setId]),
          [field]: value,
        },
      };
    });
  }

  function handleRecordSet(set: SetLog) {
    if (!currentExercise) {
      return;
    }

    const draft = getSetDraft(set, drafts[set.id]);
    const actualReps = Number(draft.reps);
    const weightKg = draft.weightKg.trim() === "" ? null : Number(draft.weightKg);

    if (!Number.isInteger(actualReps) || actualReps < 1) {
      setMessage("Ingresá una cantidad de repeticiones mayor a cero.");
      return;
    }

    if (weightKg !== null && (!Number.isFinite(weightKg) || weightKg < 0)) {
      setMessage("Ingresá un peso válido en kg o dejalo vacío.");
      return;
    }

    const result = recordSet({
      exerciseId: currentExercise.exerciseId,
      setId: set.id,
      actualReps,
      weightKg,
    });

    setMessage(
      result.ok
        ? `Serie ${set.order} registrada.`
        : result.message,
    );
  }

  function handleReopenSet(set: SetLog) {
    if (!currentExercise) {
      return;
    }

    reopenSet(currentExercise.exerciseId, set.id);
    setMessage(`Serie ${set.order} reabierta para editar.`);
  }

  function handleFinish() {
    const result = finishWorkout();

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    router.push("/progreso");
  }

  if (!isHydrated) {
    return (
      <main aria-busy="true" className={styles.screen}>
        <section aria-label="Cargando entrenamiento" className={styles.loadingStage}>
          <span className={styles.loadingIndex}>Sesión guiada</span>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonRows} />
        </section>
      </main>
    );
  }

  if (!session || !currentExercise) {
    return (
      <main className={styles.screen}>
        <section aria-labelledby="no-session-title" className={styles.emptyStage}>
          <p className={styles.eyebrow}>Sesión guiada</p>
          <h1 id="no-session-title">No hay un entrenamiento en curso</h1>
          <p>
            Cuando empieces una rutina desde Hoy, vas a registrar una serie por vez acá.
          </p>
          <button className={styles.primaryAction} onClick={() => router.push("/")} type="button">
            Volver a Hoy
          </button>
        </section>
      </main>
    );
  }

  if (showSummary) {
    const missingSets = totalSets - completedSets.length;

    return (
      <main className={styles.screen}>
        <section aria-labelledby="summary-title" className={styles.summaryStage}>
          <p className={styles.eyebrow}>Resumen de la sesión</p>
          <h1 id="summary-title" ref={headingRef} tabIndex={-1}>
            {session.workoutName}
          </h1>

          <dl className={styles.summaryMetrics}>
            <div>
              <dt>Completas</dt>
              <dd>{completedSets.length}</dd>
            </div>
            <div>
              <dt>Faltantes</dt>
              <dd>{missingSets}</dd>
            </div>
            <div>
              <dt>Volumen</dt>
              <dd>{volumeKg.toLocaleString("es-AR")} kg</dd>
            </div>
            <div>
              <dt>Tiempo activo</dt>
              <dd>{formatElapsedTime(elapsedSeconds)}</dd>
            </div>
          </dl>

          <p className={styles.summaryNote}>
            {completedSets.length > 0
              ? "Podés finalizar aunque queden series pendientes."
              : "Registrá al menos una serie para poder finalizar."}
          </p>

          <div className={styles.summaryActions}>
            <button
              className={styles.secondaryAction}
              onClick={() => setShowSummary(false)}
              type="button"
            >
              Volver a la sesión
            </button>
            <button
              className={styles.primaryAction}
              disabled={completedSets.length === 0}
              onClick={handleFinish}
              type="button"
            >
              Finalizar entrenamiento
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.screen}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Sesión guiada</p>
          <p className={styles.progressLabel}>
            Ejercicio {session.currentExerciseIndex + 1} de {session.exercises.length}
          </p>
        </div>
        <div className={styles.timerControls}>
          <div
            aria-label={`Tiempo activo ${formatElapsedTime(elapsedSeconds)}`}
            className={styles.sessionTimer}
            role="timer"
          >
            <Clock aria-hidden="true" size={18} weight="regular" />
            <div>
              <span>{isPaused ? "Tiempo pausado" : "Tiempo activo"}</span>
              <strong>{formatElapsedTime(elapsedSeconds)}</strong>
            </div>
          </div>
          <button
            aria-label={isPaused ? "Retomar entrenamiento" : "Pausar entrenamiento"}
            className={styles.pauseButton}
            onClick={() => {
              if (isPaused) {
                resumeWorkout();
                setTimerNow(new Date().toISOString());
                setMessage("Entrenamiento retomado.");
                return;
              }

              pauseWorkout();
              setTimerNow(new Date().toISOString());
              setMessage("Entrenamiento pausado. El cronómetro quedó detenido.");
            }}
            type="button"
          >
            {isPaused ? <Play aria-hidden="true" size={19} weight="fill" /> : <Pause aria-hidden="true" size={19} weight="fill" />}
            <span>{isPaused ? "Retomar" : "Pausar"}</span>
          </button>
        </div>
      </header>

      <section aria-labelledby="exercise-title" className={styles.exerciseStage}>
        <div className={styles.exerciseHeading}>
          <span aria-hidden="true" className={styles.index}>
            {String(session.currentExerciseIndex + 1).padStart(2, "0")}
          </span>
          <h1 id="exercise-title" ref={headingRef} tabIndex={-1}>
            {currentExercise.name}
          </h1>
          <p>{currentExercise.targetSets} series · {currentExercise.targetReps} repeticiones</p>
        </div>

        {currentExerciseVisual ? (
          <figure className={styles.exerciseVisual}>
            <Image
              alt={currentExerciseVisual.alt}
              className={styles.exerciseVisualImage}
              fill
              loading="eager"
              sizes="(min-width: 720px) 560px, (max-width: 370px) calc(100vw - 32px), (max-width: 390px) calc(100vw - 40px), 350px"
              src={currentExerciseVisual.src}
            />
          </figure>
        ) : null}

        <div className={styles.exerciseFacts}>
          <p>
            <strong>Equipo</strong>
            {currentDefinition?.requiredEquipment.map((item) => equipmentLabels[item]).join(" · ")}
          </p>
          <p>
            <strong>Músculos</strong>
            {currentDefinition?.primaryMuscles.join(" · ")}
          </p>
        </div>

        {currentDefinition && currentExerciseMovement ? (
          <ExerciseMovementModal
            movement={currentExerciseMovement}
            muscleLabel={currentDefinition.primaryMuscles.join(" · ")}
            techniqueCues={currentDefinition.techniqueCues}
            title={currentExercise.name}
          />
        ) : null}

        {safetyMessage ? (
          <aside className={styles.safetyNote}>
            <WarningCircle aria-hidden="true" size={22} weight="regular" />
            <p>{safetyMessage}</p>
          </aside>
        ) : null}

        <aside className={styles.restNote}>
          <Clock aria-hidden="true" size={21} weight="regular" />
          <p>Descanso sugerido: <strong>{currentExercise.restSeconds} segundos</strong>.</p>
        </aside>

        <div aria-label="Registro de series" className={styles.setList}>
          {currentExercise.sets.map((set) => {
            const draft = getSetDraft(set, drafts[set.id]);
            const isCompleted = set.status === "completed";

            return (
              <article className={`${styles.setRow}${isCompleted ? ` ${styles.setRowCompleted}` : ""}`} key={set.id}>
                <div className={styles.setNumber} aria-label={`Serie ${set.order}`}>
                  {isCompleted ? <CheckCircle aria-hidden="true" size={22} weight="fill" /> : set.order}
                </div>
                <label>
                  <span>Reps</span>
                  <input
                    disabled={isCompleted || isPaused}
                    inputMode="numeric"
                    min="1"
                    onChange={(event) => updateDraft(set.id, "reps", event.target.value)}
                    type="number"
                    value={draft.reps}
                  />
                </label>
                <label>
                  <span>Peso kg</span>
                  <input
                    disabled={isCompleted || isPaused}
                    inputMode="decimal"
                    min="0"
                    onChange={(event) => updateDraft(set.id, "weightKg", event.target.value)}
                    placeholder="Opcional"
                    step="0.5"
                    type="number"
                    value={draft.weightKg}
                  />
                </label>
                {isCompleted ? (
                  <button
                    className={styles.textAction}
                    onClick={() => handleReopenSet(set)}
                    type="button"
                  >
                    Reabrir
                  </button>
                ) : (
                  <button
                    className={styles.recordAction}
                    disabled={isPaused}
                    onClick={() => handleRecordSet(set)}
                    type="button"
                  >
                    Registrar
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <nav aria-label="Navegación entre ejercicios" className={styles.exerciseNavigation}>
        <button
          className={styles.secondaryAction}
          disabled={session.currentExerciseIndex === 0 || isPaused}
          onClick={() => navigateExercise(session.currentExerciseIndex - 1)}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Anterior
        </button>
        <button
          className={styles.secondaryAction}
          disabled={session.currentExerciseIndex === session.exercises.length - 1 || isPaused}
          onClick={() => navigateExercise(session.currentExerciseIndex + 1)}
          type="button"
        >
          Siguiente
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </nav>

      <div className={styles.sessionActions}>
        <button className={styles.textAction} onClick={() => setShowDiscardConfirmation(true)} type="button">
          <X aria-hidden="true" size={18} />
          Descartar sesión
        </button>
        <button className={styles.primaryAction} onClick={() => setShowSummary(true)} type="button">
          Ver resumen
          <ArrowRight aria-hidden="true" size={18} />
        </button>
      </div>

      <p aria-live="polite" className={styles.liveMessage} role="status">
        {message}
      </p>

      {showDiscardConfirmation ? (
        <div className={styles.dialogBackdrop}>
          <section aria-labelledby="discard-title" aria-modal="true" className={styles.dialog} role="alertdialog">
            <p className={styles.eyebrow}>Confirmar descarte</p>
            <h2 id="discard-title">¿Descartar este entrenamiento?</h2>
            <p>Vas a perder las series registradas en esta sesión.</p>
            <div className={styles.dialogActions}>
              <button className={styles.secondaryAction} onClick={() => setShowDiscardConfirmation(false)} type="button">
                Seguir entrenando
              </button>
              <button
                className={styles.dangerAction}
                onClick={() => {
                  discardWorkout();
                  router.push("/");
                }}
                ref={discardRef}
                type="button"
              >
                Sí, descartar
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
