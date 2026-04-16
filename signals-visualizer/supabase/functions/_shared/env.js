export function requireEnv(name) {
  const value = Deno.env.get(name);
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    throw new Error(`Missing required env variable: ${name}`);
  }

  if (normalized.toLowerCase().startsWith("your_")) {
    throw new Error(`Invalid placeholder value for env variable: ${name}`);
  }

  return normalized;
}

export function getEnv(name, fallback) {
  const value = Deno.env.get(name);
  if (value === undefined || value === null || value.length === 0) {
    return fallback;
  }

  return value;
}
