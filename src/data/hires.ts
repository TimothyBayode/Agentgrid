import { agents } from "@/data/agents";
import type { Hire, HireStatus } from "@/types/hire";

const agentById = (id: string) => agents.find((agent) => agent.id === id);

type Seed = Omit<Hire, "agentName" | "agentThumbnail"> & {
  agentId: string;
};

const seeds: Seed[] = [
  {
    id: "hire-001",
    agentId: "agent-2",
    task: "Optimize my USDT/BNB LP position",
    category: "DeFi",
    status: "Running",
    progress: 72,
    startedAt: "2026-09-04T12:41:00",
    cost: 0.42,
    bnbCost: "0.00042",
    currentStep: "Rebalancing LP weights across 3 vaults",
    transaction: {
      hash: "0x8f2c1a9e4b7d3c6f0a1b2c3d4e5f6a7b8c9d0e1f29a1",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 98.4, avgResponseSeconds: 132, reputation: 4.9 },
  },
  {
    id: "hire-002",
    agentId: "agent-1",
    task: "Scan mempool for early liquidity events",
    category: "Trading",
    status: "Running",
    progress: 38,
    startedAt: "2026-09-04T12:28:00",
    cost: 0.28,
    bnbCost: "0.00028",
    currentStep: "Watching 1,204 pending transactions",
    transaction: {
      hash: "0x3a9f8b2c1d4e7f0a6b5c8d9e2f3a4b7c6d5e8f1a4b2c9d3e",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 99.1, avgResponseSeconds: 64, reputation: 4.9 },
  },
  {
    id: "hire-003",
    agentId: "agent-5",
    task: "Build live dataset from on-chain events",
    category: "Data",
    status: "Running",
    progress: 55,
    startedAt: "2026-09-04T11:52:00",
    cost: 0.56,
    bnbCost: "0.00056",
    currentStep: "Ingesting 48k Transfer events",
    transaction: {
      hash: "0x7b2e5d8a1c4f9e3b6a0d7c2e5f8b1a4d9c3e6f0b2a5d8c1e",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 96.7, avgResponseSeconds: 410, reputation: 4.6 },
  },
  {
    id: "hire-004",
    agentId: "agent-10",
    task: "Simulate cross-DEX arbitrage route",
    category: "Trading",
    status: "Completed",
    progress: 100,
    startedAt: "2026-09-04T10:15:00",
    completedAt: "2026-09-04T10:18:31",
    executionSeconds: 211,
    cost: 1.2,
    bnbCost: "0.0012",
    result:
      "Your portfolio was rebalanced successfully. Estimated gas saved of 0.0009 BNB across 4 candidate routes.",
    output:
      "Best route: PancakeSwap -> 1inch -> Venus (net 0.0021 BNB). Slippage guard held at 0.4%. No approval changes required.",
    transaction: {
      hash: "0x5c8d1f4a7b0e3c6f9a2d5b8e1c4f7a0d3e6b9c2f5a8d1b4e",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 98.9, avgResponseSeconds: 205, reputation: 4.9 },
  },
  {
    id: "hire-005",
    agentId: "agent-2",
    task: "Rebalance LP position",
    category: "DeFi",
    status: "Completed",
    progress: 100,
    startedAt: "2026-09-03T18:02:00",
    completedAt: "2026-09-03T18:04:12",
    executionSeconds: 132,
    cost: 0.42,
    bnbCost: "0.00042",
    result: "Position rebalanced to target 50/50 weights.",
    output: "2 swap txs executed. Net APY improvement +0.8%.",
    transaction: {
      hash: "0x1e4b7c0d3a6f9e2b5c8d1f4a7b0e3c6f9a2d5b8e1c4f7a0d",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 98.4, avgResponseSeconds: 132, reputation: 4.7 },
  },
  {
    id: "hire-006",
    agentId: "agent-3",
    task: "Summarize governance threads",
    category: "Research",
    status: "Completed",
    progress: 100,
    startedAt: "2026-09-03T09:30:00",
    completedAt: "2026-09-03T09:31:48",
    executionSeconds: 108,
    cost: 0.18,
    bnbCost: "0.00018",
    result: "Digested 14 governance threads into a 1-page brief.",
    output: "3 proposals flagged for impact on your holdings. Sent digest email.",
    transaction: {
      hash: "0x9f2e5b8c1d4a7f0e3b6c9d2a5f8b1e4c7a0d3f6b9c2e5a8d",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 99.5, avgResponseSeconds: 96, reputation: 4.8 },
  },
  {
    id: "hire-007",
    agentId: "agent-4",
    task: "Audit contract approvals",
    category: "Security",
    status: "Completed",
    progress: 100,
    startedAt: "2026-09-02T15:11:00",
    completedAt: "2026-09-02T15:13:05",
    executionSeconds: 125,
    cost: 0.63,
    bnbCost: "0.00063",
    result: "Scan complete. 2 risky unlimited approvals found and a revoke plan generated.",
    output: "Revoking would free 0.84 BNB from over-authorized contracts.",
    transaction: {
      hash: "0x6a9d2c5b8e1f4a7d0c3b6e9a2f5c8d1b4e7a0c3f6b9d2a5e",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 100, avgResponseSeconds: 118, reputation: 5 },
  },
  {
    id: "hire-008",
    agentId: "agent-10",
    task: "Simulate arbitrage before committing gas",
    category: "Trading",
    status: "Failed",
    progress: 41,
    startedAt: "2026-09-02T11:47:00",
    completedAt: "2026-09-02T11:49:12",
    executionSeconds: 132,
    cost: 0.9,
    bnbCost: "0.0009",
    result: "Simulation aborted: route profit fell below the 0.3% threshold after gas.",
    output: "No transaction was sent. Slippage guard prevented execution.",
    transaction: {
      hash: "0x4b7e0d3c6a9f2e5b8d1c4a7f0e3b6d9c2a5f8e1b4c7d0a3f6e",
      status: "Failed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 98.9, avgResponseSeconds: 205, reputation: 4.9 },
  },
  {
    id: "hire-009",
    agentId: "agent-7",
    task: "Track NFT mint window",
    category: "NFT",
    status: "Cancelled",
    progress: 22,
    startedAt: "2026-09-01T20:15:00",
    completedAt: "2026-09-01T20:19:40",
    executionSeconds: 280,
    cost: 0,
    bnbCost: "0",
    result: "Cancelled by you. No fees were charged.",
    output: "Monitoring stopped. You were removed from the mint queue.",
    transaction: {
      hash: "0x2c5d8a1f4b7e0c3d6a9f2b5e8c1d4a7f0e3b6c9d2a5f8e1b",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 94.2, avgResponseSeconds: 74, reputation: 4.5 },
  },
  {
    id: "hire-010",
    agentId: "agent-8",
    task: "Automate in-game quest loop",
    category: "Gaming",
    status: "Pending",
    progress: 0,
    startedAt: "2026-09-04T13:02:00",
    cost: 0.35,
    bnbCost: "0.00035",
    currentStep: "Awaiting payment confirmation",
    transaction: {
      hash: "0x8d1c4f7a0b3e6c9d2f5a8b1e4c7d0a3f6b9c2e5a8d1f4b7e",
      status: "Pending",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 91.8, avgResponseSeconds: 260, reputation: 4.3 },
  },
  {
    id: "hire-011",
    agentId: "agent-9",
    task: "Reconcile multisig spend",
    category: "Ops",
    status: "Queued",
    progress: 0,
    startedAt: "2026-09-04T13:10:00",
    cost: 0.7,
    bnbCost: "0.0007",
    currentStep: "Queued — waiting for a worker",
    transaction: {
      hash: "0x7f0e3b6c9d2a5f8e1c4b7a0d3f6e9c2b5a8d1f4e7c0b3a6d",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 97.3, avgResponseSeconds: 190, reputation: 4.8 },
  },
  {
    id: "hire-012",
    agentId: "agent-12",
    task: "Stream payroll to team vault",
    category: "DeFi",
    status: "Awaiting Payment",
    progress: 0,
    startedAt: "2026-09-04T13:18:00",
    cost: 1.05,
    bnbCost: "0.00105",
    currentStep: "Awaiting your wallet signature",
    transaction: {
      hash: "0x3e6a9d2c5f8b1e4a7d0c3f6b9e2a5d8c1f4b7a0e3d6c9f2b",
      status: "Pending",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 95.6, avgResponseSeconds: 150, reputation: 4.5 },
  },
  {
    id: "hire-013",
    agentId: "agent-11",
    task: "Answer protocol docs question",
    category: "Research",
    status: "Completed",
    progress: 100,
    startedAt: "2026-09-01T08:22:00",
    completedAt: "2026-09-01T08:23:04",
    executionSeconds: 44,
    cost: 0.12,
    bnbCost: "0.00012",
    result: "Answered with 4 cited sources from official docs.",
    output: "Response posted to Slack #protocol-questions.",
    transaction: {
      hash: "0x5a8d1f4b7c0e3a6d9f2b5e8c1d4a7f0e3b6c9d2a5f8e1c4b",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 97.9, avgResponseSeconds: 52, reputation: 4.6 },
  },
  {
    id: "hire-014",
    agentId: "agent-6",
    task: "Draft and schedule social posts",
    category: "Social",
    status: "Expired",
    progress: 0,
    startedAt: "2026-08-30T19:40:00",
    completedAt: "2026-08-30T19:41:00",
    executionSeconds: 60,
    cost: 0,
    bnbCost: "0",
    result: "Payment offer expired before confirmation.",
    output: "No work was performed. Re-hire to resume.",
    transaction: {
      hash: "0x9b2e5d8c1f4a7b0e3d6c9a2f5b8e1c4d7a0f3e6b9c2d5a8f",
      status: "Failed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 90.4, avgResponseSeconds: 210, reputation: 4.4 },
  },
  {
    id: "hire-015",
    agentId: "agent-2",
    task: "Track APY across BNB Chain vaults",
    category: "DeFi",
    status: "Completed",
    progress: 100,
    startedAt: "2026-08-31T14:05:00",
    completedAt: "2026-08-31T14:07:29",
    executionSeconds: 149,
    cost: 0.51,
    bnbCost: "0.00051",
    result: "APY report generated across 6 vaults.",
    output: "Best yield: 12.4% on Vaultworks Stable Vault.",
    transaction: {
      hash: "0x4c7f0e3b6a9d2c5f8e1b4a7d0c3f6e9b2a5d8c1f4e7a0b3d",
      status: "Confirmed",
      network: "BNB Smart Chain",
    },
    performance: { successRate: 98.4, avgResponseSeconds: 132, reputation: 4.7 },
  },
];

export const hires: Hire[] = seeds.map((seed) => {
  const agent = agentById(seed.agentId);
  return {
    ...seed,
    agentName: agent?.name ?? seed.agentId,
    agentThumbnail: agent?.thumbnail ?? "",
  };
});

export const getHireById = (id: string) => hires.find((hire) => hire.id === id);

export const getHireAgent = (hire: Hire) => agentById(hire.agentId);

export type StatusGroup = "Active" | "Completed" | "Pending" | "Failed" | "Cancelled";

export function statusGroup(status: HireStatus): StatusGroup {
  switch (status) {
    case "Running":
      return "Active";
    case "Completed":
      return "Completed";
    case "Failed":
      return "Failed";
    case "Cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export function isLive(status: HireStatus) {
  return (
    status === "Running" ||
    status === "Queued" ||
    status === "Pending" ||
    status === "Awaiting Payment" ||
    status === "Payment Confirmed"
  );
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function relativeStart(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.round(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
