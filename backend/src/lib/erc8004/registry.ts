import { serverEnv } from "../../config/env.js";

/**
 * ERC-8004 registry singletons are deployed at deterministic (CREATE2)
 * addresses across chains. See https://github.com/erc-8004/erc-8004-contracts.
 *
 * An agent is globally identified by:
 *   agentRegistry = `{namespace}:{chainId}:{identityRegistry}`  (e.g. eip155:97:0x...)
 *   agentId       = the ERC-721 tokenId minted by the Identity Registry
 */

export type Erc8004ChainId = 97 | 56;

export type Erc8004ChainConfig = {
  /** eip155 chain id. */
  chainId: Erc8004ChainId;
  /** Human readable chain name. */
  chainName: string;
  /** RPC endpoint used for reads. */
  rpcUrl: string;
  /** Ordered RPC endpoints. The public endpoint is tried first. */
  rpcUrls: string[];
  /** Identity Registry (ERC-721) address. */
  identityRegistry: `0x${string}`;
  /** Reputation Registry address. */
  reputationRegistry: `0x${string}`;
  /** `eip155:{chainId}:{identityRegistry}` identifier. */
  agentRegistry: string;
};

const IDENTITIES = {
  testnet: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
  mainnet: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
} as const;

const REPUTATIONS = {
  testnet: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
  mainnet: "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63",
} as const;

function toChecksummed(value: string): `0x${string}` {
  // Addresses are already provided in checksummed/canonical form above.
  return value.toLowerCase() as `0x${string}`;
}

const CONFIGS: Record<"testnet" | "mainnet", Erc8004ChainConfig> = {
  testnet: {
    chainId: 97,
    chainName: "BNB Smart Chain Testnet",
    rpcUrl: serverEnv.bscTestnetRpcUrl,
    rpcUrls: [
      serverEnv.bscTestnetRpcUrl,
      serverEnv.bscTestnetQuicknodeRpcUrl || serverEnv.bscQuicknodeRpcUrl || serverEnv.quicknodeRpcUrl,
      serverEnv.bscTestnetAlchemyRpcUrl || serverEnv.bscAlchemyRpcUrl || serverEnv.alchemyRpcUrl,
    ].filter(Boolean),
    identityRegistry: toChecksummed(IDENTITIES.testnet),
    reputationRegistry: toChecksummed(REPUTATIONS.testnet),
    agentRegistry: `eip155:97:${IDENTITIES.testnet.toLowerCase()}`,
  },
  mainnet: {
    chainId: 56,
    chainName: "BNB Smart Chain",
    rpcUrl: serverEnv.bscMainnetRpcUrl,
    rpcUrls: [
      serverEnv.bscMainnetRpcUrl,
      serverEnv.bscMainnetQuicknodeRpcUrl || serverEnv.bscQuicknodeRpcUrl || serverEnv.quicknodeRpcUrl,
      serverEnv.bscMainnetAlchemyRpcUrl || serverEnv.bscAlchemyRpcUrl || serverEnv.alchemyRpcUrl,
    ].filter(Boolean),
    identityRegistry: toChecksummed(IDENTITIES.mainnet),
    reputationRegistry: toChecksummed(REPUTATIONS.mainnet),
    agentRegistry: `eip155:56:${IDENTITIES.mainnet.toLowerCase()}`,
  },
};

export function getErc8004ChainConfig(): Erc8004ChainConfig {
  const chain = serverEnv.erc8004Chain === "mainnet" ? "mainnet" : "testnet";
  return CONFIGS[chain];
}
