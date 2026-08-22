import { PersonArmsSpread } from "@phosphor-icons/react";

import type { MuscleSummary as MuscleSummaryType } from "@/types/training";

interface MuscleSummaryProps {
  muscles: MuscleSummaryType[];
}

export function MuscleSummary({ muscles }: MuscleSummaryProps) {
  return (
    <aside aria-labelledby="muscle-summary-title" className="muscle-summary">
      <div className="muscle-summary__visual" aria-hidden="true">
        <span className="muscle-summary__index">02</span>
        <PersonArmsSpread size={116} weight="thin" />
        <span className="muscle-summary__pending">Recurso visual pendiente</span>
      </div>

      <div className="muscle-summary__content">
        <p className="muscle-summary__eyebrow">Resumen muscular</p>
        <h3 id="muscle-summary-title">Lo que vas a trabajar</h3>

        <dl className="muscle-list">
          {muscles.map((muscle) => (
            <div className="muscle-list__item" key={muscle.name}>
              <span
                aria-hidden="true"
                className={`muscle-list__marker muscle-list__marker--${muscle.role}`}
              />
              <div>
                <dt>{muscle.name}</dt>
                <dd>
                  {muscle.role} · {muscle.series} series
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
