# Design QA — Sprint 1 + MVP funcional

## Verificación funcional del MVP — 22 de agosto de 2026

- Viewports inspeccionados: `320 × 568`, `390 × 844` y `1280 × 900`; ninguno presenta overflow horizontal.
- Flujo completo aprobado: iniciar sesión, registrar una serie, recargar, retomar, revisar, finalizar y reconciliar el resultado en Progreso.
- Registro usado para reconciliación: `10 repeticiones × 12,5 kg = 125 kg`.
- Semana aprobada con edición, guardado, recarga y restauración. Durante QA se detectó y corrigió que las acciones sticky podían quedar debajo de la navegación fija.
- Perfil aprobado con guardado explícito, persistencia tras recarga, inventario de equipo y restricción sin rack.
- Navegación activa, foco, targets táctiles, `aria-live`, confirmación de descarte y reduced motion verificados estructuralmente.
- Consola final verificada en una pestaña nueva: sin warnings ni errores.
- La sesión mantiene el foco semántico al cambiar de ejercicio sin dibujar un contorno decorativo sobre títulos no interactivos.

## Comparison target

- Source visual truth: `/Users/mac017/Documents/ChatGPT/App GYM/design/mock-home.png`
- Source original pixels: `853 × 1844`.
- Normalized source: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/mock-home-390x844.png` at `390 × 844`.
- Implementation screenshot: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/home-mobile-390x844-final.png`.
- Implementation CSS viewport: `390 × 844`, device scale factor `1`.
- Implementation pixels: `390 × 844`.
- Final combined comparison: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/design-comparison-final.png`.
- Desktop evidence: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/home-desktop-1280x900.png` at `1280 × 900`.
- State: initial `Hoy`, before CTA feedback.

The source was downsampled to the exact CSS viewport before comparison. Browser chrome and device framing are absent from both sides.

## Full-view comparison evidence

The final combined image confirms the transferred design principles: warm white canvas, red action color, large two-line workout title, compact weekly orientation, asymmetric editorial stage, a strong CTA and persistent bottom navigation.

Intentional product constraints override literal source details:

- The brief requires `Pecho + bíceps` today instead of the mock's rest state.
- The brief requires 60 minutes, seven days and `Perfil`; the mock shows 55 minutes, five weekdays and `Ejercicios`.
- The source anatomy illustration is not used because its license is unverified. The implementation shows a clearly labeled pending state and useful muscle data rather than a fake asset.
- The rack restriction is added as visible safety content because it is mandatory in the product brief.

## Focused-region evidence

No separate crop was needed after normalization: the CTA, muscle labels, safety copy and bottom navigation remain legible at 1:1 in the full-size `390 × 844` implementation screenshot. Those regions were also inspected individually in the browser while testing the CTA and disabled navigation states.

## Required fidelity surfaces

- Fonts and typography: system UI sans matches the neutral tone of the source without a network font dependency. The title keeps the source's scale, weight, line break and tight tracking; app copy does not truncate in the final pass.
- Spacing and layout rhythm: the header, seven-day strip, hero, two support notes and bottom navigation fit without horizontal overflow. The document is `851px` high at a `844px` viewport and can scroll the final few pixels above the fixed navigation.
- Colors and tokens: warm background, charcoal type, dark red action and soft terracotta secondary state map consistently to CSS variables. Active, completed, recovery and disabled states remain distinguishable.
- Image quality and asset fidelity: no unlicensed anatomy or exercise artwork is published. No CSS drawing or custom SVG is used as a substitute; the pending state uses a licensed Phosphor interface icon and explicit copy.
- Copy and content: all Sprint 1 requirements are present in Argentine Spanish, including the adaptation message and no-rack warning.
- Icons: all visible UI icons come from one MIT-licensed family with consistent stroke treatment.
- Responsiveness: checked at `390 × 844` and `1280 × 900`; neither viewport has horizontal overflow.
- Accessibility: semantic headings and landmarks, named controls, `aria-current`, `aria-live`, native disabled buttons, visible focus styles, reduced-motion handling and a `55px` primary target.

## Interaction and console checks

