import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 321 }, (_, index) => -8 + (index * 16) / 320);

function sourceSignal(t, skew) {
  return Math.sin(1.2 * t) + 0.35 * Math.cos(0.7 * t) + 0.12 * skew * t;
}

function EvenOdd() {
  const [skew, setSkew] = useState(1);

  const { original, even, odd } = useMemo(() => {
    const originalSignal = timeAxis.map((t) => sourceSignal(t, skew));
    const evenSignal = timeAxis.map((t) => 0.5 * (sourceSignal(t, skew) + sourceSignal(-t, skew)));
    const oddSignal = timeAxis.map((t) => 0.5 * (sourceSignal(t, skew) - sourceSignal(-t, skew)));

    return {
      original: originalSignal,
      even: evenSignal,
      odd: oddSignal
    };
  }, [skew]);

  return (
    <article className="module-card">
      <h3>Even/Odd Decomposition</h3>
      <p className="module-caption">x(t) = x_e(t) + x_o(t), where x_e is symmetric and x_o is antisymmetric.</p>

      <div className="module-controls">
        <label>
          Asymmetry Factor
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={skew}
            onChange={(event) => setSkew(Number(event.target.value))}
          />
          <span className="value-badge">{skew.toFixed(1)}</span>
        </label>
      </div>

      <ModulePlot
        title="Original vs Even vs Odd"
        xTitle="t"
        yTitle="Amplitude"
        data={[
          {
            x: timeAxis,
            y: original,
            mode: "lines",
            type: "scatter",
            name: "x(t)",
            line: { color: "#122027", width: 2 }
          },
          {
            x: timeAxis,
            y: even,
            mode: "lines",
            type: "scatter",
            name: "x_e(t)",
            line: { color: "#ce5a2f", width: 2 }
          },
          {
            x: timeAxis,
            y: odd,
            mode: "lines",
            type: "scatter",
            name: "x_o(t)",
            line: { color: "#2f7f8f", width: 2 }
          }
        ]}
      />
    </article>
  );
}

export default EvenOdd;