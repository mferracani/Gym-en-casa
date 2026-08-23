# Entrena Casa — MVP funcional local-first

## Decisión de producto

El primer MVP funcional completa el ciclo de entrenamiento sin backend: el usuario ve qué le toca, inicia una sesión, registra series, repeticiones y peso, la cierra y consulta su semana y progreso. Los datos se guardan únicamente en el navegador mediante almacenamiento local.

No se incorpora autenticación, Supabase, APIs remotas ni sincronización entre dispositivos. La persistencia local es necesaria para que el registro conserve valor al recargar; no constituye una base de datos de producto ni ofrece recuperación fuera de ese navegador.

## Hipótesis

Si una persona que retoma fuerza puede abrir la rutina que le corresponde, recorrerla de forma segura según su equipo y registrar sus series sin fricción, podrá empezar con menos improvisación y volver a entrenar con una referencia concreta de lo que hizo.

## Alcance

| Área | Ruta | Resultado esperado |
| --- | --- | --- |
| Hoy | `/` | Ver fecha real, rutina disponible, seguridad, estado semanal y CTA contextual. |
| Sugerencia diaria | `/` | Elegir una sección o pedir una recomendación local y revisar el plan antes de iniciar. |
| Sesión activa | `/entrenar` | Recorrer ejercicios y registrar peso y repeticiones por serie. |
| Semana | `/semana` | Consultar los siete días y distinguir pendiente, en curso, completado, descanso o contenido pendiente. |
| Progreso | `/progreso` | Consultar sesiones cerradas y evolución descriptiva por ejercicio. |
| Perfil local | `/perfil` | Revisar equipo, definir nombre opcional y borrar los datos locales de forma segura. |

La navegación principal debe llevar a rutas reales; no quedan tabs simulados o bloqueados cuando su destino está incluido en el MVP.

## Journey principal

1. La persona abre `Hoy` y entiende qué entrenamiento puede hacer, cuánto dura y qué restricción de seguridad aplica.
2. Toca `Empezar entrenamiento` o `Retomar entrenamiento`.
3. Recorre los ejercicios en orden, con equipo requerido, objetivo de series y repeticiones, descanso de referencia y nota editorial disponible.
4. Registra peso en kg y repeticiones realizadas por serie.
5. La app conserva cada registro localmente a medida que avanza.
6. Revisa el resumen y confirma el cierre de la sesión.
7. La sesión actualiza los estados de `Hoy`, `Semana` y `Progreso`.
8. Si recarga o sale antes de cerrar, puede retomar la sesión pendiente en ese mismo navegador.

## Requisitos y criterios de aceptación

### Hoy

- La fecha se calcula en `es-AR` y con la zona horaria de Argentina; no queda una fecha mock fija.
- Muestra el estado real de la rutina: disponible, en curso, completada, descanso o contenido pendiente.
- El CTA refleja ese estado: iniciar, retomar o ver resumen.
- La semana no muestra días completados si no existen registros locales que lo respalden.
- La adaptación y la restricción por falta de rack permanecen visibles.
- Permite elegir `Pecho + bíceps`, `Espalda + tríceps`, `Hombros`,
  `Abdominales` o pedir una sección recomendada.
- La recomendación usa sólo historial, equipo y plantillas locales. Informa RIR,
  volumen, progresión y límites sin presentarse como diagnóstico profesional.
- Una propuesta externa de ChatGPT/OpenClaw requiere aceptación explícita antes
  de convertirse en sesión.

### Sesión activa

- Muestra el ejercicio actual, su posición dentro de la rutina y las series completadas.
- Cada serie permite cargar peso en kg y repeticiones realizadas; los valores no pueden ser negativos ni inválidos.
- El peso admite decimales y puede omitirse para no bloquear el primer uso; el resumen identifica el dato faltante.
- Se pueden registrar repeticiones diferentes del objetivo sin tratarlas como error.
- Cada actualización relevante se conserva localmente y una sesión en curso puede retomarse luego de recargar.
- Abandonar una sesión con datos requiere confirmación.
- Cerrar una sesión requiere revisión y confirmación explícita.
- Los ejercicios de pecho mantienen visible que, sin rack, el press con barra no es la opción predeterminada.

### Semana

- La vista representa de lunes a domingo la semana que contiene la fecha actual.
- Cada estado deriva de la planificación y de las sesiones locales, no de completados mock.
- Permite abrir la rutina disponible o consultar el resumen de una sesión cerrada.
- No habilita el inicio de una rutina cuyo contenido no está definido.

### Progreso

- Incluye un estado vacío honesto antes de la primera sesión cerrada.
- Lista historial de sesiones con fecha, rutina, series realizadas y duración registrada o estimada.
- Por ejercicio muestra último peso, último registro de repeticiones y mayor peso sólo si existen datos suficientes.
- El volumen, cuando se muestre, se calcula como `peso × repeticiones` y puede reconciliarse con cada serie guardada.
- No interpreta rendimiento ni recomienda aumentos de carga.

### Perfil local

- Permite definir un nombre opcional para el saludo y revisar el equipo disponible.
- Explica que la información se guarda sólo en este navegador y dispositivo.
- El borrado de datos locales exige confirmación de dos pasos y devuelve la app a un estado vacío consistente.

### Calidad transversal

