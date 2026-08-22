"use client";

import { Check } from "@phosphor-icons/react/Check";
import { PlayCircle } from "@phosphor-icons/react/PlayCircle";
import { Plus } from "@phosphor-icons/react/Plus";
import { ShieldWarning } from "@phosphor-icons/react/ShieldWarning";
import { Sparkle } from "@phosphor-icons/react/Sparkle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { getExerciseMovement } from "@/data/exercise-movements";
import { getExerciseVisual } from "@/data/exercise-visuals";
import {
  exerciseCatalog,
  workoutTemplates,
} from "@/data/training-catalog";
import type {
  EquipmentId,
  ExerciseDefinition,
  ExerciseSectionId,
} from "@/domain/training/types";
import {
  getMissingExerciseEquipment,
  isExerciseAvailable,
} from "@/domain/training/constraints";
import { useTraining } from "@/state/training/use-training";

import { ExerciseMovementModal } from "../session/exercise-movement-modal";
import styles from "./exercises-screen.module.css";

const sectionLabels: Record<ExerciseSectionId, string> = {
  "chest-biceps": "Pecho + bíceps",
  "back-triceps": "Espalda + tríceps",
  shoulders: "Hombros",
  abs: "Abdominales",
};

const sectionOrder: ExerciseSectionId[] = [
  "chest-biceps",
  "back-triceps",
  "shoulders",
  "abs",
];

const equipmentLabels: Record<EquipmentId, string> = {
  dumbbells: "Mancuernas",
  barbell: "Barra",
  "flat-bench": "Banco plano",
  "adjustable-bench": "Banco inclinado",
  rack: "Rack",
};

const hiddenLegacyExerciseIds = new Set([
  "barbell-bench-press",
  "barbell-curl",
]);

type SectionSelections = Record<ExerciseSectionId, string[]>;

function createSuggestedSelections(): SectionSelections {
  return Object.fromEntries(
    sectionOrder.map((sectionId) => [
      sectionId,
      workoutTemplates
        .find((template) => template.sectionId === sectionId)
        ?.exercises.map(({ exerciseId }) => exerciseId) ?? [],
    ]),
  ) as SectionSelections;
}

function compareExercises(left: ExerciseDefinition, right: ExerciseDefinition) {
  const leftMovement = getExerciseMovement(left.id);
  const rightMovement = getExerciseMovement(right.id);

  if (leftMovement && rightMovement) return leftMovement.order - rightMovement.order;
  if (leftMovement) return -1;
  if (rightMovement) return 1;
  return left.name.localeCompare(right.name, "es");
}

