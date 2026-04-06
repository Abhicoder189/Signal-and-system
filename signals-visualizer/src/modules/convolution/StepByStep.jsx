import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const kAxis = Array.from({ length: 15 }, (_, index) => index - 7);

function x(k) {
  return k >= -1 && k <= 3 ? 1 : 0;
}

function h(k) {
  return k >= 0 && k <= 2 ? 0.8 - 0.2 * k : 0;
}

function StepByStep() {
  const [n, setN] = useState(1);

  const { contributions, total } = useMemo(() => {
    const terms = kAxis.map((k) => {
      const value = x(k) * h(n - k);
      return { k, value };
    });

    return {
      contributions: terms,
      total: terms.reduce((sum, item) => sum + item.value, 0)
    };
  }, [n]);

  const topContributions = contributions
    .filter((item) => item.value !== 0)
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value))
    .slice(0, 3);

  return (
    <article className="module-card">
      <h3>Step-by-Step Convolution</h3>
      <p className="module-caption">Inspect each term x[k] h[n-k] before summing for y[n].</p>

      <div className="module-controls">
        <label>
          Choose output sample n
          <input
            type="range"
            min="-4"
            max="8"
            step="1"
            value={n}
            onChange={(event) => setN(Number(event.target.value))}
          />
          <span className="value-badge">{n}</span>
        </label>
      </div>

      <p className="module-caption">y[{n}] = {total.toFixed(3)}</p>
      <p className="module-caption">
        Dominant terms: {topContributions.length > 0
          ? topContributions.map((item) => `k=${item.k}: ${item.value.toFixed(2)}`).join(" | ")
          : "No overlap for this n"}
      </p>

      <ModulePlot
        title="Contribution Terms"
        xTitle="k"
        yTitle="x[k]h[n-k]"
        showLegend={false}
        data={[
          {
            x: contributions.map((item) => item.k),
            y: contributions.map((item) => item.value),
            type: "bar",
            marker: { color: "#2f7f8f" }
          }
        ]}
      />
    </article>
  );
}

export default StepByStep;