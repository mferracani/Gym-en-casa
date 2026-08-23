const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

export function parseAllowedOrigins(value) {
  if (!value) return new Set(DEFAULT_ALLOWED_ORIGINS);

  return new Set(
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

export function isAllowedOrigin(origin, allowedOrigins) {
  return origin === undefined || allowedOrigins.has(origin);
}