- Prioridad de diseño en 390 × 844 px y adaptación deliberada a escritorio.
- Navegación por teclado, foco visible, contraste AA y objetivos táctiles de al menos 44 × 44 px.
- Respeto por `prefers-reduced-motion`.
- Estados vacíos, de hidratación y de fallo de almacenamiento local comprensibles.
- Datos de rutina centralizados y tipados; los componentes no duplican contenido de ejercicios.

## Datos locales mínimos

- `RoutineDefinition`: rutina, ejercicios, objetivos y restricciones.
- `ExerciseDefinition`: equipo, músculos, descanso y nota editorial.
- `WeeklySchedule`: asignación de rutina o descanso por día.
- `ActiveSession`: rutina iniciada, ejercicio actual y series cargadas.
- `CompletedSession`: sesión cerrada, fecha, duración y registros de serie.
- `LocalProfile`: nombre opcional y equipo.
- `LocalStoreV1`: versión de esquema para poder validar, migrar o reiniciar el almacenamiento con claridad.

El acceso a almacenamiento local debe ocurrir sólo del lado cliente y manejar una hidratación segura. No hay sincronización, backup ni recuperación de datos fuera del navegador actual.

## Decisiones tomadas para este MVP

- Usar almacenamiento local versionado y no agregar dependencias de producción.
- Mantener Next.js App Router, TypeScript estricto, Tailwind y Phosphor Icons.
- Reemplazar fechas y estados de completado estáticos por estados derivados de fecha y logs locales.
- Usar kg como unidad única; admitir decimales.
- Mostrar el descanso como referencia, sin temporizador en esta etapa.
- Sugerir progresión sólo mediante una regla conservadora y verificable: subir
  la carga mínima después de dos sesiones con técnica estable y el RIR objetivo.
  No recomendar un peso concreto, entrenar con dolor ni diagnosticar salud.
- Registrar cada imagen publicada en `docs/asset-attributions.md` y no incorporar
  recursos de terceros sin licencia verificable.
- No permitir edición retroactiva de sesiones cerradas en el MVP.

## Riesgos y decisiones pendientes

| Riesgo o decisión | Impacto | Resolución requerida |
| --- | --- | --- |
| El catálogo cubre torso y abdominales, pero no piernas. | No permite prometer un plan corporal completo. | Mantener la advertencia visible y validar una sección de piernas antes de incorporarla al motor. |
| Las indicaciones actuales son contenido mock. | No se debe presentar la app como reemplazo de un profesional. | Validar rutina, cues y mensajes con un profesional antes de uso real. |
| “Progreso” puede interpretarse como recomendación de sobrecarga. | Riesgo de sugerencias no validadas. | Limitar el MVP a historial y métricas descriptivas reconciliables con los logs. |
| Los datos viven en un solo navegador. | Se pueden perder al limpiar datos o cambiar de dispositivo. | Informar el límite y postergar sincronización hasta que exista una necesidad demostrada. |

## Fuera de alcance

- Autenticación, cuentas, backend remoto, Supabase y sincronización entre dispositivos.
- Integraciones con Apple Health, wearables, calendario o notificaciones.
- Temporizador, cronómetro, música o cámara.
- Modelos generativos dentro de la app, API keys pagas o ejecución autónoma sin
  confirmación del usuario.
- Recomendaciones de peso concreto, diagnóstico o prescripción ante dolor.
- Diagnóstico médico, tratamiento, consejos ante dolor o prescripción de entrenamiento.
- Edición de rutinas, planes completos o sesiones históricas.
- Social, rankings, desafíos, gamificación o pagos.
- Assets de ejercicios sin fuente, licencia y atribución verificables.
- Analítica remota: con datos exclusivamente locales no se mide adopción agregada.

## Criterios de release

- El usuario puede iniciar, registrar, abandonar con confirmación, retomar y cerrar la rutina disponible sin perder datos tras recargar.
- Los estados de `Hoy`, `Semana` y `Progreso` coinciden con los registros de series locales.
- No hay completados simulados desde mocks ni se habilitan rutinas sin contenido definido.
- La restricción por falta de rack sigue visible y el press de pecho con barra no se ofrece como predeterminado.
- Los estados vacío, de almacenamiento no disponible y de reinicio de datos son claros y recuperables.
- Tests, lint, typecheck y build quedan en verde antes de declarar el MVP verificado.
- El puente MCP escucha sólo en loopback, rechaza orígenes web no confiables y
  no se publica sin autenticación.
- Se realiza QA visual y de accesibilidad en 390 × 844 px y escritorio antes de la salida local.

## Secuencia de implementación

1. Normalizar modelos, fecha relativa y almacenamiento local versionado.
2. Implementar sesión activa con registro incremental, abandono, retoma y cierre.
3. Conectar `Hoy` al estado real y eliminar el CTA placeholder.
4. Crear `Semana` y `Progreso` a partir de los mismos registros.
5. Incorporar el perfil local mínimo y el reinicio seguro.
6. Agregar tests de calendario, almacenamiento, cálculos y restricciones; realizar QA visual y de accesibilidad.

## Estado de release local — 22 de agosto de 2026

- Implementación funcional completada para las cinco superficies y el flujo principal.
- Persistencia y retoma verificadas tras recarga.
- Semana y Progreso reconciliados con los mismos logs de sesión.
- Restricciones de equipo y falta de rack aplicadas en dominio y experiencia.
- Tests, lint, typecheck y build en verde.
- QA responsive y de consola completado; detalle en `design-qa.md`.

El MVP queda listo para uso local personal. No implica validación profesional del contenido ni despliegue productivo.
