# Current State

## Fase

MVP funcional local-first completado; conexión MCP pública para ChatGPT
implementada y verificada localmente el 23 de agosto de 2026.

## Architecture & Stack

- Next.js 16 con App Router, React 19 y TypeScript estricto.
- Tailwind CSS 4 para tokens globales y CSS Modules por superficie funcional.
- Phosphor Icons como única librería visual de producción.
- Catálogo, rutina y agenda seed tipados en `src/data/`.
- Dominio puro en `src/domain/training/`: restricciones de equipo, sesiones, calendario, selectores y progreso.
- Estado React con reducer y provider en `src/state/training/`.
- Planificador diario determinístico en `src/domain/training/daily-plan.ts`: rota
  secciones por historial, respeta una ventana de recuperación de 48 horas,
  equipo disponible y plantillas editoriales existentes.
- Persistencia `localStorage` mediante envelope versionado `v1`, validación manual, recuperación ante datos corruptos y migración desde `v0`.
- Agent Bridge MCP opcional y sólo local en `agent-bridge/`; expone herramientas
  acotadas para OpenClaw u otro cliente MCP y deriva toda propuesta al motor de
  la app. Sin API de modelos, backend remoto, autenticación, Supabase, analítica
  ni sincronización entre dispositivos.
- El comando de desarrollo enlaza Next a `127.0.0.1`; las rutas del puente se
  deshabilitan fuera de desarrollo y el MCP rechaza hosts no-loopback.
- MCP público stateless en `/mcp`: publica sólo catálogo, una base editorial y
  enlaces de propuesta Ed25519 con 15 minutos de vigencia. No importa el store
  del bridge, no lee datos personales y no conserva estado en Vercel.
- La app verifica la firma del enlace en el navegador y genera el plan con su
  historial y equipo locales. Abrir el enlace no guarda ni inicia una sesión.

## Producto implementado

- `Hoy`: fecha real, estado semanal derivado, mapa muscular, resumen visual de la rutina asignada, inicio, retoma y acceso a progreso luego del cierre. Incluye una sugerencia local configurable por sección, con 4–5 ejercicios, carga avanzada controlada, RIR y progresión explícita.
- `Ejercicios`: biblioteca editable por `Pecho + bíceps`, `Espalda + tríceps`, `Hombros` y `Abdominales`; permite combinar ejercicios dentro de la sección activa, aplicar una sugerencia con confirmación visible y empezar una sesión respetando el orden de agregado. Si ya hay una sesión activa, la acción principal permite retomarla.
- `Sesión guiada`: un ejercicio por vez con su secuencia visual, peso opcional en kg, repeticiones, registro/reapertura de series, pausa, navegación, confirmación de descarte, resumen y cierre. Los 14 ejercicios derivados del video de hombros, los 8 de pecho, los 8 de espalda y los 10 de abdominales incluyen `Ver movimiento` con su segmento de YouTube.
- `Semana`: agenda recurrente editable; cada día admite cualquiera de los presets publicados, recuperación, descanso o contenido pendiente.
- `Progreso`: historial de sesiones, series, repeticiones, volumen, último registro y máximo peso por ejercicio.
- `Perfil`: nombre, inventario de equipo, advertencia sin rack, aviso de almacenamiento local y restablecimiento en dos pasos.
- Navegación real entre `Hoy`, `Semana`, `Ejercicios` y `Progreso`; `Perfil` permanece disponible en `/perfil`.

## Decisiones tomadas

- El MVP es local-first: ningún servicio remoto es necesario para validar el ciclo de uso personal.
- “Sugerencia inteligente” no simula una IA: es un motor local determinístico,
  no usa API key y no genera costo adicional.
- ChatGPT/OpenClaw no pueden iniciar ni sobrescribir una sesión de forma
  silenciosa. El puente sólo deja una propuesta; el usuario la acepta o rechaza
  en `Hoy`.
- El MCP público permanece anónimo porque sus tres herramientas son de lectura
  y no exponen datos privados. `queue_workout_proposal` conserva su nombre por
  compatibilidad, pero sólo crea un enlace firmado; no encola una escritura.
- La clave Ed25519 privada vive únicamente en el entorno de despliegue. No es
  una API key de OpenAI y no se commitea; la clave pública vive en la app.
- Una sesión guarda un snapshot de la rutina al comenzar; cambios posteriores de agenda o catálogo no reescriben el historial.
- Sólo las series `completed` cuentan en métricas y volumen.
- La agenda inicial conserva su seed, pero el usuario puede asignar cualquier preset publicado a cualquier día.
- No se implementa temporizador: el descanso se muestra como referencia editorial.
- No se implementa PWA todavía: faltan íconos aprobados y un service worker correctamente versionado para prometer offline completo.
- Los assets fueron generados para el proyecto y centralizados mediante un mapping tipado; el press con barra que requiere rack queda fuera de la biblioteca editable.
- Los videos fuente no se publican dentro del producto: el movimiento se reproduce con `youtube-nocookie.com`, sin autoplay, usando segmentos editoriales medidos.
- Los 14 movimientos son opciones. El preset sugerido de hombros usa cuatro patrones complementarios y excluye el remo vertical y las variantes frontales redundantes.
- Los 8 movimientos de pecho también son opciones. Su preset sugerido conserva bíceps, prioriza presses estables y deja fuera las variantes declinada, combinadas y asimétricas.
- Los 8 movimientos de espalda son opciones dentro de `Espalda + tríceps`. El
  preset sugerido combina tres patrones de espalda con dos ejercicios de
  tríceps; no acumula las variantes de agarre ni ambos encogimientos.
