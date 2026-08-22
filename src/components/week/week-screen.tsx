"use client";

import { CalendarDots } from "@phosphor-icons/react/CalendarDots";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { PencilSimple } from "@phosphor-icons/react/PencilSimple";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { useMemo, useState } from "react";

import { exerciseCatalog, workoutTemplates } from "@/data/training-catalog";
import { getAvailableWorkoutTemplates } from "@/domain/training/constraints";
import { getWeekOverview } from "@/domain/training/selectors";
import type { WeeklyScheduleDay, Weekday } from "@/domain/training/types";
import { localDateFromDate } from "@/lib/date/local-date";
import { useTraining } from "@/state/training/use-training";

import styles from "./week-screen.module.css";

const weekdayLabels: Record<Weekday, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

type ScheduleChoice = `template:${string}` | "strength-pending" | "recovery" | "rest";

function scheduleChoiceFor(day: WeeklyScheduleDay): ScheduleChoice {
  return day.kind === "strength" && day.workoutTemplateId
    ? `template:${day.workoutTemplateId}`
    : day.kind === "strength"
      ? "strength-pending"
      : day.kind;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

export function WeekScreen() {
  const { isHydrated, state, updateSchedule } = useTraining();
  const [isEditing, setIsEditing] = useState(false);
  const [draftSchedule, setDraftSchedule] = useState<WeeklyScheduleDay[] | null>(null);

  const today = localDateFromDate(new Date());
  const overview = useMemo(
    () => getWeekOverview(state.schedule, state.history, today),
    [state.history, state.schedule, today],
  );
  const availableTemplateIds = useMemo(
    () =>
      new Set(
        getAvailableWorkoutTemplates(
          workoutTemplates,
          exerciseCatalog,
          state.profile,
        ).map(({ id }) => id),
      ),
    [state.profile],
  );
  function beginEditing() {
    setDraftSchedule(state.schedule.map((day) => ({ ...day })));
    setIsEditing(true);
  }

  function cancelEditing() {
    setDraftSchedule(null);
    setIsEditing(false);
  }

  function changeDay(weekday: Weekday, choice: ScheduleChoice) {
    setDraftSchedule((current) => {
      if (!current) {
        return current;
      }

      let nextDay: WeeklyScheduleDay;

      if (choice.startsWith("template:")) {
        const templateId = choice.slice("template:".length);
        const template = workoutTemplates.find(({ id }) => id === templateId);
        nextDay = template
          ? { weekday, kind: "strength", workoutTemplateId: template.id }
          : { weekday, kind: "strength" };

        return current.map((day) => (day.weekday === weekday ? nextDay : day));
      }

      switch (choice) {
        case "strength-pending":
          nextDay = { weekday, kind: "strength" };
          break;
        case "recovery":
          nextDay = { weekday, kind: "recovery" };
          break;
        case "rest":
          nextDay = { weekday, kind: "rest" };
          break;
      }

      return current.map((day) => (day.weekday === weekday ? nextDay : day));
    });
  }

  function saveSchedule() {
    if (!draftSchedule) {
      return;
    }

    draftSchedule.forEach((day) => updateSchedule(day));
    setDraftSchedule(null);
    setIsEditing(false);
  }

  if (!isHydrated) {
    return (
      <main className={styles.page}>
        <section aria-busy="true" aria-live="polite" className={styles.loading}>
          <CalendarDots aria-hidden="true" size={28} weight="regular" />
          <h1>Tu semana</h1>
          <p>Cargando tu planificación guardada en este navegador…</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Planificación local</p>
          <h1>Tu semana</h1>
          <p className={styles.description}>
            Ajustá qué tipo de día querés seguir. Los cambios aplican a las próximas semanas.
          </p>
        </div>

        {!isEditing ? (
          <button className={styles.editButton} onClick={beginEditing} type="button">
            <PencilSimple aria-hidden="true" size={19} weight="bold" />
            Editar semana
          </button>
        ) : null}
      </header>

      {state.activeSession ? (
        <p className={styles.activeNotice} role="status">
          <WarningCircle aria-hidden="true" size={19} weight="fill" />
          Tenés una sesión en curso: {state.activeSession.workoutName}.
        </p>
      ) : null}

      <section aria-labelledby="week-list-title" className={styles.schedule}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Lunes a domingo</p>
            <h2 id="week-list-title">Esta semana</h2>
          </div>
          <span>{overview.filter((day) => day.status === "completed").length} completados</span>
        </div>

        <ol className={styles.dayList}>
          {overview.map((day) => {
            const scheduledDay = (draftSchedule ?? state.schedule).find(
              (item) => item.weekday === day.weekday,
            ) ?? { weekday: day.weekday, kind: "rest" as const };
            const template = workoutTemplates.find(
              (item) => item.id === scheduledDay.workoutTemplateId,
            );
            const completedSession = state.history.find(
              (session) => session.scheduledFor === day.date,
            );
            const activeForDay = state.activeSession?.scheduledFor === day.date;
            const statusLabel = activeForDay
              ? "En curso"
              : day.status === "completed"
                ? "Completado"
                : day.kind === "recovery"
                  ? "Recuperación"
                  : day.kind === "rest"
                    ? "Descanso"
                    : day.status === "today"
                      ? "Disponible hoy"
                      : "Programado";
            const activityLabel =
              scheduledDay.kind === "strength"
                ? template?.name ?? "Fuerza · contenido pendiente"
                : scheduledDay.kind === "recovery"
                  ? "Recuperación"
                  : "Descanso";

            return (
              <li className={styles.day} key={day.weekday}>
                <div className={styles.dayDate}>
                  <strong>{weekdayLabels[day.weekday]}</strong>
                  <span>{formatDate(day.date)}</span>
                </div>

                <div className={styles.dayPlan}>
                  <p>{activityLabel}</p>
                  {completedSession ? (
                    <span className={styles.historyText}>
                      Cerraste: {completedSession.workoutName}
                    </span>
                  ) : null}
                  {activeForDay ? (
                    <span className={styles.historyText}>
                      Sesión actual: {state.activeSession?.workoutName}
                    </span>
                  ) : null}
                </div>

                <div className={styles.dayState}>
                  <span className={styles.status} data-status={activeForDay ? "active" : day.status}>
                    {day.status === "completed" ? (
                      <CheckCircle aria-hidden="true" size={16} weight="fill" />
                    ) : null}
                    {statusLabel}
                  </span>
                </div>

                {isEditing ? (
                  <label className={styles.editorLabel}>
                    <span className="sr-only">Plan para {weekdayLabels[day.weekday]}</span>
                    <select
                      aria-label={`Plan para ${weekdayLabels[day.weekday]}`}
                      className={styles.select}
                      onChange={(event) =>
                        changeDay(day.weekday, event.target.value as ScheduleChoice)
                      }
                      value={scheduleChoiceFor(scheduledDay)}
                    >
                      {workoutTemplates.map((workoutTemplate) => (
                        <option
                          disabled={!availableTemplateIds.has(workoutTemplate.id)}
                          key={workoutTemplate.id}
                          value={`template:${workoutTemplate.id}`}
                        >
                          {workoutTemplate.name}
                          {!availableTemplateIds.has(workoutTemplate.id)
                            ? " · falta equipo"
                            : ""}
                        </option>
                      ))}
                      <option value="strength-pending">Fuerza · contenido pendiente</option>
                      <option value="recovery">Recuperación</option>
                      <option value="rest">Descanso</option>
                    </select>
                  </label>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      {isEditing ? (
        <footer className={styles.editorActions}>
          <button className={styles.cancelButton} onClick={cancelEditing} type="button">
            Cancelar
          </button>
          <button className={styles.saveButton} onClick={saveSchedule} type="button">
            Guardar semana
          </button>
        </footer>
      ) : null}
    </main>
  );
}
