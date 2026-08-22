# Entrena Casa — Product brief

## Problema

Una persona que retoma el entrenamiento después de una pausa necesita saber qué hacer cada día, seguir una rutina segura con el equipo disponible y registrar su evolución sin enfrentarse a una interfaz compleja.

## Usuario inicial

- Retoma actividad luego de bastante tiempo sin entrenar.
- Busca moverse todos los días y hacer fuerza cinco veces por semana durante unos 60 minutos.
- Entrena en casa con mancuernas, barra con discos y banco plano/inclinable.
- No tiene rack.
- Elige manualmente el peso de cada ejercicio.

## Job to be done

Cuando voy a entrenar en casa, quiero ver de inmediato la rutina que me corresponde y sus límites de seguridad, para empezar sin improvisar y sostener el hábito semana a semana.

## Objetivo del producto

Permitir que el usuario:

- sepa qué entrenamiento corresponde hoy;
- siga ejercicios en orden;
- registre series, repeticiones y peso;
- entienda qué músculos trabaja;
- consulte la semana, el historial y su evolución.

## Sprint 1

Implementar únicamente la pantalla `Hoy` con:

- fecha y saludo;
- entrenamiento `Pecho + bíceps`;
- duración de 60 minutos y cinco ejercicios;
- esquema 3 × 10;
- resumen muscular;
- semana de lunes a domingo;
- mensaje de adaptación;
- restricción visible por falta de rack;
- CTA `Empezar entrenamiento`;
- navegación preparada para Hoy, Semana, Progreso y Perfil.

## Decisión de MVP funcional local-first

El Sprint 1 queda como base visual de `Hoy`. El siguiente alcance es un MVP funcional local-first que permite completar el ciclo `Hoy → sesión activa → registro → cierre → Semana/Progreso`.

- La sesión activa permite registrar peso en kg y repeticiones por serie, abandonar con confirmación, retomar tras recargar y cerrar una sesión.
- El historial, la semana y el progreso se derivan de esos registros locales; los datos se guardan sólo en el navegador y dispositivo actual.
- La navegación incluye destinos reales para `Hoy`, `Semana`, `Progreso` y `Perfil`; el perfil queda limitado a nombre opcional, equipo y reinicio seguro de datos locales.
- La falta de rack sigue siendo una restricción visible y el press de pecho con barra no se habilita como opción predeterminada.
- No se implementan autenticación, Supabase, backend, APIs, sincronización entre dispositivos ni dependencias nuevas para este MVP.

El detalle de alcance, criterios, riesgos y release criteria vive en `docs/functional-mvp.md`.

## Fuera de alcance del MVP funcional

- temporizador, cronómetro, música, video, cámara o IA;
- recomendaciones de peso, progresión, recuperación, dolor o salud;
- rutinas generadas automáticamente, edición de planes o de sesiones históricas;
- integraciones con wearables, Apple Health, calendario o notificaciones;
- social, rankings, desafíos, gamificación o pagos;
- assets de ejercicios sin licencia y atribución verificables;
- analítica remota o despliegue productivo.

## Criterios de aceptación

- Correcto a 390 × 844 px y adaptable a escritorio.
- Jerarquía inspirada en `design/mock-home.png` sin publicar sus assets.
- Datos mock realistas, tipados y centralizados.
- Controles con hover, focus, active y disabled cuando corresponda.
- Navegable con teclado y sin errores de consola.
- Test, lint, typecheck y build exitosos.
