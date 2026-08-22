import { Check } from "@phosphor-icons/react/Check";

import type { WeekDay } from "@/types/training";

interface WeekStripProps {
  days: WeekDay[];
}

export function WeekStrip({ days }: WeekStripProps) {
  return (
    <section aria-labelledby="week-title" className="week-strip" id="week">
      <div className="section-heading-row">
        <h2 id="week-title">Tu semana</h2>
        <span>Plan local</span>
      </div>

      <ol aria-label="Estado semanal de lunes a domingo" className="week-grid">
        {days.map((day) => (
          <li
            aria-current={day.status === "today" ? "date" : undefined}
            className={`week-day week-day--${day.status}`}
            key={day.id}
            title={`${day.dayName} ${day.date}: ${day.activity}`}
          >
            <span className="week-day__label">{day.shortLabel}</span>
            <span className="week-day__date">
              {day.status === "completed" ? (
                <Check aria-hidden="true" size={12} weight="bold" />
              ) : null}
              <span>{day.date}</span>
            </span>
            <span className="week-day__status" aria-hidden="true" />
            <span className="sr-only">{day.activity}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
