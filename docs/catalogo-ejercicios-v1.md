# Catálogo de ejercicios v1 — integrado

## Estado

Catálogo funcional local integrado el 22 de agosto de 2026. Las láminas siguen
siendo contenido editorial pendiente de validación profesional antes de publicar.

- Cuatro secciones fijas: `Pecho + bíceps`, `Espalda + tríceps`, `Hombros` y
  `Abdominales`.
- Ejercicios compatibles con mancuernas, banco plano, banco inclinado o piso,
  incluyendo 22 movimientos segmentados: 14 de hombros y 8 de pecho.
- Sin rack, poleas, máquinas ni barra en el catálogo nuevo.
- Cada ejercicio funcional tiene una lámina de dos posiciones; los 22 ejercicios
  derivados de videos incluyen además un modal con el tramo correspondiente de
  YouTube.
- El usuario puede elegir ejercicios dentro de cualquiera de las cuatro secciones,
  iniciar la selección de la sección activa en ese orden y asignar cualquiera de
  los presets publicados a cualquier día.

La biblioteca funcional vive en:

- `http://localhost:3000/ejercicios`

La tabla de revisión previa se conserva en
`http://localhost:3000/review/exercise-catalog.html` como evidencia editorial.

## Criterio de curaduría

El catálogo ofrece opciones; no prescribe hacer todos los movimientos en una
sesión. Se excluyeron variantes casi idénticas o con una relación complejidad /
cobertura desfavorable para este equipo. En particular:

- elegir hasta dos curls supinos y conservar el curl martillo como patrón
  complementario;
- elegir un remo principal por sesión;
- elegir una extensión de tríceps principal y usar la patada sólo como accesorio;
- equilibrar hombro anterior, medio y posterior;
- evitar remo vertical en los presets, sit-up pesado y movimientos que requieran
  rack. El remo vertical permanece visible como opción con advertencia.

El `curl de bíceps con barra` conserva su asset histórico, pero queda fuera de
esta propuesta porque no cumple la nueva regla de mancuernas + banco.

## Decisión de producto implementada

La sección muscular, los ejercicios y el día deben estar desacoplados.

1. El producto ofrece presets sugeridos por sección.
2. El usuario puede agregar y quitar ejercicios; el orden de agregado define el
   orden de la sesión personalizada.
3. La semana inicial es editable y permite asignar cualquier preset a cualquier
   día. Guardar una rutina personalizada como preset queda para una fase futura.
4. Editar una selección no modifica una sesión activa ni el historial: ambos
   conservan snapshots.
5. Un ejercicio incompatible con el equipo se muestra deshabilitado y explica el
   motivo; nunca se reemplaza silenciosamente.

La selección personalizada se convierte en un snapshot de sesión y no modifica
el catálogo ni la agenda. Esto evita migrar el almacenamiento antes de validar el
uso real de rutinas guardadas.

## Adaptación del video de hombros

Fuente: [LOS MEJORES EJERCICIOS PARA AGRANDAR HOMBROS CON MANCUERNAS — Lio Fitness](https://www.youtube.com/watch?v=qI7TfFGM0HE).

- Se normalizaron 14 nombres y se guardaron segmentos editoriales aproximados
  para que `Ver movimiento` abra sólo el ejercicio correspondiente.
- El #8 se presenta como `Elevación lateral sentada`, porque el movimiento no es
  un fly de pecho.
- El #10 se presenta como `Reverse fly con pecho apoyado`, diferenciándolo de una
  apertura de pecho.
- No se convirtió el listado completo en una rutina de 42 series. El preset
  sugerido usa press alternado, elevación lateral, reverse fly inclinado y remo
  unilateral para deltoide posterior.
- El remo vertical queda fuera del preset y muestra una alternativa por posible
  incomodidad o pinzamiento.

## Adaptación del video de pecho

Fuente: [8 EJERCICIOS CON MANCUERNAS PARA AGRANDAR PECHO — Lio Fitness](https://www.youtube.com/watch?v=tKijsY8sRmo).

- Se separaron ocho movimientos distintos: fly-press inclinado, press de piso,
  press declinado con cadera elevada, fly de piso, flexión sobre dos mancuernas,
  pullover-a-press, press cerrado y flexión escalonada.
- `Ver movimiento` usa segmentos medidos por fotogramas. Las dos flexiones tienen
  IDs propios porque una es simétrica sobre dos mancuernas y la otra usa un solo
  apoyo elevado.
- Las ocho variantes quedan disponibles como opciones. No se copió la propuesta
  completa de 32 series ni el descanso de 30–45 segundos del video.
- El preset `Pecho + bíceps · selección video` usa press de piso, press inclinado
  simple y fly de piso, más dos curls. Mantiene 14 series y deja fuera de la
  sugerencia las variantes declinada, combinadas o asimétricas.
- Las flexiones sobre mancuernas exigen apoyos hexagonales que no rueden; si el
  equipo no es estable, corresponde usar el piso.

## Modelo mínimo futuro para rutinas guardadas

```ts
type ExerciseSectionId =
  | "chest-biceps"
  | "back-triceps"
  | "shoulders"
  | "abs";

interface ExerciseDefinition {
  id: string;
  sectionId: ExerciseSectionId;
  name: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  requiredEquipment: EquipmentId[];
}

interface WorkoutPreset {
  id: string;
  sectionId: ExerciseSectionId;
  suggestedExerciseIds: string[];
}

interface CustomWorkout {
  id: string;
  sectionId: ExerciseSectionId;
  exerciseIds: string[];
  updatedAt: string;
}
```

## Fuentes de contraste

- [ACE Exercise Library — Dumbbells](https://www.acefitness.org/resources/everyone/exercise-library/equipment/dumbbells/)
- [ACE — Single-arm Row](https://www.acefitness.org/resources/everyone/exercise-library/126/single-arm-row/)
- [ACE — Triceps Extension](https://www.acefitness.org/resources/everyone/exercise-library/74/triceps-extension/)
- [ACE — evidencia sobre deltoides](https://www.acefitness.org/resources/pros/expert-articles/9074/smart-shoulder-solutions-an-evidence-based-approach-to-training-the-deltoids/)
- [NSCA — Basics of Strength and Conditioning](https://www.nsca.com/contentassets/48a12160221541acbdc048498d77192d/basics_of_strength_and_conditioning_manual.pdf)

Estas fuentes respaldan el contraste editorial de equipo, patrón y músculos; no
reemplazan la validación individual de técnica ni una evaluación profesional.
