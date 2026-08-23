import type {
  AgentProposalRequest,
  AgentTrainingContext,
} from "./agent-bridge-store.ts";

const SECTION_IDS = new Set([
  "recommend",
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
]);
const SOURCES = new Set(["chatgpt", "openclaw"]);
const EQUIPMENT_IDS = [
  "dumbbells",
  "barbell",
  "flat-bench",
  "adjustable-bench",
  "rack",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  );
}

function isBoundedString(value: unknown, maximumLength: number) {
  return (
    typeof value === "string" && value.length > 0 && value.length <= maximumLength
  );
}

function isIsoDate(value: unknown) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function hasValidEquipment(value: unknown) {
  return (
    isRecord(value) &&
    hasExactKeys(value, EQUIPMENT_IDS) &&
    EQUIPMENT_IDS.every((equipmentId) => typeof value[equipmentId] === "boolean")
  );
}

export function isAgentTrainingContext(
  value: unknown,
): value is AgentTrainingContext {
  if (
    !isRecord(value) ||
    !hasExactKeys(value, ["syncedAt", "profile", "activeSession", "history"]) ||
    !isIsoDate(value.syncedAt)
  ) {
    return false;
  }
  if (
    !isRecord(value.profile) ||
    !hasExactKeys(value.profile, ["equipment"]) ||
    !hasValidEquipment(value.profile.equipment)
  ) {
    return false;
  }

  const activeSession = value.activeSession;
  if (
    activeSession !== null &&
    (!isRecord(activeSession) ||
      !hasExactKeys(activeSession, ["id", "workoutName", "startedAt"]) ||
      !isBoundedString(activeSession.id, 160) ||
      !isBoundedString(activeSession.workoutName, 120) ||
      !isIsoDate(activeSession.startedAt))
  ) {
    return false;
  }

  return (
    Array.isArray(value.history) &&
    value.history.length <= 100 &&
    value.history.every(
      (entry) =>
        isRecord(entry) &&
        hasExactKeys(entry, ["id", "completedAt", "sectionId"]) &&
        isBoundedString(entry.id, 160) &&
        isIsoDate(entry.completedAt) &&
        typeof entry.sectionId === "string" &&
        SECTION_IDS.has(entry.sectionId) &&
        entry.sectionId !== "recommend",
    )
  );
}

export function isAgentProposalRequest(
  value: unknown,
): value is AgentProposalRequest {
  return (
    isRecord(value) &&
    hasExactKeys(value, ["requestId", "preferredSection", "source"]) &&
    typeof value.requestId === "string" &&
    /^[a-zA-Z0-9._:-]{3,80}$/.test(value.requestId) &&
    typeof value.preferredSection === "string" &&
    SECTION_IDS.has(value.preferredSection) &&
    typeof value.source === "string" &&
    SOURCES.has(value.source)
  );
}

export function isAgentSuggestionRequest(
  value: unknown,
): value is Pick<AgentProposalRequest, "preferredSection" | "source"> {
  return (
    isRecord(value) &&
    hasExactKeys(value, ["preferredSection", "source"]) &&
    typeof value.preferredSection === "string" &&
    SECTION_IDS.has(value.preferredSection) &&
    typeof value.source === "string" &&
    SOURCES.has(value.source)
  );
}

export function isAgentProposalDecision(
  value: unknown,
): value is { proposalId: string; decision: "accepted" | "rejected" } {
  return (
    isRecord(value) &&
    hasExactKeys(value, ["proposalId", "decision"]) &&
    typeof value.proposalId === "string" &&
    value.proposalId.length <= 160 &&
    (value.decision === "accepted" || value.decision === "rejected")
  );
}

export function agentBridgeIsEnabled(
  environment: {
    NODE_ENV?: string;
    ENTRENA_CASA_AGENT_BRIDGE?: string;
  } = process.env,
) {
  return (
    environment.NODE_ENV === "development" &&
    environment.ENTRENA_CASA_AGENT_BRIDGE !== "disabled"
  );
}
