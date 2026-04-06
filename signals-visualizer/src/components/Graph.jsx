import Plot from "./Plot";
function Graph({ xData, yData, title }) {
  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          type: "scatter",
          mode: "lines",
          marker: { color: "blue" },
        },
      ]}
      layout={{
        width: 700,
        height: 400,
        title: title,
        xaxis: { title: "Time" },
        yaxis: { title: "Amplitude" },
      }}
    />
  );
}

export default Graph;