import type { Transaction, TransactionFilter, TransactionStatus } from "@/types/transaction";

export const transactionFilters: TransactionFilter[] = [
  "All",
  "Payments",
  "Hires",
  "Earnings",
  "Contract Interactions",
  "Failed",
  "Pending",
];

export const transactionTypes: Array<Transaction["type"] | "All"> = [
  "All",
  "Agent Hire",
  "Payment",
  "Agent Earnings",
  "Contract Interaction",
];

export const transactions: Transaction[] = [
  {
    id: "tx-001",
    date: "2026-09-04T14:31:00",
    type: "Agent Hire",
    agentName: "Yield Pilot",
    description: "Payment for LP optimization job",
    amount: -0.42,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x83a71c5e6b9d2f4a8c0e1b7d3a5f9c2e6d8b1a4f91fa",
    from: "0x71c4...92F",
    to: "0x84ae...A21",
    block: "#42,831,921",
    gasFee: "0.00031 BNB",
    hireId: "hire-001",
  },
  {
    id: "tx-002",
    date: "2026-09-04T14:10:00",
    type: "Payment",
    agentName: "Arb Weaver",
    description: "Cross-DEX route simulation",
    amount: -1.2,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x5c8d1f4a7b0e3c6f9a2d5b8e1c4f7a0d3e6b9c2f5a8d1b4e",
    from: "0x71c4...92F",
    to: "0x1a7c...F18",
    block: "#42,831,104",
    gasFee: "0.00028 BNB",
    hireId: "hire-004",
  },
  {
    id: "tx-003",
    date: "2026-09-04T13:54:00",
    type: "Agent Earnings",
    agentName: "GridBot",
    description: "Earnings from completed grid configuration job",
    amount: 3.4,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x6d9c2f5a8e1b4c7d0a3f6e9b2c5d8a1f4e7b0c3d6a9f2e5b",
    from: "0x2c91...B73",
    to: "0x71c4...92F",
    block: "#42,830,772",
    gasFee: "0.00019 BNB",
  },
  {
    id: "tx-004",
    date: "2026-09-03T16:22:00",
    type: "Contract Interaction",
    agentName: "HealthGuard",
    description: "Position monitoring contract call",
    amount: 0,
    asset: "BNB",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x1e4b7c0d3a6f9e2b5c8d1f4a7b0e3c6f9a2d5b8e1c4f7a0d",
    from: "0x71c4...92F",
    to: "0x9f21...C80",
    block: "#42,811,456",
    gasFee: "0.00008 BNB",
    hireId: "hire-007",
  },
  {
    id: "tx-005",
    date: "2026-09-03T15:42:00",
    type: "Agent Hire",
    agentName: "HealthGuard",
    description: "Payment for wallet monitoring task",
    amount: -0.18,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Pending",
    hash: "0x2f5a8e1b4c7d0a3f6e9b2c5d8a1f4e7b0c3d6a9f2e5b8c1",
    from: "0x71c4...92F",
    to: "0x9f21...C80",
    gasFee: "0.00011 BNB",
    hireId: "hire-006",
  },
  {
    id: "tx-006",
    date: "2026-09-02T11:49:00",
    type: "Payment",
    agentName: "Arb Weaver",
    description: "Arbitrage simulation payment reverted",
    amount: -0.63,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Failed",
    hash: "0x4b7e0d3c6a9f2e5b8d1c4a7f0e3b6d9c2a5f8e1b4c7d0a3f6e",
    from: "0x71c4...92F",
    to: "0x1a7c...F18",
    block: "#42,790,118",
    gasFee: "0.00014 BNB",
    hireId: "hire-008",
    reason:
      "The transaction was submitted but reverted on-chain after the route fell below the profit threshold.",
  },
  {
    id: "tx-007",
    date: "2026-09-01T08:23:00",
    type: "Agent Hire",
    agentName: "Docs Oracle",
    description: "Payment for cited protocol answer",
    amount: -0.12,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x5a8d1f4b7c0e3a6d9f2b5e8c1d4a7f0e3b6c9d2a5f8e1c4b",
    from: "0x71c4...92F",
    to: "0x44ab...D12",
    block: "#42,761,300",
    gasFee: "0.00007 BNB",
    hireId: "hire-013",
  },
  {
    id: "tx-008",
    date: "2026-08-31T14:07:00",
    type: "Agent Earnings",
    agentName: "Yield Pilot",
    description: "Agent payout from APY report",
    amount: 2.15,
    asset: "USDT",
    network: "BNB Smart Chain",
    status: "Confirmed",
    hash: "0x4c7f0e3b6a9d2c5f8e1b4a7d0c3f6e9b2a5d8c1f4e7a0b3d",
    from: "0x84ae...A21",
    to: "0x71c4...92F",
    block: "#42,744,021",
    gasFee: "0.00018 BNB",
  },
];

export function getTransactionById(id: string) {
  return transactions.find((transaction) => transaction.id === id);
}

export function transactionMatchesFilter(transaction: Transaction, filter: TransactionFilter) {
  if (filter === "All") return true;
  if (filter === "Payments") return transaction.type === "Payment";
  if (filter === "Hires") return transaction.type === "Agent Hire";
  if (filter === "Earnings") return transaction.type === "Agent Earnings";
  if (filter === "Contract Interactions") return transaction.type === "Contract Interaction";
  if (filter === "Failed")
    return transaction.status === "Failed" || transaction.status === "Rejected";
  return (
    transaction.status === "Pending" ||
    transaction.status === "Awaiting Signature" ||
    transaction.status === "Submitted"
  );
}

export function transactionStatusIsPending(status: TransactionStatus) {
  return (
    status === "Pending" ||
    status === "Awaiting Signature" ||
    status === "Submitted" ||
    status === "Created"
  );
}

export function formatTransactionDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatTransactionTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
