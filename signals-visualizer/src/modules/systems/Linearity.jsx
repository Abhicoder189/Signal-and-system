import { useMemo, useState } from "react";

import ModulePlot from "../../components/ModulePlot";

const nAxis = Array.from({ length: 31 }, (_, index) => index - 15);

function x1(n) {
  return n === 0 ? 1 : 0;
}

function x2(n) {
  return n >= 0 ? 1 : 0;
}

function linearSystem(sequence) {
  return sequence.map((value, index) => {
    const previous = index > 0 ? sequence[index - 1] : 0;
    return 0.5 * (value + previous);
  });
}

function Linearity() {
  const [a, setA] = useState(1.2);
  const [b, setB] = useState(-0.6);

  const { lhs, rhs, maxDifference } = useMemo(() => {
    const first = nAxis.map((n) => x1(n));
    const second = nAxis.map((n) => x2(n));
    const mixedInput = first.map((value, index) => a * value + b * second[index]);

    const lhsSequence = linearSystem(mixedInput);
    const rhsSequence = linearSystem(first).map(
      (value, index) => a * value + b * linearSystem(second)[index]
    );

    const difference = lhsSequence.map((value, index) => Math.abs(value - rhsSequence[index]));

    return {
      lhs: lhsSequence,
      rhs: rhsSequence,
      maxDifference: Math.max(...difference)
    };
  }, [a, b]);

  return (
    <article className="module-card">
      <h3>Linearity Test Bench</h3>
      <p className="module-caption">
        Compare T[a x1 + b x2] with a T[x1] + b T[x2]. For a linear system, both traces overlap.
      </p>

      <div className="module-controls">
        <div className="control-grid">
          <label>
            Coefficient a
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={a}
              onChange={(event) => setA(Number(event.target.value))}
            />
            <span className="value-badge">{a.toFixed(1)}</span>
          </label>

          <label>
            Coefficient b
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={b}
              onChange={(event) => setB(Number(event.target.value))}
            />
            <span className="value-badge">{b.toFixed(1)}</span>
          </label>
        </div>
      </div>

      <p className="module-caption">Maximum absolute difference: {maxDifference.toExponential(2)}</p>

      <ModulePlot
        title="Linearity Comparison"
        xTitle="n"
        yTitle="Output"
        data={[
          {
            x: nAxis,
            y: lhs,
            type: "scatter",
            mode: "lines+markers",
            name: "T[a x1 + b x2]",
            line: { color: "#ce5a2f", width: 2 }
          },
          {
            x: nAxis,
            y: rhs,
            type: "scatter",
            mode: "lines+markers",
            name: "a T[x1] + b T[x2]",
            line: { color: "#2f7f8f", width: 2, dash: "dot" }
          }
        ]}
      />
    </article>
  );
}

export default Linearity;