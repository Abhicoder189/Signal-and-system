function ToggleButton({ label, value, onToggle }) {
  return (
    <button
      type="button"
      className="module-card"
      onClick={onToggle}
      style={{ cursor: "pointer", textAlign: "left" }}
    >
      <strong>{label}</strong>
      <p>{value ? "Enabled" : "Disabled"}</p>
    </button>
  );
}

export default ToggleButton;