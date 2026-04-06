import FourierSeries from "../modules/fourier/FourierSeries";
import FourierTransform from "../modules/fourier/FourierTransform";

function FourierPage() {
  return (
    <section className="page-card">
      <h2>Fourier Tools</h2>
      <div className="module-grid">
        <FourierSeries />
        <FourierTransform />
      </div>
    </section>
  );
}

export default FourierPage;