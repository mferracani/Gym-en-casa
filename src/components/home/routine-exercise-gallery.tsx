import Image from "next/image";

import {
  exerciseCatalog,
  workoutTemplates,
} from "@/data/training-catalog";
import { getExerciseVisual } from "@/data/exercise-visuals";

interface RoutineExerciseGalleryProps {
  templateId: string;
}

export function RoutineExerciseGallery({ templateId }: RoutineExerciseGalleryProps) {
  const template = workoutTemplates.find((item) => item.id === templateId);

  if (!template) return null;

  const exercises = template.exercises.flatMap((plannedExercise) => {
    const exercise = exerciseCatalog.find(
      (item) => item.id === plannedExercise.exerciseId,
    );
    const visual = getExerciseVisual(plannedExercise.exerciseId);

    return exercise && visual ? [{ ...plannedExercise, exercise, visual }] : [];
  });

  if (exercises.length !== template.exercises.length) return null;

  return (
    <section
      aria-labelledby="routine-exercise-gallery-title"
      className="routine-exercise-gallery"
    >
      <div className="routine-exercise-gallery__heading">
        <p className="eyebrow">Rutina de hoy</p>
        <h2 id="routine-exercise-gallery-title">Tus ejercicios</h2>
        <p>{exercises.length} ejercicios · Seguí este orden</p>
      </div>

      <ol className="routine-exercise-gallery__list">
        {exercises.map(({ exercise, targetReps, targetSets, visual }, index) => (
          <li className="routine-exercise-gallery__item" key={exercise.id}>
            <div className="routine-exercise-gallery__thumbnail">
              <Image
                alt={visual.alt}
                className="routine-exercise-gallery__image"
                height={visual.height}
                sizes="(min-width: 720px) 112px, 96px"
                src={visual.src}
                width={visual.width}
              />
            </div>

            <div className="routine-exercise-gallery__copy">
              <p aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
              <h3>{exercise.name}</h3>
              <span>
                {targetSets} × {targetReps}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
