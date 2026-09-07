import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PrivyProvider } from "@privy-io/react-auth";

import App from "./App";
import { env } from "./config/env";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

if (!env.privyAppId) {
  // Fail visibly instead of leaving a blank page when the deployment is
  // missing VITE_PRIVY_APP_ID (e.g. not set in Vercel project env vars).
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#0a0a0a;color:#fafafa;font-family:Inter,system-ui,sans-serif;">
      <div style="max-width:420px;text-align:center;">
        <h1 style="font-size:20px;font-weight:600;margin:0 0 12px;">AgentGrid is not configured</h1>
        <p style="font-size:14px;line-height:1.6;color:#a3a3a3;margin:0 0 8px;">
          The <code style="font-family:ui-monospace,monospace;background:#171717;padding:2px 6px;border-radius:4px;">VITE_PRIVY_APP_ID</code>
          environment variable is missing from this deployment.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#a3a3a3;margin:0;">
          Add it in Vercel project settings (or <code style="font-family:ui-monospace,monospace;background:#171717;padding:2px 6px;border-radius:4px;">.env.local</code> locally) and redeploy.
        </p>
      </div>
    </div>`;
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <PrivyProvider appId={env.privyAppId}>
        <App />
      </PrivyProvider>
    </StrictMode>,
  );
}