- El CTA de Hoy inicia o retoma una sesión real; después de cerrarla cambia a `Ver progreso`.
- Semana, Progreso y Perfil son rutas navegables y reflejan el mismo estado persistido.
- Una sesión activa conserva series luego de recargar; el resumen permite cerrar con pendientes sólo si existe al menos una serie registrada.
- La navegación inferior permanece fija sin tapar las acciones de edición de Semana.
- Browser console final: sin warnings ni errores.

## Comparison history

### Pass 1

- [P2] The Next.js development indicator covered the active `Hoy` item. Fix: disabled `devIndicators` in `next.config.ts`.
- [P2] The CTA wrapped onto two lines, weakening the editorial hierarchy. Fix: reduced the mobile hero height and simplified the mobile CTA composition.
- [P2] The safety note was partially covered by the fixed navigation in the initial viewport. Fix: reduced the mobile stage minimum height so both support notes sit above the navigation.

Post-fix evidence: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/home-mobile-390x844-final.png`.

### Pass 2

- [P2] Forcing the CTA to one line while retaining its two icons clipped the label. Fix: hid decorative CTA icons on mobile, centered the complete label and kept both icons for desktop.

Post-fix evidence: `/Users/mac017/Documents/ChatGPT/App GYM/artifacts/design-comparison-final.png`.

## Remaining findings

No actionable P0, P1 or P2 findings remain in the MVP local. The anatomy slot and four workout days remain intentionally pending until their sources and content are validated.

MVP baseline result: passed

---

# Design QA — visuales de ejercicios

## Comparison target

- Source visual truth: las seis imágenes generadas con GPT Image 2 y aprobadas por el usuario, más `/Users/mac017/Downloads/ChatGPT Image 22 ago 2026, 13_43_58 (1).png` como referencia de composición de `Hoy`.
- Source Home pixels: `853 × 1844`, normalizados a `390 × 844` sólo para comparación.
- Source exercise pixels: `public/images/exercises/dumbbell-flat-press.webp`, `1586 × 992`.
- Implementation Home: `design/qa/home-mobile-viewport-390x844.png`, viewport y pixels `390 × 844`, DPR `1`.
- Implementation routine: `design/qa/home-gallery-mobile-390x844.png` y `design/qa/home-gallery-desktop-1280x900-v2.png`.
- Implementation session: `design/qa/session-exercise-1-mobile-390x844.png` y `design/qa/session-exercise-5-mobile-390x844.png`.
- Combined full-view evidence: `design/qa/home-comparison-390x844.png`.
- Combined focused evidence: `design/qa/session-flat-press-comparison-390x844.png`.
- State: sesión disponible o activa, cinco ejercicios publicados, sin series registradas.

## Full-view comparison evidence

La comparación conjunta conserva el fondo marfil, el rojo ladrillo, la anatomía en tinta, la jerarquía editorial asimétrica y el contraste entre músculos principales y secundarios. El mapa muscular reemplaza el estado pendiente en el slot existente sin alterar el CTA ni la semana. La lista muestra los cinco ejercicios en el orden real del template y no inventa contenido para los otros días.

## Focused-region evidence

La lámina de press plano se compara junto a su render dentro de la sesión. Ambas posiciones, banco, mancuernas y músculos resaltados permanecen completas: `object-fit: contain` no recorta ni deforma el asset. La misma comprobación funcional recorrió los cinco pasos y confirmó el `src` y texto alternativo correspondiente a cada ejercicio.

## Required fidelity surfaces

- Fonts and typography: se conserva la escala, peso y tracking del sistema existente; los nombres largos envuelven sin truncarse tanto en lista como en detalle.
- Spacing and layout rhythm: en `390 × 844` el mapa comparte el hero sin desbordar; los cinco ejercicios entran juntos en un viewport al enfocar la rutina. En `1280 × 900` la galería usa cinco columnas y evita una lista extensa con vacío lateral.
- Colors and visual tokens: el marfil, grafito, rojo principal y salmón secundario de las imágenes se integran con los tokens existentes sin bordes ni sombras decorativas nuevas.
- Image quality and asset fidelity: los seis assets aprobados están presentes, se sirven mediante `next/image`, mantienen su proporción y cargan con ancho responsive. No quedan placeholders, CSS art ni SVGs aproximados.
- Copy and content: nombres, orden y `3 × 10` se derivan de `workoutTemplates` y `exerciseCatalog`; no se duplica contenido editorial.
- Icons: no se agregaron familias nuevas; Phosphor permanece como única iconografía de interfaz.
- Responsiveness: `overflowX = 0` en `390 × 844`; revisión visual aprobada también en `1280 × 900`.
- Accessibility: todas las imágenes informativas tienen alt específico de movimiento; no se agregaron controles falsos; foco, targets y reduced motion existentes permanecen intactos.

## Interaction and console checks

- El CTA abre la sesión real y el botón `Siguiente` recorre las cinco láminas correctas.
- Las cinco miniaturas y el mapa reportan carga completa y ancho responsive en el navegador.
- La primera pasada detectó el aviso LCP de Next.js para el mapa muscular; se configuró carga eager y una recarga posterior no agregó warnings ni errores nuevos.
- `npm test`: 24 tests en verde. `npm run lint`, `npm run typecheck` y `npm run build`: aprobados.

## Comparison history

### Pass 1

- [P2] La adaptación desktop mantenía una única lista angosta y desperdiciaba el ancho disponible. Fix: galería de cinco columnas desde `960px`, sin convertir cada ejercicio en una card.
- [P2] Next.js detectó el mapa muscular como LCP cargado de forma diferida. Fix: `loading="eager"` únicamente para ese asset above-the-fold.

Post-fix evidence: `design/qa/home-gallery-desktop-1280x900-v2.png` y recarga de consola sin entradas nuevas.

### Pass 2

No quedan diferencias P0, P1 o P2 accionables. El único bloqueo de contenido está fuera de esta integración: las otras cuatro rutinas de fuerza todavía no tienen ejercicios definidos.

final result: passed

---

# Design QA — video de abdominales y catálogo editable

## Comparison target

- Fuente: [10 EJERCICIOS PARA ABDOMEN EN CASA — Lio Fitness](https://www.youtube.com/watch?v=UtRrE-X-KPQ), duración `4:12`.
- Descripción inspeccionada: orden, nombres, series, repeticiones y descansos de los diez movimientos.
- Evidencia visual conjunta: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/abs-video-qa/abs-exercise-visuals.png`.
- Catálogo desktop: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/abs-video-qa/abs-catalog-desktop.png`.
- Modales extremos: `abs-first-movement-modal.png` y `abs-last-movement-modal.png` en la misma carpeta.

## Full-view comparison evidence

Los diez ejercicios se muestran primero y en el mismo orden que el video. Cada
tarjeta usa una lámina propia de dos posiciones, el músculo principal, apoyos,
nombre fuente y `Ver movimiento`. Los cuatro abdominales preexistentes quedan al
final y no pierden su selección independiente.

## Required fidelity surfaces

- Movimiento: los clips extremos reproducen `10–34 s` y `219–247 s`; los ocho
  intermedios conservan sus ventanas editoriales en el mapping tipado.
- Imágenes: 10/10 WebP cargaron; la primera y la última reportaron
  `naturalWidth = 279` en su render desktop.
- Sugerencia: el CTA selecciona exactamente triple elevación, elevación de
  piernas, crunch en X y plancha lateral dinámica. Con una sesión activa, el
  aviso confirma que la lista cambia sin modificar la sesión en curso.
- Layout: `1258 × 927`, sin overflow horizontal (`scrollWidth = clientWidth =
  1258`) y sin que la barra de sesión tape el catálogo.
- Accesibilidad: tabs con `aria-pressed`, status de sugerencia, modal nombrado,
  cierre explícito y textos alternativos específicos por lámina.

## Interaction and verification

- `Abdominales` muestra 14 opciones: 10 del video y 4 preexistentes.
- `Usar sugerencia` pasa a `Sugerencia aplicada` y deja 4 ejercicios agregados.
- El primer y el último modal abren embeds de `youtube-nocookie.com` con `start`
  y `end` correctos.
- `npm test`: 55/55. `npm run lint`, `npm run typecheck` y `npm run build`:
  aprobados; el build usó una copia aislada cuyo source y assets cambiados
  coinciden byte a byte con el workspace.

No quedan diferencias P0, P1 o P2 accionables para esta integración. La técnica,
los cues y la prescripción siguen pendientes de validación profesional antes de
publicación externa.

final result: passed

---

# Design QA — video de espalda

## Comparison target

- Fuente primaria: [LOS MEJORES EJERCICIOS PARA AGRANDAR ESPALDA CON MANCUERNAS — Lio Fitness](https://www.youtube.com/watch?v=CCLrgxrr8vM), duración informada `3:01`.
- Orden editorial confirmado en la descripción del autor: ocho movimientos. El video no ofrece capítulos, subtítulos ni transcripción.
- Catálogo desktop: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/back-video-qa/back-catalog-desktop-1258x927.png`.
- Modal de movimiento: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/back-video-qa/back-movement-modal-desktop-1258x927.png`.
- Revisión conjunta de las ocho láminas: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/back-video-qa/back-eight-exercises-contact-sheet.png`.
- Viewport directo de la implementación: `1258 × 927`, DPR `1`, `/ejercicios`, sección `Espalda + tríceps`, sesión de pecho activa preservada.

