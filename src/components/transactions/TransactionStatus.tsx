import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types/transaction";

const statusStyles: Record<TransactionStatus, string> = {
  Created: "text-muted-foreground",
  "Awaiting Signature": "text-[#FAC102]",
  Submitted: "text-[#FAC102]",
  Pending: "text-[#FAC102]",
  Confirmed: "text-emerald",
  Rejected: "text-destructive",
  Failed: "text-destructive",
  Expired: "text-muted-foreground",
  Cancelled: "text-muted-foreground",
};

export function TransactionStatus({ status }: { status: TransactionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap",
        statusStyles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
