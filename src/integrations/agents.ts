import { apiRequest } from "@/integrations/api";
import type { Agent } from "@/types/agent";
import { showcaseImages } from "@/data/agents";

export type Erc8004Service = {
  name: string;
  endpoint: string;
  version?: string;
};

export type Erc8004Registration = {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  services?: Erc8004Service[];
  x402Support?: boolean;
  active?: boolean;
  supportedTrust?: string[];
  /** App-specific extension (not part of the base ERC-8004 schema). */
  category?: string;
  /** App-specific extension (not part of the base ERC-8004 schema). */
  pricePerRun?: string;
};

export type Erc8004ReputationSignal = {
  client: string;
  feedbackIndex: number;
  value: number;
  valueDecimals: number;
  tag1: string;
  tag2: string;
};

export type Erc8004Reputation = {
  count: number;
  average: number | null;
  clientCount: number;
  signals: Erc8004ReputationSignal[];
};

export type Erc8004OnchainAgent = {
  agentId: string;
  agentRegistry: string;
  owner: string;
  agentWallet: string | null;
  tokenUri: string;
  registration: Erc8004Registration | null;
  reputation: Erc8004Reputation;
};

export type Erc8004Chain = {
  chainId: number;
  chainName: string;
  identityRegistry: string;
  reputationRegistry: string;
  agentRegistry: string;
  explorer: string;
};

export type Erc8004AgentList = {
  source: "erc8004";
  chain: Erc8004Chain;
  agents: Erc8004OnchainAgent[];
  total: number;
  limit: number;
  offset: number;
};

export async function fetchOnchainAgents(limit = 12, offset = 0) {
  return apiRequest<Erc8004AgentList>(`agents?limit=${limit}&offset=${offset}`);
}

const AVATAR_TINTS = [
  "oklch(0.62 0.19 255)",
  "oklch(0.72 0.17 150)",
  "oklch(0.75 0.16 95)",
  "oklch(0.68 0.13 330)",
  "oklch(0.7 0.12 190)",
  "oklch(0.65 0.18 35)",
  "oklch(0.71 0.15 280)",
  "oklch(0.69 0.14 170)",
];

function shortAddress(address: string): string {
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function tintFor(agentId: string, owner: string): string {
  let hash = 0;
  const seed = `${agentId}:${owner}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TINTS[hash % AVATAR_TINTS.length]!;
}

export function toAgent(agent: Erc8004OnchainAgent, chain: Erc8004Chain, index: number): Agent {
  const registration = agent.registration;
  const active = registration?.active ?? true;

  return {
    id: `erc8004-${agent.agentId}`,
    name: registration?.name || `Agent #${agent.agentId}`,
    creator: shortAddress(agent.owner),
    description:
      registration?.description ||
      "No description registered. View the agent on-chain for details.",
    category: registration?.category ?? "Other",
    capabilities: (registration?.services ?? []).map((service) => service.name),
    reputation: agent.reputation.average ?? 0,
    runs: 0,
    pricePerRun: registration?.pricePerRun ?? "Pay per run",
    status: active ? "online" : "offline",
    protocol: "ERC-8004",
    thumbnail: registration?.image || showcaseImages[index % showcaseImages.length]!,
    avatarTint: tintFor(agent.agentId, agent.owner),
    badge: "On-chain",
    onchain: {
      chainId: chain.chainId,
      agentId: agent.agentId,
      agentRegistry: agent.agentRegistry,
      owner: agent.owner,
      explorerTokenUrl: `${chain.explorer}/token/${chain.identityRegistry}#TokenTab=tokenID`,
      explorerOwnerUrl: `${chain.explorer}/address/${agent.owner}`,
    },
  };
}
