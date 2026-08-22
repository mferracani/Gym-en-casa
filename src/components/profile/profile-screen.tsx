"use client";

import { FloppyDisk } from "@phosphor-icons/react/FloppyDisk";
import { HardDrive } from "@phosphor-icons/react/HardDrive";
import { ShieldWarning } from "@phosphor-icons/react/ShieldWarning";
import { Trash } from "@phosphor-icons/react/Trash";
import { FormEvent, useState } from "react";

import { defaultProfile } from "../../data/training-catalog.ts";
import type { EquipmentId, Profile } from "../../domain/training/types.ts";
import { useTraining } from "../../state/training/use-training";
import styles from "./profile-screen.module.css";

const equipmentOptions = [
  { id: "dumbbells", label: "Mancuernas" },
  { id: "barbell", label: "Barra con discos" },
  { id: "flat-bench", label: "Banco plano" },
  { id: "adjustable-bench", label: "Banco inclinable" },
  { id: "rack", label: "Rack" },
] satisfies ReadonlyArray<{ id: EquipmentId; label: string }>;

type Feedback = { kind: "success" | "error"; message: string } | null;

export function ProfileScreen() {
  const training = useTraining();

  if (!training.isHydrated) {
    return (
      <main className={styles.page} aria-busy="true">
        <p className={styles.loading}>Cargando tu perfil local…</p>
      </main>
    );
  }

  const { profile } = training.state;

  return (
    <ProfileEditor
      profile={profile}
      resetLocalData={training.resetLocalData}
      storageWarning={training.storageWarning}
      updateProfile={training.updateProfile}
    />
  );
}

interface ProfileEditorProps {
  profile: Profile;
  resetLocalData: () => void;
  storageWarning: string | undefined;
  updateProfile: (profile: Profile) => void;
}

function ProfileEditor({
  profile,
  resetLocalData,
  storageWarning,
  updateProfile,
}: ProfileEditorProps) {
  const [draft, setDraft] = useState<Profile>(profile);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isResetArmed, setIsResetArmed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = draft.displayName.trim();

    if (!displayName) {
      setFeedback({ kind: "error", message: "Ingresá un nombre para guardar el perfil." });
      return;
    }

    updateProfile({ ...draft, displayName });
    setDraft((current) => ({ ...current, displayName }));
    setFeedback({ kind: "success", message: "Perfil guardado en este dispositivo." });
  }

  function updateEquipment(equipmentId: EquipmentId, checked: boolean) {
    setDraft((current) => ({
      ...current,
      equipment: { ...current.equipment, [equipmentId]: checked },
    }));
    setFeedback(null);
  }

  function handleReset() {
    if (!isResetArmed) {
      setIsResetArmed(true);
      setFeedback(null);
      return;
    }

    resetLocalData();
    setDraft({
      ...defaultProfile,
      equipment: { ...defaultProfile.equipment },
    });
    setIsResetArmed(false);
    setFeedback({ kind: "success", message: "Los datos locales se restablecieron." });
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Entrena Casa</p>
        <h1>Perfil</h1>
        <p>Configurá el equipo real con el que entrenás en casa.</p>
      </header>

      <section className={styles.storageNotice} aria-label="Almacenamiento local">
        <HardDrive aria-hidden="true" size={22} weight="regular" />
        <p>
          Tus cambios se guardan sólo en el almacenamiento local de este navegador.
        </p>
      </section>

      {storageWarning ? (
        <p className={styles.warning} role="status">
          No pudimos asegurar el guardado local. Tus cambios pueden perderse al cerrar esta pestaña.
        </p>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label htmlFor="profile-name">Nombre</label>
          <input
            id="profile-name"
            maxLength={60}
            onChange={(event) => {
              setDraft((current) => ({ ...current, displayName: event.target.value }));
              setFeedback(null);
            }}
            value={draft.displayName}
          />
        </div>

        <fieldset className={styles.equipment}>
          <legend>Equipo disponible</legend>
          <p>Se usa para evitar rutinas incompatibles o inseguras.</p>
          <div className={styles.equipmentList}>
            {equipmentOptions.map((equipment) => (
              <label className={styles.equipmentOption} key={equipment.id}>
                <span>{equipment.label}</span>
                <input
                  checked={draft.equipment[equipment.id]}
                  onChange={(event) => updateEquipment(equipment.id, event.target.checked)}
                  type="checkbox"
                />
              </label>
            ))}
          </div>
        </fieldset>

        {!draft.equipment.rack ? (
          <aside className={styles.rackNotice} aria-label="Restricción de seguridad sin rack">
            <ShieldWarning aria-hidden="true" size={23} weight="regular" />
            <p>
              <strong>Sin rack.</strong> El press de pecho con barra queda fuera de las rutinas disponibles.
            </p>
          </aside>
        ) : null}

        <button className={styles.saveButton} type="submit">
          <FloppyDisk aria-hidden="true" size={19} weight="bold" />
          Guardar cambios
        </button>
      </form>

      {feedback ? (
        <p
          className={feedback.kind === "error" ? styles.feedbackError : styles.feedbackSuccess}
          role="status"
        >
          {feedback.message}
        </p>
      ) : null}

      <section className={styles.dangerZone} aria-labelledby="reset-title">
        <h2 id="reset-title">Restablecer datos locales</h2>
        <p>Elimina el historial, la sesión activa y los cambios de perfil de este navegador.</p>
        {isResetArmed ? (
          <p className={styles.confirmation}>
            Esta acción no se puede deshacer. Confirmá el restablecimiento.
          </p>
        ) : null}
        <button className={styles.resetButton} onClick={handleReset} type="button">
          <Trash aria-hidden="true" size={19} weight="bold" />
          {isResetArmed ? "Confirmar restablecimiento" : "Restablecer datos"}
        </button>
      </section>
    </main>
  );
}
