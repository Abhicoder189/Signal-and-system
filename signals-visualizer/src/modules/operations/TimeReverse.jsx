import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 301 }, (_, index) => -6 + (index * 12) / 300);

function sourceSignal(t) {
  return Math.sin(1.5 * t) + 0.25 * t * Math.exp(-0.4 * Math.abs(t));
}

function TimeReverse() {
  const [pivot, setPivot] = useState(0);

  const { original, reversed } = useMemo(() => {
    return {
      original: timeAxis.map((t) => sourceSignal(t)),
      reversed: timeAxis.map((t) => sourceSignal(pivot - t))
    };
  }, [pivot]);

  return (
    <article className="module-card">
      <h3>Time Reversal</h3>
      <p className="module-caption">x(p - t) mirrors the signal around the line t = p/2.</p>

      <div className="module-controls">
        <label>
          Pivot p
          <input
            type="range"
            min="-3"
            max="3"
            step="0.1"
            value={pivot}
            onChange={(event) => setPivot(Number(event.target.value))}
          />
          <span className="value-badge">{pivot.toFixed(1)}</span>
        </label>
      </div>

      <ModulePlot
        title="x(t) and x(p - t)"
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
            y: reversed,
            mode: "lines",
            type: "scatter",
            name: "x(p - t)",
            line: { color: "#ce5a2f", width: 2, dash: "dash" }
          }
        ]}
      />
    </article>
  );
}

export default TimeReverse;