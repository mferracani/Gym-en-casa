# Entrena Casa — conexiones con agentes

## Bridge local para OpenClaw

El Agent Bridge permite que un cliente MCP local, como OpenClaw, consulte el
contexto reducido de Entrena Casa, lea el catálogo, sugiera una rutina y deje
una propuesta pendiente.

No usa la API de OpenAI, no consume modelos y no genera costos por llamada. La
app conserva `localStorage` como fuente de verdad. El puente no recibe el detalle
de pesos o series: sincroniza solamente equipo, sesión activa y fecha/sección de
las sesiones cerradas.

## Contrato de seguridad

- Next en desarrollo y el servidor MCP escuchan sólo en loopback
  (`127.0.0.1:3000` y `127.0.0.1:8787`).
- El proceso rechaza hosts que no sean loopback y orígenes web ajenos a la app.
- Las herramientas no agregan ejercicios fuera del catálogo ni habilitan press
  con barra sin rack.
- `queue_workout_proposal` es idempotente por `requestId`.
- Una propuesta nunca inicia una sesión. La persona debe revisarla y aceptar
  `Usar esta rutina` dentro de Entrena Casa.
- Las rutas internas del puente sólo se habilitan con `NODE_ENV=development` y
  pueden apagarse con `ENTRENA_CASA_AGENT_BRIDGE=disabled`.
- Las propuestas pendientes viven en memoria y se pierden al reiniciar el
  servidor; sesiones e historial continúan en `localStorage`.
- No se debe publicar ni tunelizar esta versión sin agregar autenticación.

## Ejecución local

Con Entrena Casa abierta en `http://localhost:3000`:

```bash
npm run agent:install
npm run agent:start
```

El endpoint MCP queda disponible en:

```text
http://127.0.0.1:8787/mcp
```

OpenClaw actual admite servidores MCP Streamable HTTP. Si ya lo tenés
instalado, registrá el puente y comprobá la conexión con:

```bash
openclaw mcp set entrena-casa '{"url":"http://127.0.0.1:8787/mcp","transport":"streamable-http","toolFilter":{"include":["get_training_context","list_training_catalog","suggest_workout","queue_workout_proposal"]}}'
openclaw mcp doctor entrena-casa --probe
```

La misma configuración, en formato declarativo, es:

```json
{
  "mcp": {
    "servers": {
      "entrena-casa": {
        "url": "http://127.0.0.1:8787/mcp",
        "transport": "streamable-http"
      }
    }
  }
}
```

## Herramientas

| Herramienta | Tipo | Resultado |
| --- | --- | --- |
| `get_training_context` | Lectura | Sesión activa, equipo e historial reducido. |
| `list_training_catalog` | Lectura | Secciones, ejercicios, músculos y límites actuales. |
| `suggest_workout` | Lectura | Plan diario calculado por el motor local. |
| `queue_workout_proposal` | Escritura reversible | Propuesta pendiente para confirmar en la app. |

## MCP público para ChatGPT

La ruta `/mcp` es una superficie separada, stateless y apta para un despliegue
HTTPS. No reutiliza el store del bridge local, no lee `localStorage`, no recibe
historial, perfil, pesos ni sesiones y no conserva estado entre requests.

Expone tres herramientas públicas:

| Herramienta | Tipo | Resultado |
| --- | --- | --- |
| `list_training_catalog` | Lectura | Catálogo editorial sin datos personales. |
| `suggest_workout` | Lectura | Base avanzada para una sección elegida explícitamente. |
| `queue_workout_proposal` | Lectura | Enlace firmado y temporal para revisar la propuesta en la app. |

Aunque mantiene el nombre `queue_workout_proposal` por compatibilidad, la
herramienta pública no encola ni escribe nada. El enlace contiene sólo la
sección, un `requestId` y una vigencia de 15 minutos. La app verifica la firma,
genera el plan con el historial y equipo locales y exige `Usar esta rutina`
antes de crear una sesión.

### Configuración del deploy

- `ENTRENA_CASA_PROPOSAL_SIGNING_KEY`: clave privada Ed25519 en formato PEM.
  Es un secreto de firma, no una API key de un modelo, y nunca se commitea.
- `ENTRENA_CASA_PUBLIC_APP_URL`: destino del enlace. Para uso personal desde la
  misma Mac puede ser `http://localhost:3000/`.
- `ENTRENA_CASA_MCP_ALLOWED_ORIGINS`: allowlist opcional, separada por comas,
  para herramientas web de desarrollo. Los clientes MCP server-to-server no
  envían `Origin`.

El endpoint no usa la API de OpenAI, Supabase, base de datos ni almacenamiento
de Vercel. Un enlace sin firma válida, alterado o vencido se rechaza y nunca
inicia una sesión.
