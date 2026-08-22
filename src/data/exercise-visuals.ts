import type { ExerciseSectionId } from "@/domain/training/types";

export interface ExerciseVisual {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export const exerciseVisualsById: Record<string, ExerciseVisual> = {
  "dumbbell-flat-press": {
    src: "/images/exercises/dumbbell-flat-press.webp",
    alt: "Posiciones baja y alta del press plano con mancuernas, con el pecho resaltado",
    width: 1586,
    height: 992,
  },
  "dumbbell-incline-press": {
    src: "/images/exercises/dumbbell-incline-press.webp",
    alt: "Posiciones baja y alta del press con mancuernas sobre banco inclinado a 30 grados",
    width: 1534,
    height: 1025,
  },
  "dumbbell-fly": {
    src: "/images/exercises/dumbbell-fly.webp",
    alt: "Posiciones abierta y cerrada de las aperturas con mancuernas, con el pecho resaltado",
    width: 1586,
    height: 992,
  },
  "incline-dumbbell-fly-press": {
    src: "/images/exercises/incline-dumbbell-fly-press.webp",
    alt: "Apertura y press con mancuernas sobre banco inclinado, con el pecho resaltado",
    width: 1536,
    height: 1024,
  },
  "dumbbell-floor-press": {
    src: "/images/exercises/dumbbell-floor-press.webp",
    alt: "Posiciones baja y alta del press con mancuernas acostado en el piso",
    width: 1536,
    height: 1024,
  },
  "decline-dumbbell-floor-press": {
    src: "/images/exercises/decline-dumbbell-floor-press.webp",
    alt: "Press con mancuernas y cadera elevada, con los pies apoyados en un banco estable",
    width: 1536,
    height: 1024,
  },
  "dumbbell-floor-fly": {
    src: "/images/exercises/dumbbell-floor-fly.webp",
    alt: "Posiciones abierta y cerrada de las aperturas con mancuernas acostado en el piso",
    width: 1536,
    height: 1024,
  },
  "dumbbell-handle-push-up": {
    src: "/images/exercises/dumbbell-handle-push-up.webp",
    alt: "Posiciones alta y baja de una flexión simétrica sobre dos mancuernas hexagonales",
    width: 1536,
    height: 1024,
  },
  "dumbbell-pullover-to-press": {
    src: "/images/exercises/dumbbell-pullover-to-press.webp",
    alt: "Posición de pullover detrás de la cabeza y final del press con mancuernas en el piso",
    width: 1536,
    height: 1024,
  },
  "close-grip-dumbbell-floor-press": {
    src: "/images/exercises/close-grip-dumbbell-floor-press.webp",
    alt: "Posiciones baja y alta del press cerrado con dos mancuernas juntas en el piso",
    width: 1536,
    height: 1024,
  },
  "staggered-dumbbell-push-up": {
    src: "/images/exercises/staggered-dumbbell-push-up.webp",
    alt: "Flexión escalonada con una mano sobre una mancuerna hexagonal y la otra en el piso",
    width: 1536,
    height: 1024,
  },
  "barbell-curl": {
    src: "/images/exercises/barbell-curl.webp",
    alt: "Posiciones baja y flexionada del curl con barra, con los bíceps resaltados",
    width: 1586,
    height: 992,
  },
  "hammer-curl": {
    src: "/images/exercises/hammer-curl.webp",
    alt: "Posiciones baja y flexionada del curl martillo con agarre neutro",
    width: 1586,
    height: 992,
  },
  "seated-alternating-dumbbell-curl": {
    src: "/images/exercises/seated-alternating-dumbbell-curl-v2.webp",
    alt: "Inicio con ambos brazos bajos y final del curl alternado sentado con un brazo flexionado",
    width: 1536,
    height: 1024,
  },
  "incline-dumbbell-curl": {
    src: "/images/exercises/incline-dumbbell-curl.webp",
    alt: "Inicio y final del curl con mancuernas apoyado en banco inclinado",
    width: 1536,
    height: 1024,
  },
  "concentration-curl": {
    src: "/images/exercises/concentration-curl.webp",
    alt: "Inicio y final del curl de concentración con el codo apoyado en el muslo",
    width: 1536,
    height: 1024,
  },
  "one-arm-dumbbell-row": {
    src: "/images/exercises/one-arm-dumbbell-row.webp",
    alt: "Inicio y final del remo a una mano con apoyo de mano y rodilla en banco",
    width: 1536,
    height: 1024,
  },
  "chest-supported-dumbbell-row": {
    src: "/images/exercises/chest-supported-dumbbell-row.webp",
    alt: "Inicio y final del remo con pecho apoyado en banco inclinado",
    width: 1536,
    height: 1024,
  },
  "lying-dumbbell-triceps-extension": {
    src: "/images/exercises/lying-dumbbell-triceps-extension.webp",
    alt: "Inicio y final de la extensión de tríceps acostado con mancuernas",
    width: 1536,
    height: 1024,
  },
  "seated-overhead-dumbbell-triceps-extension": {
    src: "/images/exercises/seated-overhead-dumbbell-triceps-extension.webp",
    alt: "Inicio y final de la extensión de tríceps sobre la cabeza sentado",
    width: 1536,
    height: 1024,
  },
  "bench-supported-triceps-kickback": {
    src: "/images/exercises/bench-supported-triceps-kickback.webp",
    alt: "Inicio y final de la patada de tríceps con apoyo en banco",
    width: 1536,
    height: 1024,
  },
  "seated-dumbbell-shoulder-press": {
    src: "/images/exercises/seated-dumbbell-shoulder-press.webp",
    alt: "Inicio a la altura de los hombros y final arriba del press sentado con mancuernas",
    width: 1536,
    height: 1024,
  },
  "dumbbell-scaption": {
    src: "/images/exercises/dumbbell-scaption.webp",
    alt: "Inicio y final de la elevación con mancuernas en el plano escapular",
    width: 1536,
    height: 1024,
  },
  "suitcase-carry": {
    src: "/images/exercises/suitcase-carry.webp",
    alt: "Postura de la caminata con una mancuerna a un lado y el core resaltado",
    width: 1536,
    height: 1024,
  },
  "incline-plank-dumbbell-drag": {
    src: "/images/exercises/incline-plank-dumbbell-drag.webp",
    alt: "Dos posiciones de la plancha inclinada con arrastre de mancuerna",
    width: 1536,
    height: 1024,
  },
  "weighted-bench-crunch": {
    src: "/images/exercises/weighted-bench-crunch.webp",
    alt: "Inicio y final del crunch corto en banco con mancuerna liviana",
    width: 1536,
    height: 1024,
  },
  "dumbbell-dead-bug": {
    src: "/images/exercises/dumbbell-dead-bug.webp",
    alt: "Inicio y extensión alternada del dead bug con una mancuerna sostenida",
    width: 1536,
    height: 1024,
  },
  "bent-over-dumbbell-rear-delt-fly": {
    src: "/images/exercises/bent-over-dumbbell-rear-delt-fly.webp",
    alt: "Inicio y apertura del reverse fly de pie con deltoides posteriores resaltados",
    width: 1536,
    height: 1024,
  },
  "standing-double-dumbbell-front-raise": {
    src: "/images/exercises/standing-double-dumbbell-front-raise.webp",
    alt: "Inicio y final de la elevación frontal de pie con dos mancuernas",
    width: 1536,
    height: 1024,
  },
  "standing-dumbbell-lateral-raise": {
    src: "/images/exercises/standing-dumbbell-lateral-raise.webp",
    alt: "Inicio y final de la elevación lateral de pie con dos mancuernas",
    width: 1536,
    height: 1024,
  },
  "dumbbell-upright-row": {
    src: "/images/exercises/dumbbell-upright-row.webp",
    alt: "Inicio y final controlado del remo vertical con mancuernas",
    width: 1536,
    height: 1024,
  },
  "alternating-dumbbell-front-raise": {
    src: "/images/exercises/alternating-dumbbell-front-raise.webp",
    alt: "Inicio y final alternado de la elevación frontal con un brazo arriba",
    width: 1536,
    height: 1024,
  },
  "alternating-dumbbell-shoulder-press": {
    src: "/images/exercises/alternating-dumbbell-shoulder-press.webp",
    alt: "Inicio bilateral y final unilateral del press de hombros alternado",
    width: 1536,
    height: 1024,
  },
  "two-hand-dumbbell-front-raise": {
    src: "/images/exercises/two-hand-dumbbell-front-raise.webp",
    alt: "Inicio y final de la elevación frontal sosteniendo una mancuerna con ambas manos",
    width: 1536,
    height: 1024,
  },
  "seated-dumbbell-lateral-raise": {
    src: "/images/exercises/seated-dumbbell-lateral-raise.webp",
    alt: "Inicio y final de la elevación lateral sentado en banco plano",
    width: 1536,
    height: 1024,
  },
  "incline-bench-dumbbell-front-raise": {
    src: "/images/exercises/incline-bench-dumbbell-front-raise.webp",
    alt: "Inicio y final de la elevación frontal con espalda apoyada en banco inclinado",
    width: 1536,
    height: 1024,
  },
  "incline-bench-reverse-fly": {
    src: "/images/exercises/incline-bench-reverse-fly.webp",
    alt: "Inicio y apertura del reverse fly con pecho apoyado en banco inclinado",
    width: 1536,
    height: 1024,
  },
  "bench-supported-rear-delt-row": {
    src: "/images/exercises/bench-supported-rear-delt-row.webp",
    alt: "Inicio y final del remo unilateral con codo abierto para deltoide posterior",
    width: 1536,
    height: 1024,
  },
  "incline-side-lying-dumbbell-lateral-raise": {
    src: "/images/exercises/incline-side-lying-dumbbell-lateral-raise.webp",
    alt: "Inicio y final de la elevación lateral recostado de lado en banco inclinado",
    width: 1536,
    height: 1024,
  },
  "seated-arnold-press": {
    src: "/images/exercises/seated-arnold-press.webp",
    alt: "Inicio con palmas hacia el rostro y final arriba del press Arnold sentado",
    width: 1536,
    height: 1024,
  },
  "seated-double-dumbbell-front-raise": {
    src: "/images/exercises/seated-double-dumbbell-front-raise.webp",
    alt: "Inicio y final de la elevación frontal doble sentado en banco plano",
    width: 1536,
    height: 1024,
  },
};

export function getExerciseVisual(exerciseId: string): ExerciseVisual | undefined {
  return exerciseVisualsById[exerciseId];
}

export const muscleMapVisualsBySection: Record<
  ExerciseSectionId,
  ExerciseVisual
> = {
  "chest-biceps": {
    src: "/images/exercises/chest-biceps-muscle-map.webp",
    alt: "Vista frontal y posterior con pecho y bíceps resaltados",
    width: 1024,
    height: 1536,
  },
  "back-triceps": {
    src: "/images/exercises/back-triceps-muscle-map.webp",
    alt: "Vista frontal y posterior con espalda y tríceps resaltados",
    width: 1024,
    height: 1536,
  },
  shoulders: {
    src: "/images/exercises/shoulders-muscle-map.webp",
    alt: "Vista frontal y posterior con los deltoides resaltados",
    width: 1024,
    height: 1536,
  },
  abs: {
    src: "/images/exercises/abs-muscle-map.webp",
    alt: "Vista frontal y posterior con abdominales y oblicuos resaltados",
    width: 1024,
    height: 1536,
  },
};

export const chestBicepsMuscleMapVisual =
  muscleMapVisualsBySection["chest-biceps"];
