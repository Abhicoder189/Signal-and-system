import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const kAxis = Array.from({ length: 21 }, (_, index) => index - 10);
const nAxis = Array.from({ length: 41 }, (_, index) => index - 20);

function x(k) {
  return Math.max(0, 1 - Math.abs(k) / 4);
}

function h(k) {
  return k >= 0 ? Math.exp(-k / 3) : 0;
}

function ConvolutionVisualizer() {
  const [n, setN] = useState(0);

  const { signal, shiftedKernel, product, output, yAtN } = useMemo(() => {
    const signalValues = kAxis.map((k) => x(k));
    const shiftedKernelValues = kAxis.map((k) => h(n - k));
    const pointwiseProduct = kAxis.map((k, index) => signalValues[index] * shiftedKernelValues[index]);
    const yValue = pointwiseProduct.reduce((sum, value) => sum + value, 0);

    const outputValues = nAxis.map((indexN) =>
      kAxis.reduce((sum, k) => {
        return sum + x(k) * h(indexN - k);
      }, 0)
    );

    return {
      signal: signalValues,
      shiftedKernel: shiftedKernelValues,
      product: pointwiseProduct,
      output: outputValues,
      yAtN: yValue
    };
  }, [n]);

  return (
    <article className="module-card">
      <h3>Convolution Visualizer</h3>
      <p className="module-caption">
        y[n] = sum x[k] h[n-k]. Move n to observe overlap and accumulation.
      </p>

      <div className="module-controls">
        <label>
          Output index n
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={n}
            onChange={(event) => setN(Number(event.target.value))}
          />
          <span className="value-badge">{n}</span>
        </label>
      </div>

      <p className="module-caption">Current convolution value y[{n}] = {yAtN.toFixed(4)}</p>

      <ModulePlot
        title="Flip + Shift + Multiply"
        xTitle="k"
        yTitle="Amplitude"
        data={[
          {
            x: kAxis,
            y: signal,
            type: "scatter",
            mode: "lines+markers",
            name: "x[k]",
            line: { color: "#122027", width: 2 }
          },
          {
            x: kAxis,
            y: shiftedKernel,
            type: "scatter",
            mode: "lines+markers",
            name: "h[n-k]",
            line: { color: "#ce5a2f", width: 2 }
          },
          {
            x: kAxis,
            y: product,
            type: "bar",
            name: "x[k]h[n-k]",
            marker: { color: "#2f7f8f", opacity: 0.6 }
          }
        ]}
      />

      <ModulePlot
        title="Output y[n]"
        xTitle="n"
        yTitle="y[n]"
        showLegend={false}
        data={[
          {
            x: nAxis,
            y: output,
            type: "scatter",
            mode: "lines+markers",
            line: { color: "#122027", width: 2 }
          },
          {
            x: [n],
            y: [yAtN],
            type: "scatter",
            mode: "markers",
            marker: { color: "#ce5a2f", size: 10 }
          }
        ]}
      />
    </article>
  );
}

export default ConvolutionVisualizer;