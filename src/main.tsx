import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";
import { env, requireEnv } from "./config/env";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <PrivyProvider appId={requireEnv(env.privyAppId, "VITE_PRIVY_APP_ID")}>
      <App />
    </PrivyProvider>
  </StrictMode>,
);
