export interface FirebaseClientConfig {
  apiKey: string;
  appId: string;
  authDomain: string;
  projectId: string;
}

type FirebaseConfigKey = keyof FirebaseClientConfig;

export type FirebaseClientConfigResult =
  | { status: "ready"; config: FirebaseClientConfig }
  | { status: "missing"; missing: FirebaseConfigKey[] };

const configKeys: FirebaseConfigKey[] = [
  "apiKey",
  "appId",
  "authDomain",
  "projectId",
];

export function parseFirebaseClientConfig(
  values: Partial<Record<FirebaseConfigKey, string | undefined>>,
): FirebaseClientConfigResult {
  const normalized = Object.fromEntries(
    configKeys.map((key) => [key, values[key]?.trim() ?? ""]),
  ) as Record<FirebaseConfigKey, string>;
  const missing = configKeys.filter((key) => normalized[key].length === 0);

  return missing.length > 0
    ? { status: "missing", missing }
    : { status: "ready", config: normalized };
}

export const firebaseClientConfig = parseFirebaseClientConfig({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
