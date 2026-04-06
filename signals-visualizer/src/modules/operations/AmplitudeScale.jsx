import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 301 }, (_, index) => -6 + (index * 12) / 300);

function baseSignal(t) {
  return Math.sin(1.3 * t) + 0.4 * Math.sin(2.7 * t);
}

function AmplitudeScale() {
  const [gain, setGain] = useState(1);

  const { original, scaled } = useMemo(() => {
    const base = timeAxis.map((t) => baseSignal(t));
    return {
      original: base,
      scaled: base.map((value) => gain * value)
    };
  }, [gain]);

  return (
    <article className="module-card">
      <h3>Amplitude Scaling</h3>
      <p className="module-caption">x1(t) = k x(t). Negative k inverts the waveform polarity.</p>

      <div className="module-controls">
        <label>
          Gain k
          <input
            type="range"
            min="-2.5"
            max="2.5"
            step="0.1"
            value={gain}
            onChange={(event) => setGain(Number(event.target.value))}
          />
          <span className="value-badge">{gain.toFixed(1)}</span>
        </label>
      </div>

      <ModulePlot
        title="x(t) and k x(t)"
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
            name: "k x(t)",
            line: { color: "#2f7f8f", width: 2, dash: "dot" }
          }
        ]}
      />
    </article>
  );
}

export default AmplitudeScale;