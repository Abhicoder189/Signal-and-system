import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const omegaAxis = Array.from({ length: 401 }, (_, index) => -12 + (index * 24) / 400);
const sigmaAxis = Array.from({ length: 161 }, (_, index) => -4 + (index * 6) / 160);

function LaplaceTransform() {
  const [decay, setDecay] = useState(1.2);
  const [sigma, setSigma] = useState(0.4);

  const { magnitudeSlice, rocProfile, poleLocation, stableAtZero } = useMemo(() => {
    const slice = omegaAxis.map((omega) => 1 / Math.sqrt((sigma + decay) ** 2 + omega ** 2));
    const roc = sigmaAxis.map((sigmaValue) => (sigmaValue > -decay ? 1 : 0));

    return {
      magnitudeSlice: slice,
      rocProfile: roc,
      poleLocation: -decay,
      stableAtZero: 0 > -decay
    };
  }, [decay, sigma]);

  return (
    <article className="module-card">
      <h3>Laplace Transform Analyzer</h3>
      <p className="module-caption">
        For x(t) = exp(-a t) u(t), X(s) = 1 / (s + a) with ROC: Re(s) {'>'} -a.
      </p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            Decay a
            <input
              type="range"
              min="0.2"
              max="3"
              step="0.1"
              value={decay}
              onChange={(event) => setDecay(Number(event.target.value))}
            />
            <span className="value-badge">{decay.toFixed(1)}</span>
          </label>

          <label>
            Sigma slice Re(s)
            <input
              type="range"
              min="-3"
              max="2"
              step="0.1"
              value={sigma}
              onChange={(event) => setSigma(Number(event.target.value))}
            />
            <span className="value-badge">{sigma.toFixed(1)}</span>
          </label>
        </div>
      </div>

      <p className="module-caption">
        Pole at sigma = {poleLocation.toFixed(1)}. BIBO stable at sigma=0: {stableAtZero ? "Yes" : "No"}.
      </p>

      <ModulePlot
        title="Magnitude Slice |X(sigma + j omega)|"
        xTitle="omega"
        yTitle="Magnitude"
        showLegend={false}
        data={[
          {
            x: omegaAxis,
            y: magnitudeSlice,
            type: "scatter",
            mode: "lines",
            line: { color: "#2f7f8f", width: 2 }
          }
        ]}
      />

      <ModulePlot
        title="Region of Convergence Profile"
        xTitle="sigma"
        yTitle="In ROC (1=yes)"
        showLegend={false}
        data={[
          {
            x: sigmaAxis,
            y: rocProfile,
            type: "scatter",
            mode: "lines",
            line: { color: "#ce5a2f", width: 2 }
          }
        ]}
      />
    </article>
  );
}

export default LaplaceTransform;