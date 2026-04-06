import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const nAxis = Array.from({ length: 21 }, (_, index) => index - 10);

function UnitSignals() {
  const [signalType, setSignalType] = useState("impulse");
  const [timeConstant, setTimeConstant] = useState(4);

  const values = useMemo(() => {
    return nAxis.map((n) => {
      if (signalType === "step") {
        return n >= 0 ? 1 : 0;
      }

      if (signalType === "ramp") {
        return n >= 0 ? n : 0;
      }

      if (signalType === "exp") {
        return n >= 0 ? Math.exp(-n / timeConstant) : 0;
      }

      return n === 0 ? 1 : 0;
    });
  }, [signalType, timeConstant]);

  return (
    <article className="module-card">
      <h3>Unit Signal Library</h3>
      <p className="module-caption">Discrete-time building blocks used for synthesis and system analysis.</p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            Signal
            <select value={signalType} onChange={(event) => setSignalType(event.target.value)}>
              <option value="impulse">Impulse delta[n]</option>
              <option value="step">Step u[n]</option>
              <option value="ramp">Ramp r[n]</option>
              <option value="exp">Decaying exponential</option>
            </select>
          </label>

          {signalType === "exp" ? (
            <label>
              Time Constant
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={timeConstant}
                onChange={(event) => setTimeConstant(Number(event.target.value))}
              />
              <span className="value-badge">{timeConstant}</span>
            </label>
          ) : null}
        </div>
      </div>

      <ModulePlot
        title="Sequence Samples"
        xTitle="n"
        yTitle="x[n]"
        barmode="group"
        data={[
          {
            x: nAxis,
            y: values,
            type: "bar",
            name: "x[n]",
            marker: { color: "#2f7f8f" }
          }
        ]}
      />
    </article>
  );
}

export default UnitSignals;