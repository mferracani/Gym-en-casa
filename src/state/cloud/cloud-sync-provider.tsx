"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { mergeTrainingSnapshots } from "../../domain/training/cloud-sync.ts";
import { getFirebaseClient } from "../../lib/firebase/firebase-client.ts";
import {
  pullFirebaseTrainingState,
  pushFirebaseTrainingState,
} from "../../lib/firebase/firebase-training-store.ts";
import { useTraining } from "../training/use-training.ts";

export type CloudSyncStatus =
  | "unconfigured"
  | "checking"
  | "signed-out"
  | "connecting"
  | "syncing"
  | "synced"
  | "error";

export interface CloudUserSummary {
  displayName: string | null;
  email: string | null;
}

export interface CloudSyncContextValue {
  isConfigured: boolean;
  status: CloudSyncStatus;
  user: CloudUserSummary | null;
  lastSyncedAt: string | null;
  errorMessage: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<boolean>;
  syncNow: () => Promise<void>;
}

export const CloudSyncContext = createContext<CloudSyncContextValue | null>(null);

function readableFirebaseError(error: unknown): string {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String(error.code);

    if (code === "auth/unauthorized-domain") {
      return "Este dominio todavía no está autorizado en Firebase Authentication.";
    }

    if (code === "auth/network-request-failed") {
      return "No pudimos abrir Google. Revisá tu conexión e intentá de nuevo.";
    }

    if (code === "auth/popup-blocked") {
      return "El navegador bloqueó la ventana de Google. Permití las ventanas emergentes e intentá de nuevo.";
    }

    if (code === "auth/popup-closed-by-user") {
      return "Cerraste el acceso con Google antes de terminar.";
    }

    if (code === "auth/operation-not-allowed") {
      return "El acceso con Google todavía no está habilitado en Firebase.";
    }

    if (code === "permission-denied" || code === "firestore/permission-denied") {
      return "Firebase rechazó el acceso. Revisá las reglas de seguridad del proyecto.";
    }
  }

  return error instanceof Error
    ? error.message
    : "No pudimos sincronizar con Firebase.";
}

