import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

export function Logo({ className, size = "h-7" }: { className?: string; size?: string }) {
  return (
    <Link
      to="/"
      className={cn("flex shrink-0 items-center", className)}
      aria-label="AgentGrid home"
    >
      <img src="/logo.svg" alt="AgentGrid" className={cn("w-auto", size)} />
    </Link>
  );
}
