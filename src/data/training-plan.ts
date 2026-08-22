import type { TrainingPlan } from "@/types/training";

export const todayPlan = {
  dateLabel: "Sábado 22 de agosto",
  greeting: "Buen día, Mati",
  name: "Pecho + bíceps",
  durationMinutes: 60,
  phase: "Semana 1 · Adaptación",
  scheme: {
    sets: 3,
    repetitions: 10,
  },
  exercises: [
    {
      id: "dumbbell-flat-press",
      name: "Press plano con mancuernas",
      sets: 3,
      repetitions: 10,
      equipment: "Banco plano · Mancuernas",
    },
    {
      id: "dumbbell-incline-press",
      name: "Press inclinado con mancuernas",
      sets: 3,
      repetitions: 10,
      equipment: "Banco a 30° · Mancuernas",
    },
    {
      id: "dumbbell-fly",
      name: "Aperturas con mancuernas",
      sets: 3,
      repetitions: 10,
      equipment: "Banco plano · Mancuernas",
    },
    {
      id: "barbell-curl",
      name: "Curl de bíceps con barra",
      sets: 3,
      repetitions: 10,
      equipment: "Barra con discos",
    },
    {
      id: "hammer-curl",
      name: "Curl martillo",
      sets: 3,
      repetitions: 10,
      equipment: "Mancuernas",
    },
  ],
  muscles: [
    { name: "Pecho", role: "principal", series: 9 },
    { name: "Bíceps", role: "secundario", series: 6 },
  ],
  adaptationNotice: "Empezá liviano · Dejá 3 repeticiones en reserva",
  safetyNotice:
    "Sin rack: el press con barra queda fuera de la rutina. Usá mancuernas.",
  equipment: {
    hasRack: false,
  },
} satisfies TrainingPlan;
