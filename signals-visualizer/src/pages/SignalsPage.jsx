import SignalBasics from "../modules/signals/SignalBasics";
import EvenOdd from "../modules/signals/EvenOdd";
import UnitSignals from "../modules/signals/UnitSignals";

function SignalsPage() {
  return (
    <section className="page-card">
      <h2>Signals</h2>
      <div className="module-grid">
        <SignalBasics />
        <EvenOdd />
        <UnitSignals />
      </div>
    </section>
  );
}

export default SignalsPage;