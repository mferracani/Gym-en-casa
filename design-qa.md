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
