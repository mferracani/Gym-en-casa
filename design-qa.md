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

final result: passed
