"use client";

import { ArrowsClockwise } from "@phosphor-icons/react/ArrowsClockwise";
import { CloudArrowUp } from "@phosphor-icons/react/CloudArrowUp";
import { CloudCheck } from "@phosphor-icons/react/CloudCheck";
import { FloppyDisk } from "@phosphor-icons/react/FloppyDisk";
import { HardDrive } from "@phosphor-icons/react/HardDrive";
import { ShieldWarning } from "@phosphor-icons/react/ShieldWarning";
import { SignOut } from "@phosphor-icons/react/SignOut";
import { Trash } from "@phosphor-icons/react/Trash";
import { FormEvent, useState } from "react";

import { defaultProfile } from "../../data/training-catalog.ts";
import type { EquipmentId, Profile } from "../../domain/training/types.ts";
import { useCloudSync } from "../../state/cloud/use-cloud-sync.ts";
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
  const cloudSync = useCloudSync();

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
      cloudSync={cloudSync}
      resetLocalData={training.resetLocalData}
      storageWarning={training.storageWarning}
      updateProfile={training.updateProfile}
    />
  );
}

interface ProfileEditorProps {
  profile: Profile;
  cloudSync: ReturnType<typeof useCloudSync>;
  resetLocalData: () => void;
  storageWarning: string | undefined;
  updateProfile: (profile: Profile) => void;
}

function ProfileEditor({
  profile,
  cloudSync,
  resetLocalData,
  storageWarning,
  updateProfile,
}: ProfileEditorProps) {
  const [draft, setDraft] = useState<Profile>(profile);
  const [sourceProfileKey, setSourceProfileKey] = useState(() =>
    JSON.stringify(profile),
  );
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isResetArmed, setIsResetArmed] = useState(false);
  const nextProfileKey = JSON.stringify(profile);

  if (sourceProfileKey !== nextProfileKey) {
    setSourceProfileKey(nextProfileKey);
    setDraft(profile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const displayName = draft.displayName.trim();

    if (!displayName) {
      setFeedback({ kind: "error", message: "Ingresá un nombre para guardar el perfil." });
      return;
    }

    updateProfile({ ...draft, displayName });
    setDraft((current) => ({ ...current, displayName }));
    setFeedback({
      kind: "success",
      message: cloudSync.user
        ? "Perfil guardado. La copia en Firebase se actualizará automáticamente."
        : "Perfil guardado en este dispositivo.",
    });
  }

  function updateEquipment(equipmentId: EquipmentId, checked: boolean) {
    setDraft((current) => ({
      ...current,
      equipment: { ...current.equipment, [equipmentId]: checked },
    }));
    setFeedback(null);
  }

  async function handleReset() {
    if (!isResetArmed) {
      setIsResetArmed(true);
      setFeedback(null);
      return;
    }

    if (cloudSync.user && !(await cloudSync.disconnect())) {
      setFeedback({
        kind: "error",
        message: "No pudimos cerrar la sesión. Tus datos no se restablecieron.",
      });
      return;
    }

    resetLocalData();
    setDraft({
      ...defaultProfile,
      equipment: { ...defaultProfile.equipment },
    });
    setIsResetArmed(false);
    setFeedback({
      kind: "success",
      message: cloudSync.user
        ? "Cerramos la sesión y restablecimos los datos de este dispositivo. La copia remota sigue intacta."
        : "Los datos locales se restablecieron.",
    });
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Entrena Casa</p>
        <h1>Perfil</h1>
        <p>Configurá el equipo real con el que entrenás en casa.</p>
      </header>

      <section className={styles.storageNotice} aria-label="Almacenamiento local">
        {cloudSync.user ? (
          <CloudCheck aria-hidden="true" size={22} weight="regular" />
        ) : (
          <HardDrive aria-hidden="true" size={22} weight="regular" />
        )}
        <p>
          {cloudSync.user
            ? "Tus cambios se guardan en este dispositivo y se copian en Firebase."
            : "Tus cambios se guardan en el almacenamiento local de este navegador."}
        </p>
      </section>

      <CloudSyncPanel cloudSync={cloudSync} />

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
        <h2 id="reset-title">Restablecer datos de este dispositivo</h2>
        <p>
          Elimina el historial, la sesión activa y los cambios de perfil de este navegador.
          {cloudSync.user
            ? " Las sesiones que ya están en Firebase no se eliminan."
            : ""}
        </p>
        {isResetArmed ? (
          <p className={styles.confirmation}>
            Esta acción no se puede deshacer. Confirmá el restablecimiento.
          </p>
        ) : null}
        <button
          className={styles.resetButton}
          onClick={() => void handleReset()}
          type="button"
        >
          <Trash aria-hidden="true" size={19} weight="bold" />
          {isResetArmed ? "Confirmar restablecimiento" : "Restablecer datos"}
        </button>
      </section>
    </main>
  );
}