## Full-view comparison evidence

La sección mantiene el lenguaje editorial aprobado y muestra 11 opciones: los ocho movimientos de espalda en el orden del video y tres ejercicios de tríceps. Se reutilizan las láminas existentes del remo unilateral y el remo con pecho apoyado; los otros seis patrones tienen una generación propia. El bloque de sesión activa permanece dentro del flujo y no tapa las tarjetas.

## Focused-region evidence

La lámina del remo inclinado bilateral se regeneró porque la primera salida ocultaba una mancuerna. La versión final muestra dos mancuernas separadas, ambas manos y el recorrido bilateral en inicio y final. La hoja conjunta permite distinguir el remo renegado, los dos agarres de pie, las dos variantes apoyadas y ambos encogimientos sin depender sólo del nombre.

## Required fidelity surfaces

- Imágenes: los seis WebP nuevos miden `1536 × 1024`; las 11 imágenes de la sección reportaron carga completa y ancho natural positivo.
- Movimiento: los ocho botones `Ver movimiento` usan `youtube-nocookie.com`, sin autoplay. Se verificaron directamente el primer segmento `0–34 s` y el último `155–181 s`.
- Contenido: los nombres visibles normalizan los «jalones» del autor como remos y los «press para trapecio» como encogimientos; `En el video` conserva el rótulo fuente.
- Recomendación: `Usar sugerencia` cambia la lista a tres ejercicios de espalda y dos de tríceps, confirma el estado aplicado y no modifica una sesión en curso.
- Seguridad: el remo renegado advierte que las dos mancuernas deben ser hexagonales y estables; agarres supinos y encogimientos se presentan como alternativas.
- Responsiveness: sin overflow horizontal en `1258 × 927`. La integración reutiliza el componente de catálogo ya aprobado en `390 × 844` y no agrega reglas de layout nuevas.
- Accesibilidad: las seis nuevas imágenes tienen alt específico; el modal conserva diálogo nombrado, tres cues, cierre por Escape y enlace a la fuente.

