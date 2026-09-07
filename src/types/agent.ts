export type AgentStatus = "online" | "busy" | "offline";

export type OnchainAgentRef = {
  chainId: number;
  agentId: string;
  agentRegistry: string;
  owner: string;
  explorerTokenUrl: string;
  explorerOwnerUrl: string;
};

export type Agent = {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: string;
  capabilities: string[];
  reputation: number;
  runs: number;
  pricePerRun: string;
  status: AgentStatus;
  protocol: string;
  thumbnail: string;
  avatarTint: string;
  badge?: string;
  /** Present when the agent is discovered via the ERC-8004 Identity Registry. */
  onchain?: OnchainAgentRef;
};
