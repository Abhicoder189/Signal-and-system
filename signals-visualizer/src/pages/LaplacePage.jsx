import LaplaceTransform from "../modules/laplace/LaplaceTransform";

function LaplacePage() {
  return (
    <section className="page-card">
      <h2>Laplace Domain</h2>
      <div className="module-grid">
        <LaplaceTransform />
      </div>
    </section>
  );
}

export default LaplacePage;