# Entrena Casa — reglas del repositorio

## Producto y alcance actual

- Aplicación web mobile-first para acompañar entrenamiento de fuerza en casa.
- El MVP funcional local-first incluye `Hoy`, sesión guiada, `Semana`, `Progreso` y `Perfil`.
- La única rutina editorial validada para el MVP es `Pecho + bíceps`; los demás días de fuerza deben mostrarse como contenido pendiente, sin inventar entrenamiento.
- Sesiones, historial, perfil y agenda se persisten con un esquema versionado en `localStorage`.
- No implementar autenticación, Supabase, backend, sincronización remota ni recomendaciones automáticas hasta que el alcance cambie explícitamente.
- Español de Argentina, tono directo y cercano.

## Stack

- Next.js con App Router.
- React y TypeScript estricto.
- Tailwind CSS 4.
- Phosphor Icons como única librería visual de producción.
- Catálogo y agenda tipados en `src/data/`, dominio puro en `src/domain/` y estado cliente en `src/state/`.

## Comandos obligatorios

```bash
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

Antes de cerrar un cambio funcional, ejecutar test, lint, typecheck y build.

## Criterios de implementación

- Prioridad absoluta a 390 × 844 px; mantener una adaptación de escritorio deliberada.
- No duplicar contenido de entrenamiento dentro de los componentes.
- Mantener navegación por teclado, foco visible, targets táctiles de al menos 44 × 44 px y contraste AA.
- Respetar `prefers-reduced-motion`.
- Evitar estética de dashboard empresarial, cards innecesarias y efectos decorativos sin función.
- La falta de rack es una restricción visible: no habilitar press de pecho con barra como opción predeterminada.
- Las sesiones cerradas son snapshots inmutables; Semana y Progreso deben derivar sus estados de los registros locales.
- Cualquier cambio del esquema persistido requiere versión, validación y pruebas de migración o recuperación.
- No agregar dependencias de producción sin explicar primero su necesidad.

## Assets y licencias

- `design/mock-home.png` es una referencia local; no se sirve desde `public/`.
- No copiar ni publicar ilustraciones anatómicas o de ejercicios sin licencia y atribución verificables.
- Todo asset futuro debe registrarse en `docs/asset-attributions.md`.
- Si no hay recurso aprobado, mostrar un estado pendiente honesto en lugar de inventar procedencia o licencia.

## Git

- No trabajar directamente sobre `main` para features.
- Commits chicos por pantalla, feature o fix.
- No commitear secretos, `.env*`, artefactos de build ni configuración específica de máquina.
- Preservar cambios ajenos al alcance.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
