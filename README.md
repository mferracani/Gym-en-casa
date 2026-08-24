# Entrena Casa

Aplicación web mobile-first para acompañar entrenamiento de fuerza en casa. El MVP funciona de punta a punta en el navegador: planificación semanal, sesión guiada, registro de series, historial, progreso y perfil de equipamiento.

Los datos se guardan primero en `localStorage`. Si configurás Firebase Spark y
conectás tu cuenta de Google desde `Perfil`, la app mantiene además una copia
remota para recuperar y sincronizar el entrenamiento entre dispositivos. La
biblioteca permite elegir ejercicios por sección y ofrece presets editables de
`Pecho + bíceps`, `Espalda + tríceps`, `Hombros` y `Abdominales`; la agenda no
impone un grupo muscular fijo por día.

Los ejercicios derivados de los videos de referencia conservan su orden,
lámina anatómica propia y un acceso al tramo exacto del movimiento en YouTube.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí http://localhost:3000.

## Sugerencia local y conexión con agentes

`Hoy` incluye un planificador determinístico que usa el historial local, el
equipo disponible y plantillas del catálogo. No llama a una API de IA ni tiene
costo por generación.

Para conectar un cliente MCP local como OpenClaw:

```bash
npm run agent:install
npm run agent:start
```

El puente queda en `http://127.0.0.1:8787/mcp`. Las propuestas externas siempre
requieren confirmación dentro de la app. Configuración y límites:
`docs/agent-bridge.md`.

Para ChatGPT alojado, la aplicación incluye además `/mcp`: un endpoint público
stateless que puede desplegarse en Vercel. Sólo publica catálogo y propuestas
editoriales; no accede al historial local. La propuesta llega como un enlace
firmado y temporal y recién crea una sesión después de `Usar esta rutina`.

El deploy requiere una clave Ed25519 propia en
`ENTRENA_CASA_PROPOSAL_SIGNING_KEY`. Esa clave sólo firma enlaces: no es una API
key de OpenAI y no produce consumo de modelos. El destino se configura con
`ENTRENA_CASA_PUBLIC_APP_URL` y puede seguir siendo `http://localhost:3000/`
para uso personal en la misma Mac.

## Verificación

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Sincronización opcional

La configuración de Firebase, el modelo de datos y el despliegue de reglas se
documentan en `docs/firebase-sync.md`. La app no necesita Firebase para abrir,
entrenar ni conservar datos en el navegador.

## Recorridos disponibles

- `/`: rutina y estado real de hoy.
- `/entrenar`: sesión guiada, peso, repeticiones, pausa, retoma, resumen y cierre.
- `/ejercicios`: catálogo por sección, sugerencias y selección libre en el orden elegido.
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
- `docs/agent-bridge.md`
- `docs/firebase-sync.md`

La referencia visual vive en `design/mock-home.png` y no se sirve como asset de producto.
