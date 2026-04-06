import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const nAxis = Array.from({ length: 41 }, (_, index) => index - 20);

function inputSignal(n) {
  return Math.cos(0.35 * n) + (n === 0 ? 0.8 : 0);
}

function applySystem(type, n, inputAt) {
  if (type === "time-varying") {
    return n * inputAt(n);
  }

  return inputAt(n - 2);
}

function TimeInvariance() {
  const [shift, setShift] = useState(3);
  const [systemType, setSystemType] = useState("invariant");

  const { lhs, rhs, mismatch } = useMemo(() => {
    const shiftedInput = (n) => inputSignal(n - shift);
    const originalOutput = (n) => applySystem(systemType, n, inputSignal);

    const lhsValues = nAxis.map((n) => applySystem(systemType, n, shiftedInput));
    const rhsValues = nAxis.map((n) => originalOutput(n - shift));
    const maxError = Math.max(...lhsValues.map((value, index) => Math.abs(value - rhsValues[index])));

    return {
      lhs: lhsValues,
      rhs: rhsValues,
      mismatch: maxError
    };
  }, [shift, systemType]);

  return (
    <article className="module-card">
      <h3>Time Invariance Checker</h3>
      <p className="module-caption">
        Compare T[x[n-n0]] (LHS) with y[n-n0] (RHS). Invariant systems produce identical traces.
      </p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            System Type
            <select value={systemType} onChange={(event) => setSystemType(event.target.value)}>
              <option value="invariant">T(x[n]) = x[n-2]</option>
              <option value="time-varying">T(x[n]) = n x[n]</option>
            </select>
          </label>

          <label>
            Shift n0
            <input
              type="range"
              min="-8"
              max="8"
              step="1"
              value={shift}
              onChange={(event) => setShift(Number(event.target.value))}
            />
            <span className="value-badge">{shift}</span>
          </label>
        </div>
      </div>

      <p className="module-caption">Mismatch norm: {mismatch.toExponential(2)}</p>

      <ModulePlot
        title="Time-Invariance Test"
        xTitle="n"
        yTitle="Output"
        data={[
          {
            x: nAxis,
            y: lhs,
            type: "scatter",
            mode: "lines",
            name: "LHS: T[x[n-n0]]",
            line: { color: "#ce5a2f", width: 2 }
          },
          {
            x: nAxis,
            y: rhs,
            type: "scatter",
            mode: "lines",
            name: "RHS: y[n-n0]",
            line: { color: "#2f7f8f", width: 2, dash: "dot" }
          }
        ]}
      />
    </article>
  );
}

export default TimeInvariance;