import { agents } from "@/data/agents";

export type OwnedAgentStatus =
  "Live" | "Draft" | "Paused" | "Under Review" | "Unlisted" | "Suspended";

export type OwnedAgent = {
  agentId: string;
  status: OwnedAgentStatus;
  hires: number;
  completed: number;
  earnings: number;
  successRate: number;
  jobsToday: number;
  visibility: "Listed" | "Unlisted";
  acceptHires: boolean;
};

export const ownedAgents: OwnedAgent[] = [
  {
    agentId: "agent-2",
    status: "Live",
    hires: 428,
    completed: 412,
    earnings: 1842.4,
    successRate: 98.4,
    jobsToday: 18,
    visibility: "Listed",
    acceptHires: true,
  },
  {
    agentId: "agent-1",
    status: "Live",
    hires: 301,
    completed: 294,
    earnings: 1280.2,
    successRate: 97.7,
    jobsToday: 11,
    visibility: "Listed",
    acceptHires: true,
  },
  {
    agentId: "agent-5",
    status: "Paused",
    hires: 227,
    completed: 211,
    earnings: 942.7,
    successRate: 92.9,
    jobsToday: 0,
    visibility: "Listed",
    acceptHires: false,
  },
  {
    agentId: "agent-4",
    status: "Under Review",
    hires: 0,
    completed: 0,
    earnings: 0,
    successRate: 0,
    jobsToday: 0,
    visibility: "Unlisted",
    acceptHires: false,
  },
  {
    agentId: "agent-10",
    status: "Draft",
    hires: 0,
    completed: 0,
    earnings: 0,
    successRate: 0,
    jobsToday: 0,
    visibility: "Unlisted",
    acceptHires: false,
  },
];

export function getOwnedAgent(agentId: string) {
  const ownership = ownedAgents.find((agent) => agent.agentId === agentId);
  const agent = agents.find((item) => item.id === agentId);
  return ownership && agent ? { ...agent, ...ownership } : undefined;
}
