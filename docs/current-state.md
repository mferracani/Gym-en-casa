# Current State

## Fase

Bootstrap del proyecto y Sprint 1 completados localmente el 22 de agosto de 2026.

## Architecture & Stack

- Next.js 16 con App Router.
- React 19 y TypeScript estricto.
- Tailwind CSS 4.
- Phosphor Icons.
- Datos mock locales en `src/data/training-plan.ts`.
- Sin backend, autenticación ni persistencia.

## Decisiones tomadas

- Mock 1 es la referencia visual principal.
- La portada del próximo entrenamiento concentra la jerarquía del Home.
- El texto del brief manda sobre inconsistencias de los mocks: Hoy contiene `Pecho + bíceps` y la navegación incluye `Perfil`.
- La ilustración anatómica queda como estado pendiente hasta contar con licencia verificable.
- La restricción por falta de rack se muestra explícitamente.

## Riesgos

- La ausencia de una ilustración aprobada reduce la fidelidad literal respecto del mock.
- El contenido de rutina todavía necesita validación profesional antes de uso real.
- Los destinos Semana, Progreso y Perfil están preparados visualmente pero quedan deshabilitados en este sprint.

## Verificación

- 3 tests del modelo mock en verde.
- ESLint sin errores.
- TypeScript estricto sin errores.
- Build de producción exitoso con webpack; Turbopack no se usa para el build porque el sandbox local bloquea su puerto interno de PostCSS.
- QA visual aprobado en 390 × 844 y 1280 × 900.
- CTA, estados disabled y consola del navegador verificados.
- Evidencia: `design-qa.md` y `artifacts/`.

## Próximos pasos

1. Cerrar QA del Sprint 1.
2. Validar rutina y mensajes de seguridad con un profesional.
3. Definir Sprint 2: sesión activa, peso, series y temporizador.
4. Seleccionar fuentes visuales con licencia verificable.
