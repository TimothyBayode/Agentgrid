import type { ActivityCategory, ActivityEvent } from "@/types/activity";

export const activityFilters: Array<ActivityCategory | "All"> = [
  "All",
  "Hires",
  "Agents",
  "Transactions",
  "Payments",
  "Wallet",
  "AI",
  "Security",
];

export const activityEvents: ActivityEvent[] = [
  {
    id: "activity-001",
    type: "Agent completed",
    category: "Agents",
    title: "Yield Pilot completed your yield optimization task.",
    description: "Optimize USDT/BNB position",
    time: "2:43 PM",
    dateGroup: "Today",
    hireId: "hire-001",
    metadata: [
      { label: "Agent", value: "YieldMax" },
      { label: "Task", value: "Optimize USDT/BNB position" },
      { label: "Cost", value: "$0.42" },
      { label: "Status", value: "Completed" },
    ],
  },
  {
    id: "activity-002",
    type: "Transaction confirmed",
    category: "Transactions",
    title: "Payment of $0.42 was confirmed on BNB Smart Chain.",
    description: "0x83...91fa",
    time: "2:31 PM",
    dateGroup: "Today",
    hireId: "hire-001",
    transactionHash: "0x83a71c5e6b9d2f4a8c0e1b7d3a5f9c2e6d8b1a4f91fa",
    metadata: [
      { label: "Status", value: "Confirmed" },
      { label: "Amount", value: "$0.42" },
      { label: "Network", value: "BNB Smart Chain" },
      { label: "Block", value: "#42,831,921" },
    ],
  },
  {
    id: "activity-003",
    type: "Agent hired",
    category: "Hires",
    title: "You hired Yield Pilot to optimize your USDT/BNB position.",
    description: "Optimize USDT/BNB position",
    time: "2:28 PM",
    dateGroup: "Today",
    hireId: "hire-001",
    metadata: [
      { label: "Agent", value: "YieldMax" },
      { label: "Category", value: "DeFi" },
      { label: "Job", value: "JOB-82931" },
    ],
  },
  {
    id: "activity-004",
    type: "AI interaction",
    category: "AI",
    title: "You asked Nexus:",
    description: "Which yield agents have the highest success rate?",
    time: "1:52 PM",
    dateGroup: "Today",
    conversation:
      "Nexus compared 6 yield agents using reputation, completed runs, and recent performance.",
    metadata: [
      { label: "Assistant", value: "Nexus" },
      { label: "Interaction", value: "Agent recommendation" },
    ],
  },
  {
    id: "activity-005",
    type: "Agent completed",
    category: "Agents",
    title: "HealthGuard completed your monitoring task.",
    description: "Monitor wallet position",
    time: "11:24 AM",
    dateGroup: "Yesterday",
    hireId: "hire-007",
    metadata: [
      { label: "Agent", value: "HealthGuard" },
      { label: "Task", value: "Monitor wallet position" },
      { label: "Status", value: "Completed" },
    ],
  },
  {
    id: "activity-006",
    type: "Wallet connected",
    category: "Wallet",
    title: "Wallet 0x...8F2 connected to AgentGrid.",
    description: "BNB Smart Chain",
    time: "10:18 AM",
    dateGroup: "Yesterday",
    metadata: [
      { label: "Wallet", value: "0x4b8e...8F2" },
      { label: "Network", value: "BNB Smart Chain" },
    ],
  },
  {
    id: "activity-007",
    type: "Agent started",
    category: "Agents",
    title: "Alpha Scout started watching the mempool.",
    description: "1,204 pending transactions monitored",
    time: "9:44 AM",
    dateGroup: "Yesterday",
    hireId: "hire-002",
    metadata: [
      { label: "Agent", value: "Alpha Scout" },
      { label: "Task", value: "Scan mempool for early liquidity events" },
      { label: "Status", value: "Running" },
    ],
  },
  {
    id: "activity-008",
    type: "Permission changed",
    category: "Security",
    title: "A spending limit was changed for your agent session.",
    description: "Daily limit increased to 0.05 BNB",
    time: "8:31 AM",
    dateGroup: "Yesterday",
    metadata: [
      { label: "Permission", value: "Spending limit" },
      { label: "New limit", value: "0.05 BNB per day" },
      { label: "Session", value: "AgentGrid web" },
    ],
  },
];

export function getActivityById(id: string) {
  return activityEvents.find((event) => event.id === id);
}

export function activityCounts(events: ActivityEvent[]) {
  return {
    activities: events.length,
    hires: events.filter((event) => event.category === "Hires").length,
    transactions: events.filter(
      (event) => event.category === "Transactions" || event.category === "Payments",
    ).length,
    ai: events.filter((event) => event.category === "AI").length,
  };
}
