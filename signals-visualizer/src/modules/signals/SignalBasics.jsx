import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const timeAxis = Array.from({ length: 401 }, (_, index) => -2 * Math.PI + (index * 4 * Math.PI) / 400);

function SignalBasics() {
  const [signalType, setSignalType] = useState("sine");
  const [amplitude, setAmplitude] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [phase, setPhase] = useState(0);

  const waveform = useMemo(() => {
    return timeAxis.map((t) => {
      const phaseTerm = frequency * t + phase;

      if (signalType === "cosine") {
        return amplitude * Math.cos(phaseTerm);
      }

      if (signalType === "square") {
        return amplitude * (Math.sin(phaseTerm) >= 0 ? 1 : -1);
      }

      if (signalType === "exponential") {
        return amplitude * Math.exp(-Math.abs(frequency * t));
      }

      return amplitude * Math.sin(phaseTerm);
    });
  }, [amplitude, frequency, phase, signalType]);

  return (
    <article className="module-card">
      <h3>Signal Basics Explorer</h3>
      <p className="module-caption">Interact with amplitude, frequency, and phase in real time.</p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            Signal Type
            <select value={signalType} onChange={(event) => setSignalType(event.target.value)}>
              <option value="sine">Sine</option>
              <option value="cosine">Cosine</option>
              <option value="square">Square</option>
              <option value="exponential">Exponential</option>
            </select>
          </label>

          <label>
            Amplitude
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={amplitude}
              onChange={(event) => setAmplitude(Number(event.target.value))}
            />
            <span className="value-badge">{amplitude.toFixed(1)}</span>
          </label>

          <label>
            Frequency
            <input
              type="range"
              min="0.5"
              max="4"
              step="0.1"
              value={frequency}
              onChange={(event) => setFrequency(Number(event.target.value))}
            />
            <span className="value-badge">{frequency.toFixed(1)}</span>
          </label>

          <label>
            Phase
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step="0.05"
              value={phase}
              onChange={(event) => setPhase(Number(event.target.value))}
            />
            <span className="value-badge">{phase.toFixed(2)} rad</span>
          </label>
        </div>
      </div>

      <ModulePlot
        title="x(t)"
        xTitle="t"
        yTitle="x(t)"
        data={[
          {
            x: timeAxis,
            y: waveform,
            mode: "lines",
            type: "scatter",
            name: "signal",
            line: { color: "#2f7f8f", width: 2.5 }
          }
        ]}
      />
    </article>
  );
}

export default SignalBasics;