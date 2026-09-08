import express from "express";
import cors from "cors";
import { serverEnv } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { agentsRouter } from "./routes/agents.js";
import { askRouter } from "./routes/ask.js";
import { startAgentSync } from "./lib/agents-sync.js";

const app = express();

app.use(cors({ origin: serverEnv.frontendOrigin }));
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true, service: "agentgrid-backend" });
});

app.use("/api/auth", authRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/ask", askRouter);
startAgentSync();

app.use((_request, response) => {
  response.status(404).json({ error: "Not found" });
});

export default app;
