export type ActivityType =
  | "Agent completed"
  | "Transaction confirmed"
  | "Agent hired"
  | "AI interaction"
  | "Wallet connected"
  | "Agent started"
  | "Payment sent"
  | "Permission changed";

export type ActivityCategory =
  "Hires" | "Agents" | "Transactions" | "Payments" | "Wallet" | "AI" | "Security";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  category: ActivityCategory;
  title: string;
  description: string;
  time: string;
  dateGroup: "Today" | "Yesterday";
  hireId?: string;
  transactionHash?: string;
  conversation?: string;
  metadata: Array<{ label: string; value: string }>;
};
