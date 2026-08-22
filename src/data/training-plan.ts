import type {
  NavigationItem,
  TrainingPlan,
  WeekDay,
} from "@/types/training";

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

export const weekPlan = [
  {
    id: "monday",
    shortLabel: "L",
    dayName: "Lunes",
    date: 17,
    status: "completed",
    activity: "Fuerza completada",
  },
  {
    id: "tuesday",
    shortLabel: "M",
    dayName: "Martes",
    date: 18,
    status: "completed",
    activity: "Fuerza completada",
  },
  {
    id: "wednesday",
    shortLabel: "X",
    dayName: "Miércoles",
    date: 19,
    status: "recovery",
    activity: "Movilidad completada",
  },
  {
    id: "thursday",
    shortLabel: "J",
    dayName: "Jueves",
    date: 20,
    status: "completed",
    activity: "Fuerza completada",
  },
  {
    id: "friday",
    shortLabel: "V",
    dayName: "Viernes",
    date: 21,
    status: "completed",
    activity: "Fuerza completada",
  },
  {
    id: "saturday",
    shortLabel: "S",
    dayName: "Sábado",
    date: 22,
    status: "today",
    activity: "Pecho y bíceps · Hoy",
  },
  {
    id: "sunday",
    shortLabel: "D",
    dayName: "Domingo",
    date: 23,
    status: "rest",
    activity: "Descanso",
  },
] satisfies WeekDay[];

export const navigationItems = [
  { id: "today", label: "Hoy", href: "#today", icon: "home", available: true },
  {
    id: "week",
    label: "Semana",
    href: "#week",
    icon: "calendar",
    available: false,
  },
  {
    id: "progress",
    label: "Progreso",
    href: "#progress",
    icon: "progress",
    available: false,
  },
  {
    id: "profile",
    label: "Perfil",
    href: "#profile",
    icon: "profile",
    available: false,
  },
] satisfies NavigationItem[];
