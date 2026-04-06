import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    // Inject React in every JSX module to avoid "React is not defined" with classic JSX runtime.
    jsxInject: 'import React from "react"'
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          plotly: ["plotly.js-basic-dist-min", "react-plotly.js/factory"]
        }
      }
    }
  }
});
