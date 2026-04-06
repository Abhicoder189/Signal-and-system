function SignalSelector({ signalType, setSignalType }) {
  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>Select Signal</h3>

      <select
        value={signalType}
        onChange={(e) => setSignalType(e.target.value)}
      >
        <option value="sin">Sine</option>
        <option value="cos">Cosine</option>
        <option value="square">Square</option>
      </select>
    </div>
  );
}

export default SignalSelector;