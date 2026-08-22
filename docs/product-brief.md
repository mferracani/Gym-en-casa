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

## Fuera de alcance

- sesión activa y temporizador;
- registro editable de series, repeticiones o peso;
- historial y métricas;
- persistencia local u offline;
- autenticación, Supabase y backend;
- despliegue productivo.

## Criterios de aceptación

- Correcto a 390 × 844 px y adaptable a escritorio.
- Jerarquía inspirada en `design/mock-home.png` sin publicar sus assets.
- Datos mock realistas, tipados y centralizados.
- Controles con hover, focus, active y disabled cuando corresponda.
- Navegable con teclado y sin errores de consola.
- Test, lint, typecheck y build exitosos.