## Interaction and console checks

- Cambiar a `Espalda + tríceps` mostró `11 opciones` y badges `Video 01` a `Video 08` en el orden esperado.
- La sugerencia pasó de la selección editorial anterior al nuevo preset de cinco ejercicios y mostró confirmación visible.
- El primer modal abrió con `start=0&end=34`; el último con `start=155&end=181`.
- `npm test`: 51/51. `npm run lint`, `npm run typecheck` y `npm run build`: aprobados contra una copia aislada cuyo source coincide byte a byte con el workspace.

## Comparison history

### Pass 1

- [P2] El primer remo bilateral ocultaba una mancuerna por el ángulo trasero. Fix: regeneración frontal-lateral 3/4 con ambos brazos y las dos mancuernas visibles en las dos posiciones.
- [P2] La nomenclatura literal del video llamaba «jalones» a remos y «press» a encogimientos. Fix: nombre técnico en la tarjeta y rótulo original conservado como referencia de fuente.

No quedan diferencias P0, P1 o P2 accionables en esta integración. Técnica, cues y agrupaciones siguen pendientes de validación profesional antes de publicación externa.

final result: passed

---

# Design QA — ubicación de la sesión en curso

## Comparison target

- Source visual truth: captura anotada por el usuario de `/ejercicios`, recreada en `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/exercise-session-bar-qa/exercise-selection-bar-source-1258x927.png`.
- Implementation desktop: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/exercise-session-bar-qa/exercise-selection-bar-after-1258x927.png`.
- Combined comparison: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/exercise-session-bar-qa/exercise-selection-bar-comparison-1258x927.png`.
- Mobile evidence: `/Users/mac017/.codex/visualizations/2026/08/22/01a02a5b-d44d-7043-80d0-97f3e8ef0ad7/exercise-session-bar-qa/exercise-selection-bar-after-390x844.png`.
- Desktop source and implementation: `1258 × 927` pixels, CSS viewport `1258 × 927`, DPR `1`.
- Mobile implementation: `390 × 844` pixels, CSS viewport `390 × 844`, DPR `1`.
- State: `/ejercicios`, `Pecho + bíceps`, sesión activa, `scrollY = 0`.

