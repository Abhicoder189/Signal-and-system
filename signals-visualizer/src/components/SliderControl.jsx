function SliderControl({ label, value, setValue, min, max, step }) {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      
      <h3>{label}: {value}</h3>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: "300px" }}
      />

    </div>
  );
}

export default SliderControl;