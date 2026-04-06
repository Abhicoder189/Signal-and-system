import LTI from "../modules/systems/LTI";
import Linearity from "../modules/systems/Linearity";
import TimeInvariance from "../modules/systems/TimeInvariance";

function SystemsPage() {
  return (
    <section className="page-card">
      <h2>Systems</h2>
      <div className="module-grid">
        <LTI />
        <Linearity />
        <TimeInvariance />
      </div>
    </section>
  );
}

export default SystemsPage;