# Current State

## Fase

MVP funcional local-first completado y verificado localmente el 22 de agosto de 2026.

## Architecture & Stack

- Next.js 16 con App Router, React 19 y TypeScript estricto.
- Tailwind CSS 4 para tokens globales y CSS Modules por superficie funcional.
- Phosphor Icons como única librería visual de producción.
- Catálogo, rutina y agenda seed tipados en `src/data/`.
- Dominio puro en `src/domain/training/`: restricciones de equipo, sesiones, calendario, selectores y progreso.
- Estado React con reducer y provider en `src/state/training/`.
- Persistencia `localStorage` mediante envelope versionado `v1`, validación manual, recuperación ante datos corruptos y migración desde `v0`.
- Sin backend, autenticación, Supabase, analítica ni sincronización entre dispositivos.

## Producto implementado

- `Hoy`: fecha real, estado semanal derivado, rutina disponible, retoma y acceso a progreso luego del cierre.
- `Sesión guiada`: un ejercicio por vez, peso opcional en kg, repeticiones, registro/reapertura de series, pausa, navegación, confirmación de descarte, resumen y cierre.
- `Semana`: agenda recurrente editable con fuerza, rutina publicada, recuperación, descanso y contenido pendiente.
- `Progreso`: historial de sesiones, series, repeticiones, volumen, último registro y máximo peso por ejercicio.
- `Perfil`: nombre, inventario de equipo, advertencia sin rack, aviso de almacenamiento local y restablecimiento en dos pasos.
- Navegación real entre `Hoy`, `Semana`, `Progreso` y `Perfil`.

## Decisiones tomadas

- El MVP es local-first: ningún servicio remoto es necesario para validar el ciclo de uso personal.
- Una sesión guarda un snapshot de la rutina al comenzar; cambios posteriores de agenda o catálogo no reescriben el historial.
- Sólo las series `completed` cuentan en métricas y volumen.
- La agenda inicial asigna `Pecho + bíceps` únicamente al sábado. Los otros cuatro días de fuerza no inventan ejercicios.
- No se implementa temporizador: el descanso se muestra como referencia editorial.
- No se implementa PWA todavía: faltan íconos aprobados y un service worker correctamente versionado para prometer offline completo.
- La ilustración anatómica permanece como estado pendiente hasta contar con licencia verificable.

## Verificación

- `npm test`: 21 tests en verde.
- `npm run lint`: sin errores ni warnings.
- `npm run typecheck`: TypeScript estricto en verde.
- `npm run build`: build de producción exitoso con webpack; seis rutas estáticas generadas.
- QA de flujo: iniciar → registrar `10 × 12,5 kg` → recargar → retomar → revisar → cerrar → reconciliar `125 kg` en Progreso.
- QA de Semana: editar, guardar, recargar y restaurar un día; se corrigió el solapamiento de acciones sticky con la navegación inferior.
- QA de Perfil: guardar nombre, recargar y restaurar; feedback de éxito visible.
- QA responsive: `320 × 568`, `390 × 844` y `1280 × 900`, sin overflow horizontal.
- Consola verificada en una pestaña nueva sin warnings ni errores.
- Evidencia y criterios visuales: `design-qa.md`.

## Riesgos y pendientes

- La rutina y las indicaciones siguen siendo contenido de producto; requieren validación profesional antes de presentarse como guía de entrenamiento.
- Faltan definir y validar los otros cuatro días de fuerza.
- No hay backup: limpiar el navegador o cambiar de dispositivo elimina el historial local.
- Faltan assets anatómicos o de ejecución con licencia y atribución verificables.

## Próximos pasos recomendados

1. Validar `Pecho + bíceps`, cues y mensajes de seguridad con un profesional.
2. Documentar las otras cuatro rutinas antes de habilitarlas.
3. Hacer una prueba personal de uso durante una semana y registrar fricciones reales.
4. Recién después decidir si hacen falta PWA/offline completo, sincronización o backend.
