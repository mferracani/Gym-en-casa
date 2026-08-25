"use client";

import { ChartLineUp } from "@phosphor-icons/react/ChartLineUp";
import { ClipboardText } from "@phosphor-icons/react/ClipboardText";
import { Fire } from "@phosphor-icons/react/Fire";
import { TrendUp } from "@phosphor-icons/react/TrendUp";
import { useState } from "react";

import {
  getExerciseProgress,
  getHistoricalSessionSummaries,
} from "../../domain/training/exercise-progress.ts";
import {
  deriveProgress,
  getTrainingActivityWeeks,
  type TrainingActivityDay,
} from "../../domain/training/selectors.ts";
import type { LocalDate } from "../../domain/training/types.ts";
import { localDateFromDate } from "../../lib/date/local-date.ts";
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

function formatActivityDate(value: LocalDate): string {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return "menos de 1 min";

  const totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours} h${minutes > 0 ? ` ${minutes} min` : ""}`
    : `${minutes} min`;
}

function describeActivity(day: TrainingActivityDay): string {
  if (day.isFuture) return "Próximo día";
  if (day.sessionCount === 0) return "Sin entrenamiento registrado";

  const sessions = day.sessionCount === 1 ? "1 entrenamiento" : `${day.sessionCount} entrenamientos`;
  const sets = day.completedSets === 1 ? "1 serie" : `${day.completedSets} series`;

  return `${sessions} · ${sets} · ${formatDuration(day.durationSeconds)}`;
}

export function ProgressScreen() {
  const { isHydrated, state } = useTraining();
  const [today] = useState(() => localDateFromDate(new Date()));
  const [selectedDate, setSelectedDate] = useState<LocalDate>(today);

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
  const activityWeeks = getTrainingActivityWeeks(state.history, today);
  const activityDays = activityWeeks.flatMap((week) => week.days);
  const selectedActivity =
    activityDays.find((day) => day.date === selectedDate) ?? activityDays.at(-1);
  const currentWeekTrainingDays = activityWeeks.at(-1)?.days.filter(
    (day) => !day.isFuture && day.sessionCount > 0,
  ).length ?? 0;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Entrena Casa</p>
        <h1>Progreso</h1>
        <p>Registros completados en este dispositivo.</p>
      </header>


      <section aria-labelledby="activity-title" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 id="activity-title">Actividad de entrenamiento</h2>
          <span>
            {currentWeekTrainingDays} {currentWeekTrainingDays === 1 ? "día" : "días"} esta semana
          </span>
        </div>

        <div className={styles.activityCard}>
          <div className={styles.activityLead}>
            <Fire aria-hidden="true" size={22} weight="fill" />
            <div>
              <strong>Tu ritmo, día por día</strong>
              <span>Últimas 12 semanas · más intensidad, más series</span>
            </div>
          </div>

          <div className={styles.activityScroller}>
            <div className={styles.activityChart}>
              <div aria-hidden="true" className={styles.weekdayLabels}>
                {["L", "M", "X", "J", "V", "S", "D"].map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
              <div aria-label="Entrenamientos de las últimas 12 semanas" className={styles.activityWeeks}>
                {activityWeeks.map((week) => (
                  <div className={styles.activityWeek} key={week.monday}>
                    {week.days.map((day) => {
                      const label = `${formatActivityDate(day.date)}: ${describeActivity(day)}`;

                      return (
                        <button
                          aria-label={label}
                          aria-pressed={selectedActivity?.date === day.date}
                          className={`${styles.activityCell}${day.isFuture ? ` ${styles.activityCellFuture}` : ""}`}
                          data-intensity={day.intensity}
                          disabled={day.isFuture}
                          key={day.date}
                          onClick={() => setSelectedDate(day.date)}
                          title={label}
                          type="button"
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.activityLegend}>
            <span>Sin registro</span>
            <i data-intensity="0" />
            <i data-intensity="1" />
            <i data-intensity="2" />
            <i data-intensity="3" />
            <span>Más series</span>
          </div>

          {selectedActivity ? (
            <div aria-live="polite" className={styles.activityDetail}>
              <strong>{formatActivityDate(selectedActivity.date)}</strong>
              <span>{describeActivity(selectedActivity)}</span>
            </div>
          ) : null}
        </div>
      </section>

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
