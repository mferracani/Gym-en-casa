"use client";

import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { X } from "@phosphor-icons/react/X";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { exerciseCatalog } from "@/data/training-catalog";
import {
  generateDailyWorkoutPlan,
  isDailyWorkoutPlanValid,
  type DailyWorkoutPlan,
  type PreferredTrainingSection,
} from "@/domain/training/daily-plan";
import type { AgentWorkoutProposal } from "@/server/agent-bridge-store";
import {
  verifyWorkoutProposalFragment,
} from "@/lib/agent/workout-proposal-link";
import { getWorkoutProposalPublicKey } from "@/lib/agent/workout-proposal-public-key";
import { useTraining } from "@/state/training/use-training";

import styles from "./smart-workout-planner.module.css";

const choices = [
  { id: "recommend", label: "Recomendame" },
  { id: "chest-biceps", label: "Pecho + bíceps" },
  { id: "back-triceps", label: "Espalda + tríceps" },
  { id: "shoulders", label: "Hombros" },
  { id: "abs", label: "Abdominales" },
] as const satisfies readonly {
  id: PreferredTrainingSection;
  label: string;
}[];

function sourceLabel(plan: DailyWorkoutPlan) {
  if (plan.source === "chatgpt") return "Propuesta de ChatGPT";
  if (plan.source === "openclaw") return "Propuesta de OpenClaw";
  return "Motor local · sin costo";
}

async function decideProposal(
  proposalId: string,
  decision: "accepted" | "rejected",
) {
  const response = await fetch("/api/agent/proposals", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ proposalId, decision }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? "No se pudo actualizar la propuesta.");
  }
}

