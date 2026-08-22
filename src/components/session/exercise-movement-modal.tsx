"use client";

import { ArrowSquareOut } from "@phosphor-icons/react/ArrowSquareOut";
import { PlayCircle } from "@phosphor-icons/react/PlayCircle";
import { X } from "@phosphor-icons/react/X";
import { useEffect, useId, useRef, useState } from "react";

import {
  buildMovementSourceUrl,
  buildYouTubeEmbedUrl,
  isValidMovementSegment,
  type MovementSegment,
} from "./exercise-movement-utils";
import styles from "./exercise-movement-modal.module.css";

interface ExerciseMovementModalProps {
  movement: MovementSegment;
  title: string;
  muscleLabel: string;
  techniqueCues: readonly string[];
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
    ),
  );
}

export function ExerciseMovementModal({
  movement,
  title,
  muscleLabel,
  techniqueCues,
}: ExerciseMovementModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    closeButtonRef.current?.focus();
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen]);

  if (!isValidMovementSegment(movement) || techniqueCues.length < 2) return null;

  return (
    <>
      <button className={styles.trigger} onClick={() => setIsOpen(true)} type="button">
        <PlayCircle aria-hidden="true" size={20} weight="fill" />
        Ver movimiento
      </button>

      {isOpen ? (
        <div className={styles.backdrop}>
          <section
            aria-labelledby={titleId}
            aria-modal="true"
            className={styles.dialog}
            ref={dialogRef}
            role="dialog"
          >
            <header className={styles.header}>
              <div>
                <p className={styles.eyebrow}>Referencia de movimiento</p>
                <h2 id={titleId}>{title}</h2>
              </div>
              <button
                aria-label="Cerrar referencia de movimiento"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" size={20} weight="bold" />
              </button>
            </header>

            <iframe
              allowFullScreen
              className={styles.video}
              loading="lazy"
              src={buildYouTubeEmbedUrl(movement)}
              title={`Demostración de ${title}`}
            />

            <div className={styles.details}>
              <section>
                <h3>Músculo trabajado</h3>
                <p>{muscleLabel}</p>
              </section>

              <section>
                <h3>Claves técnicas</h3>
                <ul className={styles.cueList}>
                  {techniqueCues.map((cue) => <li key={cue}>{cue}</li>)}
                </ul>
              </section>

              <a
                className={styles.sourceLink}
                href={buildMovementSourceUrl(movement)}
                rel="noreferrer"
                target="_blank"
              >
                Ver fuente en YouTube
                <ArrowSquareOut aria-hidden="true" size={18} weight="bold" />
              </a>
              <p className={styles.thirdPartyNote}>
                El video se reproduce desde YouTube al abrir esta referencia.
              </p>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
