export function generateSine({ amplitude = 1, frequency = 1, samples = 16 }) {
  return Array.from({ length: samples }, (_, index) => {
    const t = index / samples;
    return amplitude * Math.sin(2 * Math.PI * frequency * t);
  });
}

export function evenPart(signal) {
  return signal.map((value, index) => {
    const mirrored = signal[signal.length - 1 - index] ?? 0;
    return 0.5 * (value + mirrored);
  });
}

export function oddPart(signal) {
  return signal.map((value, index) => {
    const mirrored = signal[signal.length - 1 - index] ?? 0;
    return 0.5 * (value - mirrored);
  });
}