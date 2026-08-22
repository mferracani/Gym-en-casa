"use client";

import {
  ArrowRight,
  Barbell,
  CheckCircle,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { workoutTemplates } from "@/data/training-catalog";
import { todayPlan } from "@/data/training-plan";
import { getWeekOverview } from "@/domain/training/selectors";
import type { LocalDate } from "@/domain/training/types";
import {
  localDateFromDate,
  parseLocalDate,
  weekdayForLocalDate,
} from "@/lib/date/local-date";
import { useTraining } from "@/state/training/use-training";
import type { DayStatus, WeekDay } from "@/types/training";

import { MuscleSummary } from "./muscle-summary";
import { WeekStrip } from "./week-strip";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: LocalDate) {
  return capitalize(
    new Intl.DateTimeFormat("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(parseLocalDate(value)),
  );
}

function greetingFor(date: Date, displayName: string) {
  const hour = date.getHours();
  const greeting = hour < 12 ? "Buen día" : hour < 20 ? "Buenas tardes" : "Buenas noches";
  return displayName.trim() ? `${greeting}, ${displayName.trim()}` : greeting;
}

function activityLabel(
  day: ReturnType<typeof getWeekOverview>[number],
  activeDate?: LocalDate,
) {
  if (day.status === "completed") return "Entrenamiento completado";
  if (activeDate === day.date) return "Entrenamiento en curso";
  if (day.kind === "rest") return "Descanso";
  if (day.kind === "recovery") return "Recuperación";
  if (!day.workoutTemplateId) return "Fuerza · contenido pendiente";
  return day.date === localDateFromDate(new Date())
    ? "Pecho + bíceps · Hoy"
    : "Pecho + bíceps · Planificado";
}

function statusForDay(
  day: ReturnType<typeof getWeekOverview>[number],
  activeDate?: LocalDate,
): DayStatus {
  if (day.status === "completed") return "completed";
  if (activeDate === day.date) return "in-progress";
  if (day.status === "today") return "today";
  if (day.kind === "rest") return "rest";
  if (day.kind === "recovery") return "recovery";
  return day.workoutTemplateId ? "planned" : "content-pending";
}

function toWeekDays(
  overview: ReturnType<typeof getWeekOverview>,
  activeDate?: LocalDate,
): WeekDay[] {
  return overview.map((day) => {
    const date = parseLocalDate(day.date);
    const dayName = capitalize(
      new Intl.DateTimeFormat("es-AR", { weekday: "long" }).format(date),
    );

    return {
      id: day.date,
      shortLabel: dayName === "Miércoles" ? "X" : dayName.slice(0, 1),
      dayName,
      date: date.getDate(),
      status: statusForDay(day, activeDate),
      activity: activityLabel(day, activeDate),
    };
  });
}

export function TodayScreen() {
  const router = useRouter();
  const { isHydrated, startWorkout, state, storageWarning } = useTraining();
  const [ctaMessage, setCtaMessage] = useState("");
  const now = useMemo(() => new Date(), []);
  const today = localDateFromDate(now);
  const weekday = weekdayForLocalDate(today);
  const scheduledDay = state.schedule.find((day) => day.weekday === weekday);
  const template = workoutTemplates.find(
    (item) => item.id === scheduledDay?.workoutTemplateId,
  );
  const completedToday = state.history.find(
    (session) => session.scheduledFor === today,
  );
  const activeSession = state.activeSession;
  const displayWorkout = activeSession?.workoutName ?? completedToday?.workoutName ?? template?.name;
  const completedSets = activeSession?.exercises.reduce(
    (total, exercise) =>
      total + exercise.sets.filter((set) => set.status === "completed").length,
    0,
  );
  const totalSets = activeSession?.exercises.reduce(
    (total, exercise) => total + exercise.sets.length,
    0,
  );
  const week = toWeekDays(
    getWeekOverview(state.schedule, state.history, today),
    activeSession?.scheduledFor,
  );

  if (!isHydrated) {
    return (
      <main aria-busy="true" className="today-page today-loading">
        <p className="eyebrow">Preparando tu semana</p>
        <h1>Entrena Casa</h1>
        <p>Recuperando el progreso guardado en este navegador…</p>
      </main>
    );
  }

  function handleStartWorkout() {
    if (activeSession) {
      router.push("/entrenar");
      return;
    }

    if (completedToday) {
      router.push("/progreso");
      return;
    }

    const result = startWorkout(today);

    if (result.ok) {
      router.push("/entrenar");
      return;
    }

    setCtaMessage(
      result.reason === "equipment"
        ? "La rutina requiere equipo que figura como no disponible en tu perfil."
        : "Este día todavía no tiene una rutina validada.",
    );
  }

  const hasPrimaryAction = Boolean(activeSession || completedToday || template);
  const heroTitle = displayWorkout ??
    (scheduledDay?.kind === "recovery"
      ? "Movilidad + recuperación"
      : scheduledDay?.kind === "rest"
        ? "Descanso"
        : "Fuerza");
  const heroParts = heroTitle.split(" + ");
  const eyebrow = activeSession
    ? "Entrenamiento en curso"
    : completedToday
      ? "Entrenamiento completado"
      : template
        ? "Entrenamiento de hoy"
        : scheduledDay?.kind === "strength"
          ? "Contenido pendiente"
          : "Plan de hoy";
  const primaryLabel = activeSession
    ? "Retomar entrenamiento"
    : completedToday
      ? "Ver progreso"
      : "Empezar entrenamiento";

  return (
      <main className="today-page" id="today">
        <header className="page-intro">
          <div>
            <h1>{greetingFor(now, state.profile.displayName)}</h1>
            <p>{formatDate(today)}</p>
          </div>

          <div className="phase-label" aria-label={todayPlan.phase}>
            <span aria-hidden="true">01</span>
            <strong>{todayPlan.phase}</strong>
          </div>
        </header>

        <WeekStrip days={week} />

        <section
          aria-labelledby="workout-title"
          className={`workout-stage${displayWorkout ? "" : " workout-stage--single"}`}
        >
          <div className="workout-stage__copy">
            <p className="eyebrow">{eyebrow}</p>
            <h2 id="workout-title">
              {heroParts[0]}
              {heroParts[1] ? <span>+ {heroParts[1]}</span> : null}
            </h2>

            <p className="workout-meta">
              {template ? (
                <>
                  <span>{template.estimatedMinutes} min</span>
                  <span aria-hidden="true">·</span>
                  <span>{template.exercises.length} ejercicios</span>
                </>
              ) : (
                <span>{scheduledDay?.kind === "rest" ? "Recuperá energía" : "Sin rutina publicada"}</span>
              )}
            </p>

            {activeSession ? (
              <p className="workout-scheme">
                <strong>{completedSets}</strong> de {totalSets} series registradas
              </p>
            ) : template ? (
              <p className="workout-scheme">
                <strong>{template.exercises[0]?.targetSets}</strong> series
                <span aria-hidden="true">×</span>
                <strong>{template.exercises[0]?.targetReps}</strong> repeticiones
              </p>
            ) : null}

            {hasPrimaryAction ? (
              <button
                className="primary-cta"
                onClick={handleStartWorkout}
                type="button"
              >
                {completedToday && !activeSession ? (
                  <CheckCircle aria-hidden="true" size={22} weight="bold" />
                ) : (
                  <Barbell aria-hidden="true" size={22} weight="bold" />
                )}
                <span>{primaryLabel}</span>
                <ArrowRight aria-hidden="true" size={19} weight="bold" />
              </button>
            ) : null}

            <p
              aria-live="polite"
              className={`cta-feedback${ctaMessage ? " is-visible" : ""}`}
            >
              {ctaMessage ||
                (scheduledDay?.kind === "strength" && !template
                  ? "Esta rutina se habilita cuando el contenido esté validado."
                  : "Tus registros quedan guardados sólo en este navegador.")}
            </p>
          </div>

          {displayWorkout ? <MuscleSummary muscles={todayPlan.muscles} /> : null}
        </section>

        <section aria-label="Recomendaciones para hoy" className="support-notes">
          <article className="support-note support-note--adaptation">
            <ShieldCheck aria-hidden="true" size={25} weight="regular" />
            <div>
              <p>Adaptación</p>
              <h2>{todayPlan.adaptationNotice}</h2>
            </div>
          </article>

          <article className="support-note support-note--safety">
            <WarningCircle aria-hidden="true" size={25} weight="regular" />
            <div>
              <p>Seguridad</p>
              <h2>
                {state.profile.equipment.rack
                  ? "La rutina actual usa mancuernas aun cuando cargaste un rack."
                  : todayPlan.safetyNotice}
              </h2>
            </div>
          </article>

          {storageWarning ? (
            <article className="support-note support-note--storage" role="status">
              <WarningCircle aria-hidden="true" size={25} weight="regular" />
              <div>
                <p>Guardado local</p>
                <h2>
                  No pudimos confirmar el guardado. Podés seguir, pero no cierres esta pestaña.
                </h2>
              </div>
            </article>
          ) : null}
        </section>
      </main>
  );
}