function CloudSyncPanel({
  cloudSync,
}: {
  cloudSync: ReturnType<typeof useCloudSync>;
}) {
  const isBusy =
    cloudSync.status === "checking" ||
    cloudSync.status === "connecting" ||
    cloudSync.status === "syncing";
  const lastSync = cloudSync.lastSyncedAt
    ? new Intl.DateTimeFormat("es-AR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(cloudSync.lastSyncedAt))
    : null;

  let statusMessage = "Conectá Google para recuperar tus entrenamientos en otro dispositivo.";

  if (!cloudSync.isConfigured) {
    statusMessage = "La app está preparada; falta vincular el proyecto Firebase.";
  } else if (cloudSync.status === "checking") {
    statusMessage = "Revisando tu sesión de Firebase…";
  } else if (cloudSync.status === "connecting") {
    statusMessage = "Abriendo el acceso con Google…";
  } else if (cloudSync.status === "syncing") {
    statusMessage = "Guardando tu copia en Firebase…";
  } else if (cloudSync.status === "synced") {
    statusMessage = lastSync
      ? `Copia actualizada el ${lastSync}`
      : "Tu copia de Firebase está actualizada.";
  } else if (cloudSync.status === "error") {
    statusMessage = cloudSync.errorMessage ?? "No pudimos completar la sincronización.";
  }

  return (
    <section className={styles.cloudPanel} aria-labelledby="cloud-sync-title">
      <div className={styles.cloudHeading}>
        <CloudArrowUp aria-hidden="true" size={24} weight="regular" />
        <div>
          <h2 id="cloud-sync-title">Copia en la nube</h2>
          <p>Firebase Spark · sin costo y sin reemplazar el guardado local.</p>
        </div>
      </div>

      {cloudSync.user ? (
        <p className={styles.cloudAccount}>
          {cloudSync.user.displayName ?? cloudSync.user.email ?? "Cuenta de Google conectada"}
        </p>
      ) : null}

      <p
        className={
          cloudSync.status === "error"
            ? styles.cloudStatusError
            : styles.cloudStatus
        }
        aria-live="polite"
      >
        {statusMessage}
      </p>

      {cloudSync.user ? (
        <div className={styles.cloudActions}>
          <button
            className={styles.cloudPrimaryButton}
            disabled={isBusy}
            onClick={() => void cloudSync.syncNow()}
            type="button"
          >
            <ArrowsClockwise aria-hidden="true" size={19} weight="bold" />
            {cloudSync.status === "syncing" ? "Sincronizando…" : "Sincronizar ahora"}
          </button>
          <button
            className={styles.cloudSecondaryButton}
            disabled={isBusy}
            onClick={() => void cloudSync.disconnect()}
            type="button"
          >
            <SignOut aria-hidden="true" size={19} weight="bold" />
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button
          className={styles.cloudPrimaryButton}
          disabled={!cloudSync.isConfigured || isBusy}
          onClick={() => void cloudSync.connect()}
          type="button"
        >
          <CloudArrowUp aria-hidden="true" size={19} weight="bold" />
          {cloudSync.status === "connecting" ? "Conectando…" : "Conectar con Google"}
        </button>
      )}
    </section>
  );
}
