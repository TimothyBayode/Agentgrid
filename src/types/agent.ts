export type AgentStatus = "online" | "busy" | "offline";

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
};
