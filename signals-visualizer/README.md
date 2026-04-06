# Signals Visualizer

Interactive web application for learning core Signals and Systems concepts with visual modules for:

- Signal types and decomposition
- Time/amplitude operations
- System properties and LTI behavior
- Convolution intuition
- Fourier analysis
- Laplace transform basics

## Tech Stack

- React 18
- React Router 6
- Vite 5
- Plotly.js via react-plotly.js
- ESLint + Prettier
- Vitest for unit tests
- GitHub Actions CI

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build and Preview

```bash
npm run build
npm run preview
```

## Quality Gates

### Lint

```bash
npm run lint
```

### Format Check

```bash
npm run format
```

### Test

```bash
npm run test
```

### Coverage

```bash
npm run coverage
```

### Full Local Validation

```bash
npm run check
```

## Project Structure

```text
src/
  components/        # Reusable UI building blocks
  hooks/             # Shared hooks for signal and graph data
  modules/           # Domain-specific teaching modules
  pages/             # Route-level pages
  styles/            # Theme tokens and global styles
  utils/             # Pure math/utility helpers (unit-tested)
```

## CI

The repository includes a GitHub Actions workflow at .github/workflows/ci.yml that validates:

- Lint rules
- Test suite with coverage
- Production build

## Contribution Guidelines

1. Create a feature branch.
2. Keep changes scoped and documented.
3. Ensure npm run check passes before creating a pull request.
4. Add tests for any changes to src/utils logic.
