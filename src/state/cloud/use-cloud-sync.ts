"use client";

import { useContext } from "react";

import { CloudSyncContext } from "./cloud-sync-provider.tsx";

export function useCloudSync() {
  const context = useContext(CloudSyncContext);

  if (!context) {
    throw new Error("useCloudSync debe usarse dentro de CloudSyncProvider.");
  }

  return context;
}
