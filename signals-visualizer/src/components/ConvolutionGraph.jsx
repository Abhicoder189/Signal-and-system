import Plot from "./Plot";

function ConvolutionGraph() {

  let x = [];
  let y = [];

  for (let t = -10; t <= 10; t += 0.1) {
    x.push(t);

    // Demo convolution-like signal
    let val = Math.exp(-Math.abs(t)) * Math.sin(t);
    y.push(val);
  }

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Plot
        data={[
          {
            x: x,
            y: y,
            type: "scatter",
            mode: "lines",
          },
        ]}
        layout={{
          width: 700,
          height: 400,
          title: "Convolution Output (Demo)",
        }}
      />
    </div>
  );
}

export default ConvolutionGraph;