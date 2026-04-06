import ConvolutionVisualizer from "../modules/convolution/ConvolutionVisualizer";
import StepByStep from "../modules/convolution/StepByStep";

function ConvolutionPage() {
  return (
    <section className="page-card">
      <h2>Convolution</h2>
      <div className="module-grid">
        <ConvolutionVisualizer />
        <StepByStep />
      </div>
    </section>
  );
}

export default ConvolutionPage;