function clearProposalFragment() {
  const parameters = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  parameters.delete("proposal");
  const nextFragment = parameters.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${window.location.search}${nextFragment ? `#${nextFragment}` : ""}`,
  );
}

export function SmartWorkoutPlanner() {
  const router = useRouter();
  const { isHydrated, startWorkoutPlan, state } = useTraining();
  const [isOpen, setIsOpen] = useState(false);
  const [preferredSection, setPreferredSection] =
    useState<PreferredTrainingSection>("recommend");
  const [plan, setPlan] = useState<DailyWorkoutPlan | null>(null);
  const [agentProposal, setAgentProposal] =
    useState<AgentWorkoutProposal | null>(null);
  const [proposalHash, setProposalHash] = useState("");
  const [deepLinkRequestId, setDeepLinkRequestId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const processedHash = useRef("");
  const catalogById = useMemo(
    () => new Map(exerciseCatalog.map((exercise) => [exercise.id, exercise])),
    [],
  );

  useEffect(() => {
    function syncHash() {
      setProposalHash(window.location.hash);
    }

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (
      !isHydrated ||
      !proposalHash.includes("proposal=") ||
      processedHash.current === proposalHash
    ) {
      return;
    }

    processedHash.current = proposalHash;
    let cancelled = false;

    async function loadDeepLinkProposal() {
      try {
        const result = await verifyWorkoutProposalFragment(
          proposalHash,
          await getWorkoutProposalPublicKey(),
        );
        if (cancelled) return;

        if (!result.ok) {
          setFeedback(
            result.reason === "expired"
              ? "La propuesta de ChatGPT venció. Pedí una nueva para este entrenamiento."
              : "El enlace de propuesta no es válido o no fue firmado por Entrena Casa.",
          );
          setIsOpen(true);
          clearProposalFragment();
          setProposalHash("");
          return;
        }

        const nextPlan = generateDailyWorkoutPlan({
          preferredSection: result.proposal.preferredSection,
          source: result.proposal.source,
          context: {
            history: state.history,
            profile: state.profile,
            now: new Date().toISOString(),
          },
        });
        if (!isDailyWorkoutPlanValid(nextPlan, exerciseCatalog, state.profile)) {
          throw new Error("La propuesta no es compatible con tu equipo actual.");
        }

        setAgentProposal(null);
        setDeepLinkRequestId(result.proposal.requestId);
        setPreferredSection(result.proposal.preferredSection);
        setPlan(nextPlan);
        setIsOpen(true);
        setFeedback(
          "Propuesta firmada de ChatGPT. Revisala: todavía no se guardó ni inició nada.",
        );
      } catch (error) {
        if (cancelled) return;
        setFeedback(
          error instanceof Error
            ? error.message
            : "No se pudo revisar la propuesta de ChatGPT.",
        );
        setIsOpen(true);
      }
    }

    void loadDeepLinkProposal();
    return () => {
      cancelled = true;
    };
  }, [isHydrated, proposalHash, state.history, state.profile]);

  useEffect(() => {
    if (deepLinkRequestId) return;

    let cancelled = false;

    async function loadPendingProposal() {
      try {
        const response = await fetch("/api/agent/proposals", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const payload = (await response.json()) as {
          bridgeEnabled?: boolean;
          proposal: AgentWorkoutProposal | null;
        };

        if (payload.bridgeEnabled === false) {
          window.clearInterval(intervalId);
          return;
        }

        if (
          !cancelled &&
          payload.proposal &&
          payload.proposal.id !== agentProposal?.id
        ) {
          setAgentProposal(payload.proposal);
          setPlan(payload.proposal.plan);
          setPreferredSection(payload.proposal.plan.sectionId);
          setIsOpen(true);
          setFeedback(
            `${sourceLabel(payload.proposal.plan)} lista para que la revises.`,
          );
        }
      } catch {
        // El planner local sigue funcionando aunque el puente no esté iniciado.
      }
    }

    void loadPendingProposal();
    const intervalId = window.setInterval(loadPendingProposal, 4_000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [agentProposal?.id, deepLinkRequestId]);

  async function generatePlan() {
    try {
      if (agentProposal) {
        await decideProposal(agentProposal.id, "rejected");
      }

      if (deepLinkRequestId) {
        clearProposalFragment();
        setProposalHash("");
        setDeepLinkRequestId(null);
      }

      const nextPlan = generateDailyWorkoutPlan({
        preferredSection,
        context: {
          history: state.history,
          profile: state.profile,
          now: new Date().toISOString(),
        },
      });
      setPlan(nextPlan);
      setAgentProposal(null);
      setFeedback("Rutina preparada con tu historial y el equipo disponible.");
    } catch (error) {
      setFeedback(
        error instanceof Error
          ? error.message
          : "No se pudo preparar una rutina compatible.",
      );
    }
  }

  async function dismissPlan() {
    if (agentProposal) {
      try {
        await decideProposal(agentProposal.id, "rejected");
      } catch (error) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "No se pudo rechazar la propuesta.",
        );
        return;
      }
    }

    setPlan(null);
    setAgentProposal(null);
    if (deepLinkRequestId) {
      clearProposalFragment();
      setProposalHash("");
      setDeepLinkRequestId(null);
    }
    setFeedback("");
    setIsOpen(false);
  }

  async function startPlan() {
    if (!plan) return;

    if (state.activeSession) {
      router.push("/entrenar");
      return;
    }

    if (!isDailyWorkoutPlanValid(plan, exerciseCatalog, state.profile)) {
      setFeedback("La rutina ya no es compatible con tu equipo actual.");
      return;
    }

    if (agentProposal) {
      try {
        await decideProposal(agentProposal.id, "accepted");
      } catch (error) {
        setFeedback(
          error instanceof Error
            ? error.message
            : "No se pudo aceptar la propuesta.",
        );
        return;
      }
    }

    const result = startWorkoutPlan(plan);
    if (!result.ok) {
      setFeedback(
        result.reason === "equipment"
          ? "La rutina requiere equipo que figura como no disponible."
          : "No se pudo iniciar esta rutina. Revisá la selección.",
      );
      return;
    }

    if (deepLinkRequestId) {
      clearProposalFragment();
      setProposalHash("");
      setDeepLinkRequestId(null);
    }

    router.push("/entrenar");
  }

  const totalSets = plan?.exercises.reduce(
    (total, exercise) => total + exercise.targetSets,
    0,
  );

  return (
    <section className={styles.planner} aria-labelledby="smart-planner-title">
      <div className={styles.intro}>
        <div className={styles.icon} aria-hidden="true">
          <Sparkle size={22} weight="fill" />
        </div>
        <div>
          <p className={styles.eyebrow}>Sugerencia inteligente</p>
          <h2 id="smart-planner-title">Elegí qué entrenar hoy</h2>
          <p>
            El generador usa tu historial y plantillas validadas. Funciona
            local, sin API key ni costo adicional.
          </p>
        </div>

        {!isOpen ? (
          <button
            className={styles.openButton}
            disabled={Boolean(state.activeSession)}
            onClick={() => setIsOpen(true)}
            type="button"
          >
            {state.activeSession ? "Sesión en curso" : "Sugerir rutina"}
            {!state.activeSession ? (
              <ArrowRight aria-hidden="true" size={18} weight="bold" />
            ) : null}
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <div className={styles.workspace}>
          <fieldset className={styles.choices}>
            <legend>¿Qué grupo querés trabajar?</legend>
            <div>
              {choices.map((choice) => (
                <button
                  aria-pressed={preferredSection === choice.id}
                  className={
                    preferredSection === choice.id ? styles.choiceActive : styles.choice
                  }
                  key={choice.id}
                  onClick={() => {
                    setPreferredSection(choice.id);
                    setPlan(null);
                    setFeedback("");
                  }}
                  type="button"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </fieldset>

          {!plan ? (
            <div className={styles.generateRow}>
              <p>
                Base avanzada: técnica estable, 4–5 ejercicios y 2–3
                repeticiones en reserva.
              </p>
              <button onClick={generatePlan} type="button">
                <Sparkle aria-hidden="true" size={18} weight="fill" />
                Generar rutina
              </button>
            </div>
          ) : (
            <article className={styles.result} aria-label="Rutina sugerida">
              <header>
                <div>
                  <p>{sourceLabel(plan)}</p>
                  <h3>{plan.name}</h3>
                </div>
                <button
                  aria-label="Descartar sugerencia"
                  className={styles.closeButton}
                  onClick={dismissPlan}
                  type="button"
                >
                  <X aria-hidden="true" size={20} />
                </button>
              </header>

              <p className={styles.rationale}>{plan.rationale}</p>

              <div className={styles.metrics} aria-label="Resumen de la rutina">
                <span><strong>{plan.exercises.length}</strong> ejercicios</span>
                <span><strong>{totalSets}</strong> series</span>
                <span><strong>{plan.estimatedMinutes}</strong> min</span>
                <span><strong>RIR {plan.targetRir}</strong></span>
              </div>

              <ol className={styles.exerciseList}>
                {plan.exercises.map((exercise) => (
                  <li key={exercise.exerciseId}>
                    <span>{catalogById.get(exercise.exerciseId)?.name}</span>
                    <strong>
                      {exercise.targetSets} × {exercise.targetReps}
                    </strong>
                  </li>
                ))}
              </ol>

              <div className={styles.guidance}>
                <CheckCircle aria-hidden="true" size={21} weight="fill" />
                <p>{plan.progression}</p>
              </div>

              {plan.advisories.map((advisory) => (
                <div className={styles.advisory} key={advisory}>
                  <WarningCircle aria-hidden="true" size={19} />
                  <p>{advisory}</p>
                </div>
              ))}

              <button
                className={styles.startButton}
                onClick={startPlan}
                type="button"
              >
                {state.activeSession ? "Retomá la sesión en curso" : "Usar esta rutina"}
                {!state.activeSession ? (
                  <ArrowRight aria-hidden="true" size={18} weight="bold" />
                ) : null}
              </button>
            </article>
          )}

          <p className={styles.feedback} aria-live="polite">
            {feedback}
          </p>
        </div>
      ) : null}
    </section>
  );
}
