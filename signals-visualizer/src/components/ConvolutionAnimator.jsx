import { useState } from "react";
import Plot from "./Plot";

function ConvolutionAnimator() {

  const [shift, setShift] = useState(0);

  let x = [];
  let signal1 = [];
  let signal2 = [];
  let product = [];

  for (let t = -10; t <= 10; t += 0.1) {
    x.push(t);

    // x(t)
    let s1 = Math.exp(-Math.abs(t));

    // h(t - shift)
    let s2 = Math.exp(-Math.abs(t - shift));

    signal1.push(s1);
    signal2.push(s2);

    // product
    product.push(s1 * s2);
  }

  return (
    <div style={{ textAlign: "center" }}>

      <h2>Convolution Animation 🔥</h2>

      {/* Slider */}
      <input
        type="range"
        min={-5}
        max={5}
        step={0.1}
        value={shift}
        onChange={(e) => setShift(Number(e.target.value))}
        style={{ width: "300px" }}
      />

      <p>Shift: {shift.toFixed(2)}</p>

      <Plot
        data={[
          {
            x: x,
            y: signal1,
            type: "scatter",
            mode: "lines",
            name: "x(t)",
          },
          {
            x: x,
            y: signal2,
            type: "scatter",
            mode: "lines",
            name: "h(t - shift)",
          },
          {
            x: x,
            y: product,
            type: "scatter",
            mode: "lines",
            name: "Product",
          },
        ]}
        layout={{
          width: 800,
          height: 500,
          title: "Convolution Visualization",
        }}
      />

    </div>
  );
}

export default ConvolutionAnimator;