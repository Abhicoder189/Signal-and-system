export function requireEnv(name) {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }

  return value;
}

export function getEnv(name, fallback) {
  const value = Deno.env.get(name);
  if (value === undefined || value === null || value.length === 0) {
    return fallback;
  }

  return value;
}
