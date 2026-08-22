"use client";

import { ChartLineUp } from "@phosphor-icons/react/ChartLineUp";
import { ClipboardText } from "@phosphor-icons/react/ClipboardText";
import { TrendUp } from "@phosphor-icons/react/TrendUp";

import {
  getExerciseProgress,
  getHistoricalSessionSummaries,
} from "../../domain/training/exercise-progress.ts";
import { deriveProgress } from "../../domain/training/selectors.ts";
import { useTraining } from "../../state/training/use-training";
import styles from "./progress-screen.module.css";

const kilosFormatter = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 2,
});

function formatKilos(value: number | null): string {
  return value === null ? "Sin peso" : `${kilosFormatter.format(value)} kg`;
}

function formatDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ProgressScreen() {
  const { isHydrated, state } = useTraining();

  if (!isHydrated) {
    return (
      <main className={styles.page} aria-busy="true">
        <p className={styles.loading}>Cargando tu progreso local…</p>
      </main>
    );
  }

  const summary = deriveProgress(state.history);
  const sessions = getHistoricalSessionSummaries(state.history);
  const exercises = getExerciseProgress(state.history);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Entrena Casa</p>
        <h1>Progreso</h1>
        <p>Registros completados en este dispositivo.</p>
      </header>

      {sessions.length === 0 ? (
        <section className={styles.empty} aria-labelledby="empty-progress-title">
          <ChartLineUp aria-hidden="true" size={34} weight="light" />
          <h2 id="empty-progress-title">Todavía no hay sesiones completadas</h2>
          <p>
            Cuando finalices un entrenamiento, vas a ver acá las series, los
            pesos y el volumen registrados.
          </p>
        </section>
      ) : (
        <>
          <section aria-labelledby="summary-title" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 id="summary-title">Resumen</h2>
              <TrendUp aria-hidden="true" size={20} weight="regular" />
            </div>
            <dl className={styles.summaryGrid}>
              <div>
                <dt>Sesiones</dt>
                <dd>{summary.completedSessions}</dd>
              </div>
              <div>
                <dt>Series</dt>
                <dd>{summary.completedSets}</dd>
              </div>
              <div>
                <dt>Volumen</dt>
                <dd>{formatKilos(summary.totalVolumeKg)}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="history-title" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 id="history-title">Sesiones completadas</h2>
              <ClipboardText aria-hidden="true" size={20} weight="regular" />
            </div>
            <ol className={styles.sessionList}>
              {sessions.map((session) => (
                <li className={styles.sessionItem} key={session.id}>
                  <div>
                    <strong>{session.workoutName}</strong>
                    <span>{formatDate(session.scheduledFor)}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Series</dt>
                      <dd>{session.completedSets}</dd>
                    </div>
                    <div>
                      <dt>Reps</dt>
                      <dd>{session.completedRepetitions}</dd>
                    </div>
                    <div>
                      <dt>Volumen</dt>
                      <dd>{formatKilos(session.totalVolumeKg)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="exercise-title" className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 id="exercise-title">Por ejercicio</h2>
              <span>Series completadas</span>
            </div>
            <ul className={styles.exerciseList}>
              {exercises.map((exercise) => (
                <li className={styles.exerciseItem} key={exercise.exerciseId}>
                  <h3>{exercise.name}</h3>
                  <dl>
                    <div>
                      <dt>Último</dt>
                      <dd>
                        {exercise.lastReps ?? "—"} reps · {formatKilos(exercise.lastWeightKg)}
                      </dd>
                    </div>
                    <div>
                      <dt>Máximo peso</dt>
                      <dd>{formatKilos(exercise.maxWeightKg)}</dd>
                    </div>
                    <div>
                      <dt>Volumen</dt>
                      <dd>{formatKilos(exercise.totalVolumeKg)}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
