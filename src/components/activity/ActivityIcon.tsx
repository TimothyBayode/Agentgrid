import {
  Bot,
  BotMessageSquare,
  CircleCheck,
  CreditCard,
  KeyRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ActivityType } from "@/types/activity";

const icons: Record<ActivityType, LucideIcon> = {
  "Agent completed": CircleCheck,
  "Transaction confirmed": CircleCheck,
  "Agent hired": Bot,
  "AI interaction": BotMessageSquare,
  "Wallet connected": Wallet,
  "Agent started": Bot,
  "Payment sent": CreditCard,
  "Permission changed": KeyRound,
};

export function ActivityIcon({ type }: { type: ActivityType }) {
  const Icon = icons[type];
  return <Icon className="h-4 w-4" />;
}
