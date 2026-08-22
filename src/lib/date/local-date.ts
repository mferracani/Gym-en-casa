import type { LocalDate, Weekday } from "../../domain/training/types.ts";

function toLocalDate(year: number, month: number, day: number): LocalDate {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function localDateFromDate(date: Date): LocalDate {
  return toLocalDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function parseLocalDate(value: LocalDate): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    throw new Error("La fecha local debe usar el formato YYYY-MM-DD.");
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);

  if (localDateFromDate(date) !== value) {
    throw new Error("La fecha local no es válida.");
  }

  return date;
}

export function addLocalDays(value: LocalDate, amount: number): LocalDate {
  const date = parseLocalDate(value);
  date.setDate(date.getDate() + amount);
  return localDateFromDate(date);
}

export function getMonday(value: LocalDate): LocalDate {
  const date = parseLocalDate(value);
  const mondayOffset = (date.getDay() + 6) % 7;
  return addLocalDays(value, -mondayOffset);
}

export function weekdayForLocalDate(value: LocalDate): Weekday {
  const day = parseLocalDate(value).getDay();
  return (day === 0 ? 7 : day) as Weekday;
}
