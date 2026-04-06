import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const inputAxis = Array.from({ length: 13 }, (_, index) => index);
const impulseAxis = Array.from({ length: 13 }, (_, index) => index);

function LTI() {
  const [decay, setDecay] = useState(0.65);

  const { input, impulseResponse, outputAxis, output } = useMemo(() => {
    const inputSignal = inputAxis.map((n) => (n >= 2 && n <= 6 ? 1 : 0));
    const impulse = impulseAxis.map((n) => Math.pow(decay, n));

    const convolutionLength = inputSignal.length + impulse.length - 1;
    const result = new Array(convolutionLength).fill(0);

    for (let n = 0; n < convolutionLength; n += 1) {
      for (let k = 0; k < inputSignal.length; k += 1) {
        const hIndex = n - k;
        if (hIndex >= 0 && hIndex < impulse.length) {
          result[n] += inputSignal[k] * impulse[hIndex];
        }
      }
    }

    return {
      input: inputSignal,
      impulseResponse: impulse,
      outputAxis: Array.from({ length: convolutionLength }, (_, index) => index),
      output: result
    };
  }, [decay]);

  return (
    <article className="module-card">
      <h3>LTI System Response</h3>
      <p className="module-caption">Convolution y[n] = x[n] * h[n] for an exponential impulse response.</p>

      <div className="module-controls">
        <label>
          Impulse Decay alpha
          <input
            type="range"
            min="0.2"
            max="0.9"
            step="0.05"
            value={decay}
            onChange={(event) => setDecay(Number(event.target.value))}
          />
          <span className="value-badge">{decay.toFixed(2)}</span>
        </label>
      </div>

      <ModulePlot
        title="Input and Impulse Response"
        xTitle="n"
        yTitle="Amplitude"
        barmode="group"
        data={[
          {
            x: inputAxis,
            y: input,
            type: "bar",
            name: "x[n]",
            marker: { color: "#ce5a2f" }
          },
          {
            x: impulseAxis,
            y: impulseResponse,
            type: "bar",
            name: "h[n]",
            marker: { color: "#2f7f8f" }
          }
        ]}
      />

      <ModulePlot
        title="Output y[n]"
        xTitle="n"
        yTitle="Amplitude"
        showLegend={false}
        data={[
          {
            x: outputAxis,
            y: output,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "#122027" },
            line: { color: "#122027", width: 2 }
          }
        ]}
      />
    </article>
  );
}

export default LTI;