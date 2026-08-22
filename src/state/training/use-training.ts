"use client";

import { useContext } from "react";

import { TrainingContext } from "./training-provider";

export function useTraining() {
  const context = useContext(TrainingContext);

  if (!context) {
    throw new Error("useTraining debe usarse dentro de TrainingProvider.");
  }

  return context;
}
