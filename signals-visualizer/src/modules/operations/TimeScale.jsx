import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 301 }, (_, index) => -6 + (index * 12) / 300);

function prototypeSignal(t) {
  return Math.exp(-0.08 * t * t) * Math.cos(2.3 * t);
}

function TimeScale() {
  const [scale, setScale] = useState(1.2);

  const { original, scaled } = useMemo(() => {
    return {
      original: timeAxis.map((t) => prototypeSignal(t)),
      scaled: timeAxis.map((t) => prototypeSignal(scale * t))
    };
  }, [scale]);

  return (
    <article className="module-card">
      <h3>Time Scale</h3>
      <p className="module-caption">x(a t): if a {'>'} 1 the signal compresses, if 0 {'<'} a {'<'} 1 it expands.</p>

      <div className="module-controls">
        <label>
          Scale a
          <input
            type="range"
            min="0.4"
            max="2.5"
            step="0.1"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
          <span className="value-badge">{scale.toFixed(1)}</span>
        </label>
      </div>

      <ModulePlot
        title="x(t) and x(a t)"
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
            y: scaled,
            mode: "lines",
            type: "scatter",
            name: "x(a t)",
            line: { color: "#2f7f8f", width: 2, dash: "dot" }
          }
        ]}
      />
    </article>
  );
}

export default TimeScale;