export function discreteConvolution(x, h) {
  const outputLength = x.length + h.length - 1;
  const y = new Array(outputLength).fill(0);

  for (let n = 0; n < outputLength; n += 1) {
    for (let k = 0; k < x.length; k += 1) {
      const hk = n - k;
      if (hk >= 0 && hk < h.length) {
        y[n] += x[k] * h[hk];
      }
    }
  }

  return y;
}