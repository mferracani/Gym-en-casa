import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

import { firebaseClientConfig } from "./client-config.ts";

export interface FirebaseClient {
  auth: Auth;
  db: Firestore;
}

let cachedClient: FirebaseClient | null | undefined;

export function getFirebaseClient(): FirebaseClient | null {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  if (firebaseClientConfig.status !== "ready") {
    cachedClient = null;
    return cachedClient;
  }

  const app = getApps().length > 0
    ? getApp()
    : initializeApp(firebaseClientConfig.config);

  cachedClient = {
    auth: getAuth(app),
    db: getFirestore(app),
  };

  return cachedClient;
}
