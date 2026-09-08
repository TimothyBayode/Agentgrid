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
  geminiApiKey: optional("GEMINI_API_KEY", ""),
  erc8004Chain: optional("ERC8004_CHAIN", "testnet"),
  bscTestnetRpcUrl: optional("BSC_TESTNET_RPC_URL", "https://bsc-testnet-rpc.publicnode.com"),
  bscMainnetRpcUrl: optional("BSC_MAINNET_RPC_URL", "https://bsc-rpc.publicnode.com"),
  bscTestnetQuicknodeRpcUrl: optional("BSC_TESTNET_QUICKNODE_RPC_URL", ""),
  bscMainnetQuicknodeRpcUrl: optional("BSC_MAINNET_QUICKNODE_RPC_URL", ""),
  bscTestnetAlchemyRpcUrl: optional("BSC_TESTNET_ALCHEMY_RPC_URL", ""),
  bscMainnetAlchemyRpcUrl: optional("BSC_MAINNET_ALCHEMY_RPC_URL", ""),
  bscQuicknodeRpcUrl: optional("BSC_QUICKNODE_RPC_URL", ""),
  bscAlchemyRpcUrl: optional("ALCHEMY_RPC_URL", ""),
  quicknodeRpcUrl: optional("QUICKNODE_RPC_URL", ""),
  alchemyRpcUrl: optional("ALCHEMY_RPC_URL", ""),
  cronSecret: optional("CRON_SECRET", ""),
  supabaseUrl: optional("SUPABASE_URL", ""),
  supabaseServiceRoleKey: optional("SUPABASE_SERVICE_ROLE_KEY", ""),
};
