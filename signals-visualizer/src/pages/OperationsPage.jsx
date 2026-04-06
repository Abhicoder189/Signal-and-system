import TimeShift from "../modules/operations/TimeShift";
import TimeScale from "../modules/operations/TimeScale";
import TimeReverse from "../modules/operations/TimeReverse";
import AmplitudeScale from "../modules/operations/AmplitudeScale";

function OperationsPage() {
  return (
    <section className="page-card">
      <h2>Signal Operations</h2>
      <div className="module-grid">
        <TimeShift />
        <TimeScale />
        <TimeReverse />
        <AmplitudeScale />
      </div>
    </section>
  );
}

export default OperationsPage;