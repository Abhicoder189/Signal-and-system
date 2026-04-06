import Plot from "./Plot";

function ModulePlot({
  data,
  title,
  xTitle = "Time",
  yTitle = "Amplitude",
  height = 300,
  showLegend = true,
  barmode = "overlay"
}) {
  return (
    <div className="module-plot">
      <Plot
        data={data}
        layout={{
          autosize: true,
          height,
          title: { text: title, font: { size: 15 } },
          margin: { l: 46, r: 20, t: 50, b: 44 },
          paper_bgcolor: "rgba(0, 0, 0, 0)",
          plot_bgcolor: "#ffffff",
          xaxis: {
            title: xTitle,
            zeroline: true,
            zerolinecolor: "rgba(18, 32, 39, 0.25)",
            gridcolor: "rgba(18, 32, 39, 0.1)"
          },
          yaxis: {
            title: yTitle,
            zeroline: true,
            zerolinecolor: "rgba(18, 32, 39, 0.25)",
            gridcolor: "rgba(18, 32, 39, 0.1)"
          },
          showlegend: showLegend,
          legend: {
            orientation: "h",
            y: -0.22,
            x: 0
          },
          barmode
        }}
        config={{
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["select2d", "lasso2d", "toImage"]
        }}
        useResizeHandler
        style={{ width: "100%", height: `${height}px` }}
      />
    </div>
  );
}

export default ModulePlot;
