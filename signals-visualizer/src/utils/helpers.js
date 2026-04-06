export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits);
}