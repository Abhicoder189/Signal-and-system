import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";
import { dft } from "../../utils/fourier";

function buildSignal(type, index, length, toneBin, spread) {
  const centered = index - length / 2;

  if (type === "impulse") {
    return centered === 0 ? 1 : 0;
  }

  if (type === "cosine") {
    return Math.cos((2 * Math.PI * toneBin * index) / length);
  }

  if (type === "pulse") {
    return Math.abs(centered) <= spread ? 1 : 0;
  }

  return Math.exp(-(centered * centered) / (2 * spread * spread));
}

function FourierTransform() {
  const [signalType, setSignalType] = useState("cosine");
  const [toneBin, setToneBin] = useState(5);
  const [spread, setSpread] = useState(6);

  const length = 64;

  const { timeAxis, sequence, frequencyAxis, magnitude } = useMemo(() => {
    const sequenceData = Array.from({ length }, (_, index) =>
      buildSignal(signalType, index, length, toneBin, spread)
    );

    const spectrum = dft(sequenceData).map((entry) => entry.magnitude);
    const half = length / 2;
    const shiftedMagnitude = [...spectrum.slice(half), ...spectrum.slice(0, half)];
    const shiftedFrequency = Array.from({ length }, (_, index) => index - half);

    return {
      timeAxis: Array.from({ length }, (_, index) => index),
      sequence: sequenceData,
      frequencyAxis: shiftedFrequency,
      magnitude: shiftedMagnitude
    };
  }, [signalType, spread, toneBin]);

  return (
    <article className="module-card">
      <h3>Fourier Transform Explorer</h3>
      <p className="module-caption">Inspect how time-domain shape controls spectral content.</p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            Signal Type
            <select value={signalType} onChange={(event) => setSignalType(event.target.value)}>
              <option value="cosine">Cosine tone</option>
              <option value="impulse">Impulse</option>
              <option value="pulse">Rectangular pulse</option>
              <option value="gaussian">Gaussian pulse</option>
            </select>
          </label>

          <label>
            Tone bin
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={toneBin}
              onChange={(event) => setToneBin(Number(event.target.value))}
            />
            <span className="value-badge">{toneBin}</span>
          </label>

          <label>
            Pulse/Gaussian spread
            <input
              type="range"
              min="2"
              max="12"
              step="1"
              value={spread}
              onChange={(event) => setSpread(Number(event.target.value))}
            />
            <span className="value-badge">{spread}</span>
          </label>
        </div>
      </div>

      <ModulePlot
        title="Time Domain Sequence"
        xTitle="n"
        yTitle="x[n]"
        showLegend={false}
        data={[
          {
            x: timeAxis,
            y: sequence,
            type: "scatter",
            mode: "lines+markers",
            marker: { size: 5, color: "#ce5a2f" },
            line: { color: "#ce5a2f", width: 2 }
          }
        ]}
      />

      <ModulePlot
        title="Magnitude Spectrum |X[k]|"
        xTitle="Frequency bin"
        yTitle="Magnitude"
        showLegend={false}
        data={[
          {
            x: frequencyAxis,
            y: magnitude,
            type: "bar",
            marker: { color: "#2f7f8f" }
          }
        ]}
      />
    </article>
  );
}

export default FourierTransform;