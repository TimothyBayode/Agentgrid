import { cn } from "@/lib/utils";
import type { HireStatus } from "@/types/hire";

type StatusStyle = {
  dot: string;
  text: string;
};

const styles: Record<HireStatus, StatusStyle> = {
  Pending: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  "Awaiting Payment": { dot: "bg-[#FAC102]", text: "text-[#FAC102]" },
  "Payment Confirmed": { dot: "bg-[#FAC102]/70", text: "text-[#FAC102]" },
  Queued: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  Running: { dot: "bg-emerald", text: "text-emerald" },
  Completed: { dot: "bg-foreground", text: "text-foreground" },
  Failed: { dot: "bg-destructive", text: "text-destructive" },
  Cancelled: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
  Expired: { dot: "bg-muted-foreground/60", text: "text-muted-foreground" },
};

export function StatusBadge({ status, className }: { status: HireStatus; className?: string }) {
  const style = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap",
        style.text,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {status}
    </span>
  );
}
