export type DayStatus = "completed" | "recovery" | "today" | "rest";

export type MuscleRole = "principal" | "secundario";

export type NavigationIcon = "home" | "calendar" | "progress" | "profile";

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  repetitions: number;
  equipment: string;
}

export interface MuscleSummary {
  name: string;
  role: MuscleRole;
  series: number;
}

export interface TrainingPlan {
  dateLabel: string;
  greeting: string;
  name: string;
  durationMinutes: number;
  phase: string;
  scheme: {
    sets: number;
    repetitions: number;
  };
  exercises: Exercise[];
  muscles: MuscleSummary[];
  adaptationNotice: string;
  safetyNotice: string;
  equipment: {
    hasRack: boolean;
  };
}

export interface WeekDay {
  id: string;
  shortLabel: string;
  dayName: string;
  date: number;
  status: DayStatus;
  activity: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: NavigationIcon;
  available: boolean;
}
