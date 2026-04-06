import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 501 }, (_, index) => -Math.PI + (index * 2 * Math.PI) / 500);

function FourierSeries() {
  const [harmonics, setHarmonics] = useState(5);

  const { target, approximation, harmonicIndex, amplitudes } = useMemo(() => {
    const targetSquare = timeAxis.map((t) => (Math.sin(t) >= 0 ? 1 : -1));

    const approx = timeAxis.map((t) => {
      let sum = 0;
      for (let m = 1; m <= harmonics; m += 1) {
        const k = 2 * m - 1;
        sum += (4 / Math.PI) * (Math.sin(k * t) / k);
      }
      return sum;
    });

    const index = Array.from({ length: harmonics }, (_, idx) => 2 * (idx + 1) - 1);
    const coeff = index.map((k) => 4 / (Math.PI * k));

    return {
      target: targetSquare,
      approximation: approx,
      harmonicIndex: index,
      amplitudes: coeff
    };
  }, [harmonics]);

  return (
    <article className="module-card">
      <h3>Fourier Series Builder</h3>
      <p className="module-caption">Approximate a square wave with odd harmonics.</p>

      <div className="module-controls">
        <label>
          Number of odd harmonics
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={harmonics}
            onChange={(event) => setHarmonics(Number(event.target.value))}
          />
          <span className="value-badge">{harmonics}</span>
        </label>
      </div>

      <ModulePlot
        title="Target vs Approximation"
        xTitle="t"
        yTitle="Amplitude"
        data={[
          {
            x: timeAxis,
            y: target,
            type: "scatter",
            mode: "lines",
            name: "Target square wave",
            line: { color: "#122027", width: 2 }
          },
          {
            x: timeAxis,
            y: approximation,
            type: "scatter",
            mode: "lines",
            name: "Series approximation",
            line: { color: "#ce5a2f", width: 2 }
          }
        ]}
      />

      <ModulePlot
        title="Harmonic Magnitudes"
        xTitle="Harmonic index k"
        yTitle="|b_k|"
        showLegend={false}
        data={[
          {
            x: harmonicIndex,
            y: amplitudes,
            type: "bar",
            marker: { color: "#2f7f8f" }
          }
        ]}
      />
    </article>
  );
}

export default FourierSeries;