import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "flex shrink-0 items-center gap-2 font-display text-[15px] font-bold tracking-tight text-foreground",
        className,
      )}
      aria-label="AgentGrid home"
    >
      <span className="grid h-6 w-6 place-items-center rounded-md bg-foreground/10">
        <span className="grid grid-cols-2 gap-[2px]">
          <i className="block h-[5px] w-[5px] rounded-[1px] bg-brand" />
          <i className="block h-[5px] w-[5px] rounded-[1px] bg-foreground/70" />
          <i className="block h-[5px] w-[5px] rounded-[1px] bg-foreground/40" />
          <i className="block h-[5px] w-[5px] rounded-[1px] bg-emerald" />
        </span>
      </span>
      AgentGrid
    </Link>
  );
}