export function ExercisesScreen() {
  const router = useRouter();
  const { isHydrated, startWorkoutSelection, state } = useTraining();
  const shoulderTemplate = workoutTemplates.find(
    ({ id }) => id === "shoulders-video-adaptation",
  );
  const [activeSection, setActiveSection] = useState<ExerciseSectionId>("shoulders");
  const [selectedBySection, setSelectedBySection] = useState<SectionSelections>(
    createSuggestedSelections,
  );
  const [message, setMessage] = useState("");

  const exercisesBySection = useMemo(() => {
    return Object.fromEntries(
      sectionOrder.map((sectionId) => [
        sectionId,
        exerciseCatalog
          .filter(
            (exercise) =>
              exercise.sectionId === sectionId &&
              !hiddenLegacyExerciseIds.has(exercise.id),
          )
          .sort(compareExercises),
      ]),
    ) as Record<ExerciseSectionId, ExerciseDefinition[]>;
  }, []);

  const visibleExercises = exercisesBySection[activeSection];
  const selectedIds = selectedBySection[activeSection].filter((exerciseId) => {
    const exercise = exerciseCatalog.find(({ id }) => id === exerciseId);
    return exercise ? isExerciseAvailable(exercise, state.profile) : false;
  });
  const selectedSet = new Set(selectedIds);

  function toggleExercise(exerciseId: string) {
    setSelectedBySection((current) => {
      const sectionSelection = current[activeSection];

      return {
        ...current,
        [activeSection]: sectionSelection.includes(exerciseId)
          ? sectionSelection.filter((id) => id !== exerciseId)
          : [...sectionSelection, exerciseId],
      };
    });
    setMessage("");
  }

  function selectSuggestedShoulders() {
    setSelectedBySection((current) => ({
      ...current,
      shoulders:
        shoulderTemplate?.exercises
          .map(({ exerciseId }) => exerciseCatalog.find(({ id }) => id === exerciseId))
          .filter(
            (exercise): exercise is ExerciseDefinition =>
              exercise !== undefined &&
              isExerciseAvailable(exercise, state.profile),
          )
          .map(({ id }) => id) ?? [],
    }));
    setActiveSection("shoulders");
    setMessage("Cargamos una selección equilibrada de cuatro ejercicios.");
  }

  function startSelection() {
    const result = startWorkoutSelection(selectedIds);

    if (result.ok) {
      router.push("/entrenar");
      return;
    }

    setMessage(
      result.reason === "equipment"
        ? "Revisá el equipo de tu perfil o elegí otra selección."
        : result.reason === "invalid-selection"
          ? "La selección contiene un ejercicio que ya no está disponible."
          : "Todavía estamos preparando tu selección.",
    );
  }

  if (!isHydrated) {
    return (
      <main aria-busy="true" className={styles.page}>
        <p className={styles.eyebrow}>Biblioteca</p>
        <h1>Ejercicios</h1>
        <p className={styles.loading}>Preparando el catálogo guardado…</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Biblioteca editable</p>
          <h1>Elegí tu rutina</h1>
          <p>
            Usá la sugerencia o armá tu propia selección. La sesión usa la sección
            activa y respeta el orden en que agregás los ejercicios.
          </p>
        </div>

        <div className={styles.selectionCount} aria-live="polite">
          <strong>{selectedIds.length}</strong>
          <span>en esta sección</span>
        </div>
      </header>

      <section className={styles.videoNotice} aria-labelledby="video-notice-title">
        <PlayCircle aria-hidden="true" size={25} weight="fill" />
        <div>
          <p>Video analizado · 14 movimientos</p>
          <h2 id="video-notice-title">Todos están en Hombros con su tramo exacto</h2>
          <span>
            Son opciones, no una rutina de 42 series. La sugerencia inicial usa 4.
          </span>
        </div>
        <button onClick={selectSuggestedShoulders} type="button">
          <Sparkle aria-hidden="true" size={18} weight="fill" />
          Usar sugerencia
        </button>
      </section>

      <nav aria-label="Secciones de ejercicios" className={styles.sectionTabs}>
        {sectionOrder.map((sectionId) => (
          <button
            aria-pressed={activeSection === sectionId}
            className={activeSection === sectionId ? styles.activeTab : undefined}
            key={sectionId}
            onClick={() => setActiveSection(sectionId)}
            type="button"
          >
            {sectionLabels[sectionId]}
            <span>{exercisesBySection[sectionId].length}</span>
          </button>
        ))}
      </nav>

      <section aria-labelledby="exercise-list-title" className={styles.catalog}>
        <div className={styles.catalogHeading}>
          <div>
            <p className={styles.eyebrow}>Sección</p>
            <h2 id="exercise-list-title">{sectionLabels[activeSection]}</h2>
          </div>
          <span>{visibleExercises.length} opciones</span>
        </div>

        <ol className={styles.exerciseList}>
          {visibleExercises.map((exercise, index) => {
            const visual = getExerciseVisual(exercise.id);
            const movement = getExerciseMovement(exercise.id);
            const selected = selectedSet.has(exercise.id);
            const missingEquipment = getMissingExerciseEquipment(
              exercise,
              state.profile,
            );
            const availabilityNoteId = `availability-${exercise.id}`;

            return (
              <li className={styles.exerciseCard} key={exercise.id}>
                {visual ? (
                  <div className={styles.visual}>
                    <Image
                      alt={visual.alt}
                      className={styles.image}
                      height={visual.height}
                      loading={index < 4 ? "eager" : "lazy"}
                      sizes="(min-width: 900px) 280px, (min-width: 620px) 44vw, calc(100vw - 40px)"
                      src={visual.src}
                      width={visual.width}
                    />
                    {movement ? (
                      <span className={styles.videoIndex}>
                        Video {String(movement.order).padStart(2, "0")}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className={styles.cardBody}>
                  <div className={styles.cardHeading}>
                    <div>
                      <p>{exercise.primaryMuscles.join(" · ")}</p>
                      <h3>{exercise.name}</h3>
                    </div>
                    <button
                      aria-describedby={
                        missingEquipment.length > 0
                          ? availabilityNoteId
                          : undefined
                      }
                      aria-pressed={selected}
                      className={selected ? styles.selectedButton : styles.addButton}
                      disabled={missingEquipment.length > 0}
                      onClick={() => toggleExercise(exercise.id)}
                      type="button"
                    >
                      {selected ? (
                        <Check aria-hidden="true" size={18} weight="bold" />
                      ) : (
                        <Plus aria-hidden="true" size={18} weight="bold" />
                      )}
                      {selected ? "Agregado" : "Agregar"}
                    </button>
                  </div>

                  <dl className={styles.facts}>
                    <div>
                      <dt>Apoyo</dt>
                      <dd>{exercise.secondaryMuscles.join(" · ")}</dd>
                    </div>
                    <div>
                      <dt>Equipo</dt>
                      <dd>
                        {exercise.requiredEquipment
                          .map((equipment) => equipmentLabels[equipment])
                          .join(" · ")}
                      </dd>
                    </div>
                  </dl>

                  {movement ? (
                    <div className={styles.movementBlock}>
                      <p>
                        En el video: <strong>{movement.sourceExerciseName}</strong>
                      </p>
                      <ExerciseMovementModal
                        movement={movement}
                        muscleLabel={exercise.primaryMuscles.join(" · ")}
                        techniqueCues={exercise.techniqueCues}
                        title={exercise.name}
                      />
                    </div>
                  ) : null}

                  {missingEquipment.length > 0 ? (
                    <aside
                      className={styles.editorialNote}
                      id={availabilityNoteId}
                    >
                      <ShieldWarning aria-hidden="true" size={18} weight="fill" />
                      <p>
                        Requiere {missingEquipment
                          .map((equipment) => equipmentLabels[equipment])
                          .join(" · ")}. Activá ese equipo en Perfil para agregarlo.
                      </p>
                    </aside>
                  ) : null}

                  {exercise.safetyNote || movement?.editorialNote ? (
                    <aside className={styles.editorialNote}>
                      <ShieldWarning aria-hidden="true" size={18} weight="fill" />
                      <p>{exercise.safetyNote ?? movement?.editorialNote}</p>
                    </aside>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className={styles.selectionBar}>
        <div>
          <p>{selectedIds.length} ejercicios</p>
          <span>
            {selectedIds.length > 6
              ? "Para una sesión clara, 4 a 6 suelen alcanzar."
              : `${sectionLabels[activeSection]} · 3 series por ejercicio`}
          </span>
        </div>
        <button
          disabled={selectedIds.length === 0 || Boolean(state.activeSession)}
          onClick={startSelection}
          type="button"
        >
          {state.activeSession ? "Sesión en curso" : "Empezar selección"}
        </button>
      </footer>

      <p className={styles.liveMessage} aria-live="polite" role="status">
        {message}
      </p>
    </main>
  );
}