## Full-view comparison evidence

La comparación conjunta muestra que la barra fija de `680 × 72 px` tapaba tres tarjetas y se superponía `18 px` con la navegación. La implementación la integra después del aviso editorial sólo cuando existe una sesión activa. En desktop pasa a ocupar `1048 × 72 px` dentro del flujo; la medición posterior devuelve cero tarjetas superpuestas. En mobile ocupa `350 × 72 px`, tampoco se superpone a la primera tarjeta y no genera overflow horizontal (`scrollWidth = clientWidth = 390`).

## Focused-region evidence

No hizo falta un crop separado: el componente completo y los tres primeros ejercicios son legibles en la comparación 1:1. La verificación se complementó con bounding boxes del navegador para confirmar `position: static`, ausencia de intersección con tarjetas y separación de la navegación inferior.

## Required fidelity surfaces

- Fonts and typography: se conservaron familia, pesos, tamaños, tracking y jerarquía del componente; no aparece truncamiento nuevo.
- Spacing and layout rhythm: el bloque activo queda entre el aviso de video y las pestañas con `16 px` de separación; el contenido posterior se desplaza en el flujo en lugar de quedar cubierto.
- Colors and visual tokens: conserva fondo marfil, borde, rojo de acción y estados existentes; se retiran sólo sombra y blur cuando el bloque deja de flotar.
- Image quality and asset fidelity: no se modificaron, recortaron ni reemplazaron las láminas; los tres visuales above-the-fold mantienen escala y nitidez.
- Copy and content: `Sesión en curso`, `Pecho + bíceps` y `Retomar sesión` se mantienen sin cambios.
- Responsiveness: aprobado en `1258 × 927` y `390 × 844`; no hay overflow horizontal ni solapamiento de la sesión activa.
- Accessibility: el bloque pasa a `aside` nombrado, conserva botón nativo, foco visible y target de `48 px`; su orden de teclado ahora precede al catálogo, igual que su posición visual.

## Interaction and console checks

- `Retomar sesión` navegó a `/entrenar`; volver restauró `/ejercicios` con el CTA visible.
- El cambio de sección siguió funcionando y la sesión activa conservó su nombre.
- Consola en desktop y mobile: sin errores.
- `npm test`: 46/46. `npm run lint`, `npm run typecheck` y `npm run build`: aprobados.

## Comparison history

### Pass 1

- [P1] La barra de sesión activa era fija y bloqueaba contenido principal en los dos tamaños. Fix: reubicar el bloque antes del catálogo y aplicar layout estático sólo al estado de sesión activa.
- [P2] El bloque fijo invadía la navegación inferior en desktop. Fix: retirar el posicionamiento, sombra y blur del estado activo, y ajustar el espacio inferior reservado por la página.

Post-fix evidence: comparación desktop conjunta y captura mobile indicadas arriba; ambas mediciones reportan cero solapamientos.

No quedan diferencias P0, P1 o P2 accionables para esta corrección.

final result: passed

---

# Design QA — video de hombros y catálogo editable

## Comparison target

