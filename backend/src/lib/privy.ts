import { PrivyClient } from "@privy-io/node";
import { serverEnv } from "../config/env.js";

export const privy = new PrivyClient({
  appId: serverEnv.privyAppId,
  appSecret: serverEnv.privyAppSecret,
  jwtVerificationKey: serverEnv.privyJwtVerificationKey,
});
