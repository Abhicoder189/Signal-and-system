import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { installChunkRecoveryHandlers } from "./utils/chunkRecovery";
import "./styles/theme.css";
import "./styles/globals.css";

installChunkRecoveryHandlers();

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);