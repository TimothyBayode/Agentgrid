import app from "./app.js";
import { serverEnv } from "./config/env.js";

app.listen(serverEnv.port, () => {
  console.log(
    `AgentGrid backend listening on http://localhost:${serverEnv.port}`
  );
});