- Los 10 movimientos de abdominales son opciones sin equipamiento. El preset
  sugerido usa cuatro movimientos dinámicos; las planchas estáticas quedan
  disponibles, pero fuera del preset hasta soportar series medidas por tiempo.

## Verificación

- `npm test`: 80 tests en verde, incluyendo planificación diaria, validación del
  puente local, MCP stateless, control de orígenes, firma y vencimiento de
  propuestas.
- `npm run lint`: sin errores ni warnings.
- `npm run typecheck`: TypeScript estricto en verde.
- `npm run build`: build de producción exitoso con webpack; seis rutas de
  producto estáticas, `_not-found`, cuatro handlers dinámicos locales para el
  Agent Bridge y `/mcp` dinámico.
- QA de flujo: iniciar → registrar `10 × 12,5 kg` → recargar → retomar → revisar → cerrar → reconciliar `125 kg` en Progreso.
- QA de Semana: editar, guardar, recargar y restaurar un día; se corrigió el solapamiento de acciones sticky con la navegación inferior.
- QA de Perfil: guardar nombre, recargar y restaurar; feedback de éxito visible.
- QA responsive: `320 × 568`, `390 × 844` y `1280 × 900`, sin overflow horizontal.
- Consola verificada en una pestaña nueva sin warnings ni errores.
- QA de sugerencia diaria: selección de Hombros en `390 × 844`, 4 ejercicios,
  12 series, 42 minutos y RIR 3, sin overflow horizontal ni superposición del
  CTA con la navegación.
- QA MCP real: listado de 4 herramientas, lectura de contexto, sugerencia de
  Espalda + tríceps y propuesta de Abdominales visible como `Propuesta de
  OpenClaw`; la propuesta de prueba fue rechazada y un origen externo recibió
  `403`.
- QA MCP público real: handshake `2025-11-25`, listado exclusivo de tres
  herramientas read-only y enlace firmado de Hombros. En `390 × 844`, la app
  mostró 4 ejercicios, 12 series, 42 minutos y RIR 3 con el mensaje explícito
  de que todavía no guardó ni inició nada.
- QA de Espalda: 11 opciones visibles, 8 movimientos ordenados como el video,
  sugerencia funcional de 5 ejercicios, 11 imágenes cargadas y clips extremos
  verificados en `0–34 s` y `155–181 s`.
- QA de Abdominales: 14 opciones visibles, 10 movimientos ordenados como el
  video, sugerencia funcional de 4 ejercicios, 10 láminas nuevas y clips
  extremos verificados en `10–34 s` y `219–247 s`.
- Evidencia y criterios visuales: `design-qa.md`.

## Riesgos y pendientes

- La rutina y las indicaciones siguen siendo contenido de producto; requieren validación profesional antes de presentarse como guía de entrenamiento.
- El nivel “base avanzada” regula volumen y RIR, pero no convierte la app en un
  personal trainer certificado ni contempla lesiones, dolor o condiciones de
  salud.
- El catálogo todavía no incluye piernas; por eso el motor no puede prometer un
  plan corporal completo y lo advierte en cada sugerencia.
- El catálogo ya está integrado al flujo funcional, pero todavía necesita
  validación profesional de técnica, cues y agrupaciones.
- La sesión personalizada no se guarda aún como preset reutilizable ni puede
  asignarse a un día; la semana permite asignar sólo los presets publicados.
- No hay backup: limpiar el navegador o cambiar de dispositivo elimina el historial local.
- ChatGPT no recibe historial ni equipo local: debe pedir una sección explícita.
  La personalización final ocurre recién al abrir el enlace en la app.
- Si `ENTRENA_CASA_PUBLIC_APP_URL` apunta a `localhost`, la Mac y la app local
  deben estar encendidas para abrir la propuesta. Un deploy completo de la app
  usa otro origen y, por diseño, otro `localStorage`.
- Rotar la clave de firma invalida enlaces pendientes y exige desplegar juntos
  la nueva clave pública de la app y la privada del servidor.
- Los assets generados requieren revisión de similitud y validación biomecánica profesional antes de una publicación externa.

## Próximos pasos recomendados

1. Aprobar, reemplazar o descartar las nuevas láminas del catálogo integrado.
2. Validar técnica, cues, agrupación y mensajes de seguridad con un profesional.
3. Hacer una prueba personal de uso durante una semana y registrar fricciones reales.
4. Decidir si vale la pena guardar rutinas generadas como presets y asignarlas a días; en
   ese caso, versionar y migrar explícitamente el almacenamiento local.
5. Desplegar `/mcp` en una URL HTTPS estable, cargar la clave privada en Vercel
   y registrar el endpoint en ChatGPT Developer Mode.
6. Mantener el bridge con contexto personal únicamente en loopback; no publicarlo.
7. Recién después decidir si hacen falta PWA/offline completo, sincronización o backend.
