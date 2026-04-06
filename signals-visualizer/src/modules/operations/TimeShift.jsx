import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 301 }, (_, index) => -6 + (index * 12) / 300);

function baseSignal(t) {
  return Math.exp(-0.15 * t * t) * Math.sin(2 * t);
}

function TimeShift() {
  const [shift, setShift] = useState(1.2);

  const { original, shifted } = useMemo(() => {
    return {
      original: timeAxis.map((t) => baseSignal(t)),
      shifted: timeAxis.map((t) => baseSignal(t - shift))
    };
  }, [shift]);

  return (
    <article className="module-card">
      <h3>Time Shift</h3>
      <p className="module-caption">Positive shift delays the waveform, negative shift advances it.</p>

      <div className="module-controls">
        <label>
          Shift t0
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={shift}
            onChange={(event) => setShift(Number(event.target.value))}
          />
          <span className="value-badge">{shift.toFixed(1)}</span>
        </label>
      </div>

      <ModulePlot
        title="x(t) and x(t - t0)"
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
            y: shifted,
            mode: "lines",
            type: "scatter",
            name: "x(t - t0)",
            line: { color: "#ce5a2f", width: 2, dash: "dash" }
          }
        ]}
      />
    </article>
  );
}

export default TimeShift;