export function CloudSyncProvider({ children }: { children: ReactNode }) {
  const training = useTraining();
  const {
    isHydrated,
    localSnapshot,
    replaceStateFromCloud,
    state: trainingState,
  } = training;
  const client = useMemo(() => getFirebaseClient(), []);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [status, setStatus] = useState<CloudSyncStatus>(
    client ? "checking" : "unconfigured",
  );
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryNonce, setRetryNonce] = useState(0);
  const snapshotRef = useRef(localSnapshot);
  const knownSessionIdsRef = useRef(new Set<string>());
  const initializedUserRef = useRef<string | null>(null);
  const initialSyncReadyRef = useRef(false);
  const pushInFlightRef = useRef(false);
  const pushQueuedRef = useRef(false);

  useEffect(() => {
    snapshotRef.current = localSnapshot;
  }, [localSnapshot]);

  useEffect(() => {
    if (!client) return;

    return onAuthStateChanged(client.auth, (nextUser) => {
      setFirebaseUser(nextUser);
      setErrorMessage(null);

      if (!nextUser) {
        initializedUserRef.current = null;
        initialSyncReadyRef.current = false;
        knownSessionIdsRef.current = new Set();
        setLastSyncedAt(null);
        setStatus("signed-out");
      } else {
        setStatus("checking");
      }
    });
  }, [client]);

  const pushLatestState = useCallback(async (): Promise<boolean> => {
    if (!client || !firebaseUser || !initialSyncReadyRef.current) return false;

    if (pushInFlightRef.current) {
      pushQueuedRef.current = true;
      return true;
    }

    pushInFlightRef.current = true;

    try {
      do {
        pushQueuedRef.current = false;
        setStatus("syncing");
        setErrorMessage(null);

        const result = await pushFirebaseTrainingState(
          client,
          firebaseUser.uid,
          snapshotRef.current.state,
          knownSessionIdsRef.current,
        );

        knownSessionIdsRef.current = result.sessionIds;
        setLastSyncedAt(result.syncedAt);
      } while (pushQueuedRef.current);

      setStatus("synced");
      return true;
    } catch (error) {
      setErrorMessage(readableFirebaseError(error));
      setStatus("error");
      return false;
    } finally {
      pushInFlightRef.current = false;
    }
  }, [client, firebaseUser]);

  useEffect(() => {
    if (
      !client ||
      !firebaseUser ||
      !isHydrated ||
      initializedUserRef.current === firebaseUser.uid
    ) {
      return;
    }

    initializedUserRef.current = firebaseUser.uid;
    initialSyncReadyRef.current = false;
    const activeClient = client;
    const activeUser = firebaseUser;
    let cancelled = false;

    async function initializeCloudState() {
      try {
        setStatus("syncing");
        setErrorMessage(null);

        const pulled = await pullFirebaseTrainingState(
          activeClient,
          activeUser.uid,
        );
        if (cancelled) return;

        knownSessionIdsRef.current = pulled.sessionIds;
        const localSnapshot = snapshotRef.current;
        const mergedState = pulled.snapshot
          ? mergeTrainingSnapshots(localSnapshot, pulled.snapshot)
          : localSnapshot.state;

        if (pulled.snapshot) {
          replaceStateFromCloud(mergedState);
          snapshotRef.current = {
            state: mergedState,
            source: "stored",
            updatedAt: new Date().toISOString(),
          };
        }

        initialSyncReadyRef.current = true;
        const synced = await pushLatestState();
        if (cancelled) return;

        if (!synced) {
          initializedUserRef.current = null;
          initialSyncReadyRef.current = false;
        }
      } catch (error) {
        if (cancelled) return;
        initializedUserRef.current = null;
        setErrorMessage(readableFirebaseError(error));
        setStatus("error");
      }
    }

    void initializeCloudState();

    return () => {
      cancelled = true;
    };
  }, [
    client,
    firebaseUser,
    retryNonce,
    isHydrated,
    pushLatestState,
    replaceStateFromCloud,
  ]);

  useEffect(() => {
    if (!firebaseUser) return;

    function handleOnline() {
      if (initialSyncReadyRef.current) {
        void pushLatestState();
      } else {
        initializedUserRef.current = null;
        setRetryNonce((current) => current + 1);
      }
    }

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [firebaseUser, pushLatestState]);

  useEffect(() => {
    if (!firebaseUser || !initialSyncReadyRef.current || !isHydrated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void pushLatestState();
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [firebaseUser, isHydrated, pushLatestState, trainingState]);

  const connect = useCallback(async () => {
    if (!client) return;

    try {
      setStatus("connecting");
      setErrorMessage(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(client.auth, provider);
    } catch (error) {
      setErrorMessage(readableFirebaseError(error));
      setStatus("error");
    }
  }, [client]);

  const disconnect = useCallback(async (): Promise<boolean> => {
    if (!client) return true;

    initialSyncReadyRef.current = false;
    initializedUserRef.current = null;

    try {
      await signOut(client.auth);
      return true;
    } catch (error) {
      initialSyncReadyRef.current = Boolean(firebaseUser);
      setErrorMessage(readableFirebaseError(error));
      setStatus("error");
      return false;
    }
  }, [client, firebaseUser]);

  const syncNow = useCallback(async () => {
    if (firebaseUser && !initialSyncReadyRef.current) {
      initializedUserRef.current = null;
      setRetryNonce((current) => current + 1);
      return;
    }

    await pushLatestState();
  }, [firebaseUser, pushLatestState]);

  const value = useMemo<CloudSyncContextValue>(
    () => ({
      isConfigured: Boolean(client),
      status,
      user: firebaseUser
        ? {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
          }
        : null,
      lastSyncedAt,
      errorMessage,
      connect,
      disconnect,
      syncNow,
    }),
    [
      client,
      connect,
      disconnect,
      errorMessage,
      firebaseUser,
      lastSyncedAt,
      syncNow,
      status,
    ],
  );

  return (
    <CloudSyncContext.Provider value={value}>
      {children}
    </CloudSyncContext.Provider>
  );
}
