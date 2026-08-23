import {
  defaultProfile,
  workoutTemplates,
} from "../data/training-catalog.ts";
import {
  generateDailyWorkoutPlan,
  type DailyPlanSource,
  type DailyWorkoutPlan,
  type PreferredTrainingSection,
} from "../domain/training/daily-plan.ts";
import type {
  CompletedSession,
  ExerciseSectionId,
  Profile,
} from "../domain/training/types.ts";

export interface AgentHistorySummary {
  id: string;
  completedAt: string;
  sectionId: ExerciseSectionId;
}

export interface AgentTrainingContext {
  syncedAt: string;
  profile: { equipment: Profile["equipment"] };
  activeSession: {
    id: string;
    workoutName: string;
    startedAt: string;
  } | null;
  history: AgentHistorySummary[];
}

export interface AgentProposalRequest {
  requestId: string;
  preferredSection: PreferredTrainingSection;
  source: Exclude<DailyPlanSource, "local">;
}

export interface AgentWorkoutProposal {
  id: string;
  requestId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  requestedSection: PreferredTrainingSection;
  plan: DailyWorkoutPlan;
}

interface AgentBridgeState {
  context: AgentTrainingContext | null;
  pendingProposal: AgentWorkoutProposal | null;
  proposalsByRequest: Map<string, AgentWorkoutProposal>;
}

declare global {
  var __entrenaCasaAgentBridgeState: AgentBridgeState | undefined;
}

const bridgeState =
  globalThis.__entrenaCasaAgentBridgeState ??
  {
    context: null,
    pendingProposal: null,
    proposalsByRequest: new Map(),
  };

globalThis.__entrenaCasaAgentBridgeState = bridgeState;

const PROPOSAL_CACHE_LIMIT = 100;

function proposalRequestKey(request: AgentProposalRequest) {
  return `${request.source}:${request.requestId}`;
}

function rememberProposal(key: string, proposal: AgentWorkoutProposal) {
  bridgeState.proposalsByRequest.set(key, proposal);

  while (bridgeState.proposalsByRequest.size > PROPOSAL_CACHE_LIMIT) {
    const oldestKey = bridgeState.proposalsByRequest.keys().next().value;
    if (typeof oldestKey !== "string") break;
    bridgeState.proposalsByRequest.delete(oldestKey);
  }
}

function toCompletedSession(summary: AgentHistorySummary): CompletedSession {
  const template = workoutTemplates.find(
    (candidate) => candidate.sectionId === summary.sectionId,
  );

  return {
    id: summary.id,
    scheduledFor: summary.completedAt.slice(0, 10),
    templateId: template?.id ?? `agent-${summary.sectionId}`,
    workoutName: template?.name ?? summary.sectionId,
    startedAt: summary.completedAt,
    completedAt: summary.completedAt,
    durationSeconds: 0,
    exercises: [],
  };
}

export function syncAgentContext(context: AgentTrainingContext) {
  bridgeState.context = structuredClone(context);
}

export function getAgentContext() {
  return bridgeState.context ? structuredClone(bridgeState.context) : null;
}

export function suggestAgentWorkout(
  preferredSection: PreferredTrainingSection,
  source: Exclude<DailyPlanSource, "local">,
) {
  if (!bridgeState.context) {
    throw new Error(
      "Abrí Entrena Casa primero para sincronizar el estado local con el agente.",
    );
  }

  return generateDailyWorkoutPlan({
    preferredSection,
    source,
    context: {
      history: bridgeState.context.history.map(toCompletedSession),
      profile: {
        ...defaultProfile,
        equipment: { ...bridgeState.context.profile.equipment },
      },
      now: new Date().toISOString(),
    },
  });
}

export function queueAgentProposal(
  request: AgentProposalRequest,
): AgentWorkoutProposal {
  const requestKey = proposalRequestKey(request);
  const existing = bridgeState.proposalsByRequest.get(requestKey);
  if (existing) {
    if (existing.requestedSection !== request.preferredSection) {
      throw new Error(
        "El requestId ya fue usado con otra sección de entrenamiento.",
      );
    }
    return structuredClone(existing);
  }

  if (!bridgeState.context) {
    throw new Error(
      "Abrí Entrena Casa primero para sincronizar el estado local con el agente.",
    );
  }

  if (bridgeState.pendingProposal) {
    throw new Error(
      "Ya hay una propuesta pendiente. Aceptala o rechazala antes de enviar otra.",
    );
  }

  const generatedAt = new Date().toISOString();
  const plan = suggestAgentWorkout(request.preferredSection, request.source);
  const proposal: AgentWorkoutProposal = {
    id: `proposal-${request.source}-${request.requestId}`,
    requestId: request.requestId,
    status: "pending",
    createdAt: generatedAt,
    requestedSection: request.preferredSection,
    plan,
  };

  bridgeState.pendingProposal = proposal;
  rememberProposal(requestKey, proposal);
  return structuredClone(proposal);
}

export function getPendingAgentProposal() {
  return bridgeState.pendingProposal
    ? structuredClone(bridgeState.pendingProposal)
    : null;
}

export function decideAgentProposal(
  proposalId: string,
  decision: "accepted" | "rejected",
) {
  const proposal = bridgeState.pendingProposal;

  if (!proposal || proposal.id !== proposalId) {
    throw new Error("La propuesta ya no está pendiente.");
  }

  const decided = { ...proposal, status: decision };
  rememberProposal(`${proposal.plan.source}:${proposal.requestId}`, decided);
  bridgeState.pendingProposal = null;
  return structuredClone(decided);
}

export function resetAgentBridgeForTests() {
  bridgeState.context = null;
  bridgeState.pendingProposal = null;
  bridgeState.proposalsByRequest.clear();
}
