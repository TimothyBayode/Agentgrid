import "dotenv/config";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function optional(name: string, fallback: string) {
  return process.env[name]?.trim() || fallback;
}

export const serverEnv = {
  nodeEnv: optional("NODE_ENV", "development"),
  port: Number(optional("PORT", "3000")),
  frontendOrigin: optional("FRONTEND_ORIGIN", "http://localhost:5173"),
  privyAppId: required("PRIVY_APP_ID"),
  privyAppSecret: required("PRIVY_APP_SECRET"),
  privyJwtVerificationKey: required("PRIVY_JWT_VERIFICATION_KEY"),
};
