# Firebase Spark — sincronización de Entrena Casa

## Decisión

Entrena Casa usa Firebase Authentication y Cloud Firestore como copia remota
opcional. La app sigue funcionando sin Firebase y conserva `localStorage` para
respuesta inmediata y recuperación offline.

No se habilitan Cloud Functions, Firebase Storage, Firebase Hosting ni una
cuenta de facturación. El frontend continúa en Vercel y los assets siguen en
`public/`.

## Configuración web

Crear una app web dentro del proyecto Firebase y definir estas variables en el
entorno local y en Vercel:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
```

Son identificadores públicos del cliente Firebase. La seguridad no depende de
ocultarlos: depende de Firebase Authentication y `firestore.rules`. No
commitear `.env.local` ni credenciales de servicio.

En Firebase Authentication se debe habilitar Google y autorizar como mínimo:

- `localhost`
- el dominio de producción de Entrena Casa

## Modelo

```text
users/{uid}/state/current
users/{uid}/sessions/{sessionId}
```

- `state/current` guarda perfil, agenda, sesión activa, versión de esquema y
  fecha de actualización.
- Cada sesión terminada se guarda como snapshot inmutable separado.
- El historial nunca se incrusta completo en `state/current`, para no reescribir
  todos los entrenamientos en cada serie registrada.

## Reconciliación

- Navegador sin datos: importa la copia remota.
- Navegador y nube con datos: perfil, agenda y sesión activa se toman del
  snapshot más reciente.
- Los históricos se unen por `session.id` y se ordenan por `completedAt`.
- Una sesión ya cerrada no se modifica ni se elimina desde el cliente.
- Una configuración incompleta o una falla de red deja la app funcionando en
  modo local.
- El cliente reintenta al recuperar conectividad y también ofrece
  `Sincronizar ahora` en Perfil.
- El MVP asume un solo dispositivo activo durante una sesión. No hay edición
  colaborativa en tiempo real del perfil, agenda o sesión activa.

## Restablecimiento local

Si hay una cuenta conectada, la app cierra primero la sesión de Firebase y
recién después restablece el navegador. Esto evita que el estado inicial pise
la copia remota. Al volver a conectar Google, el historial remoto puede
recuperarse.

## Despliegue de reglas

Con el proyecto Firebase seleccionado:

```bash
firebase use <project-id>
firebase deploy --only firestore:rules
```

El plan debe permanecer en Spark. No vincular Cloud Billing ni habilitar
servicios que requieran Blaze.

## Pendientes operativos

- Activar App Check antes de abrir la aplicación a usuarios externos.
- Agregar exportación e importación JSON como backup portable.
- Probar reconciliación real entre dos navegadores antes de considerar la nube
  fuente principal.
