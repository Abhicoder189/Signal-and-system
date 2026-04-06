export function dft(signal) {
  const n = signal.length;

  return Array.from({ length: n }, (_, k) => {
    let real = 0;
    let imag = 0;

    for (let m = 0; m < n; m += 1) {
      const angle = (-2 * Math.PI * k * m) / n;
      real += signal[m] * Math.cos(angle);
      imag += signal[m] * Math.sin(angle);
    }

    return { real, imag, magnitude: Math.hypot(real, imag) };
  });
}