function Home() {
  return (
    <section className="page-card">
      <h1>Signals and Systems Visual Learning Studio</h1>
      <p>
        A complete interactive workspace for understanding core signals and systems concepts through
        visual experimentation, parameter sweeps, and side-by-side comparisons.
      </p>
      <div className="module-grid">
        <article className="module-card">
          <h3>Signals</h3>
          <p>Build and inspect continuous/discrete signals with decomposition and unit templates.</p>
        </article>
        <article className="module-card">
          <h3>Operations</h3>
          <p>Apply shift, scale, reverse, and gain transforms with live waveform overlays.</p>
        </article>
        <article className="module-card">
          <h3>Systems</h3>
          <p>Validate linearity and time invariance numerically and visualize LTI outputs.</p>
        </article>
        <article className="module-card">
          <h3>Frequency Domain</h3>
          <p>Explore convolution, Fourier, and Laplace behavior with dynamic controls.</p>
        </article>
      </div>
    </section>
  );
}

export default Home;