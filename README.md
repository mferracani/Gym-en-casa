# Entrena Casa

Aplicación web mobile-first para acompañar entrenamiento de fuerza en casa. El MVP funciona de punta a punta en el navegador: planificación semanal, sesión guiada, registro de series, historial, progreso y perfil de equipamiento.

Los datos se guardan en `localStorage` y no se sincronizan entre dispositivos. La única rutina publicada es `Pecho + bíceps`; el resto de los días de fuerza queda marcado como contenido pendiente hasta contar con una definición validada.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

## Verificación

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Recorridos disponibles

- `/`: rutina y estado real de hoy.
- `/entrenar`: sesión guiada, peso, repeticiones, pausa, retoma, resumen y cierre.
- `/semana`: agenda recurrente editable de lunes a domingo.
- `/progreso`: historial y métricas reconciliables por sesión y ejercicio.
- `/perfil`: nombre, inventario de equipo, restricción sin rack y reinicio local en dos pasos.

## Documentación

- `docs/product-brief.md`
- `docs/functional-mvp.md`
- `docs/rutina-v1.md`
- `docs/contenido-ejercicios.md`
- `docs/asset-attributions.md`
- `docs/current-state.md`

La referencia visual vive en `design/mock-home.png` y no se sirve como asset de producto.