- Source visual truth: video `qI7TfFGM0HE`, revisado en sus 14 tramos editoriales, junto con las tres referencias anatómicas aportadas por el usuario.
- Source movement inspected: frame del primer reverse fly alrededor de `00:10`.
- Implementation asset inspected in the same comparison input: `public/images/exercises/bent-over-dumbbell-rear-delt-fly.webp`.
- Implementation route: `/ejercicios` en `390 × 844`.
- Implementation evidence: `design/qa/video-catalog-mobile-390x844.png` y `design/qa/video-modal-mobile-390x844.png`.
- Los frames temporales del video se retiraron del repositorio después de la comparación; la fuente permanece enlazada y no se republica.

## Full-view comparison evidence

La biblioteca conserva el lenguaje visual aprobado: fondo marfil, tipografía editorial compacta, rojo ladrillo, ilustración anatómica en tinta y navegación inferior persistente. Los 14 movimientos se presentan como opciones dentro de Hombros, mientras que la sugerencia visible queda acotada a cuatro ejercicios para evitar convertir el video completo en una rutina de 42 series.

## Focused-region evidence

El frame fuente y la lámina generada del reverse fly se inspeccionaron juntos. La implementación conserva la bisagra de cadera, el recorrido desde brazos bajos hasta apertura lateral y el énfasis en deltoides posteriores, pero elimina overlays, marca de agua y ruido visual del video. El modal agrega el tramo exacto, músculo principal y tres cues sin sustituir la fuente original.

## Required fidelity surfaces

- Images: los 32 ejercicios publicados en las cuatro secciones tienen láminas WebP; los 14 derivados del video usan dos posiciones y resaltado muscular. Todos los recursos cargaron con ancho natural positivo al entrar en viewport.
- Motion reference: cada ejercicio del video abre un embed `youtube-nocookie.com` con `start` y `end`, sin autoplay y con enlace a la fuente.
- Section model: Pecho + bíceps, Espalda + tríceps, Hombros y Abdominales conservan selecciones independientes. Cambiar de sección no mezcla ejercicios.
- Recommendation: el preset de Hombros usa cuatro patrones complementarios; el remo vertical mantiene advertencia y no queda preseleccionado.
- Responsiveness: catálogo y modal inspeccionados a `390 × 844`; no hay recortes de ilustraciones ni overflow horizontal.
- Accessibility: modal con diálogo nombrado, cierre por Escape, restauración del foco y controles de al menos `44 × 44 px`.
- Performance: los PNG maestros se retiraron del árbol del proyecto y producción sirve sólo derivados WebP; las primeras cuatro imágenes de la sección activa cargan eager para cubrir candidatos LCP mobile y desktop sin cargar el catálogo completo.

## Interaction and console checks

- La selección de Pecho + bíceps pasó de 5 a 6 y volvió a 5 al agregar y retirar Curl de concentración; Hombros permaneció en 4.
- Al desactivar Banco inclinable en Perfil, Press inclinado quedó deshabilitado, explicó el equipo faltante y la selección sugerida pasó de 5 a 4; el inventario se restauró al terminar el QA.
- El primer modal abrió el tramo `7–24 s`, usó `loading="lazy"` para el iframe y devolvió el foco a `Ver movimiento` al cerrar con Escape.
- Semana mostró los cuatro presets publicados en los siete días y la edición se canceló sin alterar la agenda.
- Consola final en una pestaña nueva, después de recorrer las cuatro secciones: sin warnings ni errores.
- `npm test`: 37/37. `npm run lint`, `npm run typecheck` y `npm run build`: aprobados.

## Comparison history

### Pass 1

- [P2] Una lámina de remo posterior mostraba una mancuerna extra. Fix: asset regenerado y vuelto a optimizar.
- [P2] Varias variantes del video se solapaban visualmente por nombres genéricos. Fix: normalización editorial a reverse fly de pie, elevación lateral sentada y reverse fly con pecho apoyado.
- [P2] Los PNG de producción pesaban cerca de 64 MB. Fix: derivados WebP centralizados, aproximadamente 3,2 MB en total.
- [P2] Next.js reportó candidatos LCP diferidos al cambiar de sección. Fix: carga eager de las primeras cuatro láminas visibles y nueva pasada de consola limpia.

### Pass 2

No quedan diferencias P0, P1 o P2 accionables en el catálogo y el movimiento integrado. La validación profesional de técnica y cues sigue siendo un requisito editorial antes de publicación externa.

final result: passed
