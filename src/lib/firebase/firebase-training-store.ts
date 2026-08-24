import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import type { CloudTrainingSnapshot } from "../../domain/training/cloud-sync.ts";
import type { AppState } from "../../domain/training/types.ts";
import {
  createCloudStateDocument,
  parseCloudTrainingSnapshot,
} from "./cloud-state.ts";
import type { FirebaseClient } from "./firebase-client.ts";

const MAX_BATCH_SESSIONS = 400;

export interface FirebasePullResult {
  snapshot: CloudTrainingSnapshot | null;
  sessionIds: Set<string>;
}

function stateReference(client: FirebaseClient, userId: string) {
  return doc(client.db, "users", userId, "state", "current");
}

function sessionsReference(client: FirebaseClient, userId: string) {
  return collection(client.db, "users", userId, "sessions");
}

export async function pullFirebaseTrainingState(
  client: FirebaseClient,
  userId: string,
): Promise<FirebasePullResult> {
  const [stateSnapshot, historySnapshot] = await Promise.all([
    getDoc(stateReference(client, userId)),
    getDocs(sessionsReference(client, userId)),
  ]);
  const sessionIds = new Set(historySnapshot.docs.map((item) => item.id));

  if (!stateSnapshot.exists()) {
    return { snapshot: null, sessionIds };
  }

  const snapshot = parseCloudTrainingSnapshot(
    stateSnapshot.data(),
    historySnapshot.docs.map((item) => item.data()),
  );

  if (!snapshot) {
    throw new Error("La copia de Firebase tiene un formato incompatible.");
  }

  return { snapshot, sessionIds };
}

export async function pushFirebaseTrainingState(
  client: FirebaseClient,
  userId: string,
  state: AppState,
  knownSessionIds: ReadonlySet<string>,
): Promise<{ syncedAt: string; sessionIds: Set<string> }> {
  const syncedAt = new Date().toISOString();
  const nextSessionIds = new Set(knownSessionIds);

  const missingSessions = state.history.filter(
    (session) => !nextSessionIds.has(session.id),
  );

  for (let index = 0; index < missingSessions.length; index += MAX_BATCH_SESSIONS) {
    const batch = writeBatch(client.db);
    const sessions = missingSessions.slice(index, index + MAX_BATCH_SESSIONS);

    for (const session of sessions) {
      batch.set(doc(sessionsReference(client, userId), session.id), session);
      nextSessionIds.add(session.id);
    }

    await batch.commit();
  }

  await setDoc(
    stateReference(client, userId),
    createCloudStateDocument(state, syncedAt),
  );

  return { syncedAt, sessionIds: nextSessionIds };
}
