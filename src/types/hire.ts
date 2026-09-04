export type HireStatus =
  | "Pending"
  | "Awaiting Payment"
  | "Payment Confirmed"
  | "Queued"
  | "Running"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Expired";

export const HIRE_LIFECYCLE: HireStatus[] = [
  "Pending",
  "Awaiting Payment",
  "Payment Confirmed",
  "Queued",
  "Running",
  "Completed",
];

export type Hire = {
  id: string;
  agentId: string;
  agentName: string;
  agentThumbnail: string;
  task: string;
  category: string;
  status: HireStatus;
  /** 0-100, only meaningful while Running */
  progress: number;
  startedAt: string;
  completedAt?: string;
  /** seconds; derived for completed jobs */
  executionSeconds?: number;
  /** USD cost */
  cost: number;
  /** BNB amount string, e.g. "0.00042" */
  bnbCost: string;
  result?: string;
  output?: string;
  currentStep?: string;
  transaction: {
    hash: string;
    status: "Confirmed" | "Pending" | "Failed";
    network: string;
  };
  performance: {
    successRate: number;
    avgResponseSeconds: number;
    reputation: number;
  };
};
