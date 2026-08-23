export function createEntrenaCasaClient({
  baseUrl = process.env.ENTRENA_CASA_URL ?? "http://localhost:3000",
  fetchImpl = fetch,
} = {}) {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  async function request(path, init) {
    const response = await fetchImpl(`${normalizedBaseUrl}${path}`, {
      ...init,
      headers: {
        "content-type": "application/json",
        ...init?.headers,
      },
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error ?? `Entrena Casa respondió ${response.status}.`);
    }

    return payload;
  }

  return {
    getContext: () => request("/api/agent/context"),
    getCatalog: () => request("/api/agent/catalog"),
    suggestWorkout: (input) =>
      request("/api/agent/suggestions", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    queueWorkout: (input) =>
      request("/api/agent/proposals", {
        method: "POST",
        body: JSON.stringify(input),
      }),
  };
}
