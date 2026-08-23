# Entrena Casa — Agent Bridge local

## Alcance

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

## ChatGPT

El servidor cumple el contrato MCP `tool-only`. ChatGPT alojado necesita una
URL HTTPS pública para conectarse; `localhost` no es accesible desde sus
servidores. Antes de exponer este endpoint se debe agregar autenticación y una
política de acceso. Ese paso queda fuera de este alcance local para no abrir el
historial ni aceptar propuestas desde Internet sin control.
