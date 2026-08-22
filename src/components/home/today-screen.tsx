"use client";

import {
  ArrowRight,
  Barbell,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { useState } from "react";

import type {
  NavigationItem,
  TrainingPlan,
  WeekDay,
} from "@/types/training";

import { BottomNav } from "./bottom-nav";
import { MuscleSummary } from "./muscle-summary";
import { WeekStrip } from "./week-strip";

interface TodayScreenProps {
  plan: TrainingPlan;
  week: WeekDay[];
  navigation: NavigationItem[];
}

export function TodayScreen({ plan, week, navigation }: TodayScreenProps) {
  const [ctaMessage, setCtaMessage] = useState("");

  function handleStartWorkout() {
    setCtaMessage(
      "La rutina está lista. El registro guiado se habilita en el Sprint 2.",
    );
  }

  return (
    <div className="app-shell">
      <main className="today-page" id="today">
        <header className="page-intro">
          <div>
            <h1>{plan.greeting}</h1>
            <p>{plan.dateLabel}</p>
          </div>

          <div className="phase-label" aria-label={plan.phase}>
            <span aria-hidden="true">01</span>
            <strong>{plan.phase}</strong>
          </div>
        </header>

        <WeekStrip days={week} />

        <section aria-labelledby="workout-title" className="workout-stage">
          <div className="workout-stage__copy">
            <p className="eyebrow">Entrenamiento de hoy</p>
            <h2 id="workout-title">
              Pecho +<span>bíceps</span>
            </h2>

            <p className="workout-meta">
              <span>{plan.durationMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>{plan.exercises.length} ejercicios</span>
            </p>

            <p className="workout-scheme">
              <strong>{plan.scheme.sets}</strong> series
              <span aria-hidden="true">×</span>
              <strong>{plan.scheme.repetitions}</strong> repeticiones
            </p>

            <button
              className="primary-cta"
              onClick={handleStartWorkout}
              type="button"
            >
              <Barbell aria-hidden="true" size={22} weight="bold" />
              <span>Empezar entrenamiento</span>
              <ArrowRight aria-hidden="true" size={19} weight="bold" />
            </button>

            <p
              aria-live="polite"
              className={`cta-feedback${ctaMessage ? " is-visible" : ""}`}
            >
              {ctaMessage || "La sesión guiada pertenece al próximo sprint."}
            </p>
          </div>

          <MuscleSummary muscles={plan.muscles} />
        </section>

        <section aria-label="Recomendaciones para hoy" className="support-notes">
          <article className="support-note support-note--adaptation">
            <ShieldCheck aria-hidden="true" size={25} weight="regular" />
            <div>
              <p>Adaptación</p>
              <h2>{plan.adaptationNotice}</h2>
            </div>
          </article>

          <article className="support-note support-note--safety">
            <WarningCircle aria-hidden="true" size={25} weight="regular" />
            <div>
              <p>Seguridad</p>
              <h2>{plan.safetyNotice}</h2>
            </div>
          </article>
        </section>
      </main>

      <BottomNav items={navigation} />
    </div>
  );
}
