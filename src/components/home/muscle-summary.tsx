import Image from "next/image";

import { muscleMapVisualsBySection } from "@/data/exercise-visuals";
import type { ExerciseSectionId } from "@/domain/training/types";
import type { MuscleSummary as MuscleSummaryType } from "@/types/training";

interface MuscleSummaryProps {
  muscles: MuscleSummaryType[];
  sectionId: ExerciseSectionId;
}

export function MuscleSummary({ muscles, sectionId }: MuscleSummaryProps) {
  const muscleMapVisual = muscleMapVisualsBySection[sectionId];

  return (
    <aside aria-labelledby="muscle-summary-title" className="muscle-summary">
      <div className="muscle-summary__visual">
        <span aria-hidden="true" className="muscle-summary__index">02</span>
        <Image
          alt={muscleMapVisual.alt}
          className="muscle-summary__image"
          height={muscleMapVisual.height}
          loading="eager"
          sizes="(min-width: 720px) 280px, 42vw"
          src={muscleMapVisual.src}
          width={muscleMapVisual.width}
        />
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
