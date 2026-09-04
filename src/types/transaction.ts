export type TransactionType = "Agent Hire" | "Payment" | "Agent Earnings" | "Contract Interaction";

export type TransactionStatus =
  | "Created"
  | "Awaiting Signature"
  | "Submitted"
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "Failed"
  | "Expired"
  | "Cancelled";

export type TransactionFilter =
  "All" | "Payments" | "Hires" | "Earnings" | "Contract Interactions" | "Failed" | "Pending";

export type Transaction = {
  id: string;
  date: string;
  type: TransactionType;
  agentName: string;
  description: string;
  amount: number;
  asset: string;
  network: string;
  status: TransactionStatus;
  hash: string;
  from: string;
  to: string;
  block?: string;
  gasFee: string;
  hireId?: string;
  reason?: string;
};
