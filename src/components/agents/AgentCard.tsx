import { Star, Zap } from "lucide-react";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

const statusStyles: Record<Agent["status"], string> = {
  online: "bg-emerald",
  busy: "bg-chart-4",
  offline: "bg-muted-foreground",
};

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-[2px] bg-surface">
        <img
          src={agent.thumbnail}
          alt={`${agent.name} cover`}
          loading="lazy"
          width={768}
          height={768}
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {agent.badge ? (
          <span className="absolute top-2 right-2 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm">
            {agent.badge}
          </span>
        ) : null}
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[10px] text-foreground/80 backdrop-blur-sm">
          <Zap className="h-3 w-3 text-brand" />
          {agent.pricePerRun}
        </span>
      </div>

      <div className="mt-3 flex gap-3">
        <span
          className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-background"
          style={{ backgroundColor: agent.avatarTint }}
          aria-hidden
        >
          {agent.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold text-foreground">{agent.name}</h3>
          <p className="truncate text-[12px] text-muted-foreground">{agent.creator}</p>
          <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted-foreground/80">
            {agent.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
              {agent.reputation.toFixed(1)}
            </span>
            <span>{(agent.runs / 1000).toFixed(1)}k runs</span>
            <span className="inline-flex items-center gap-1.5">
              <i className={cn("h-1.5 w-1.5 rounded-full", statusStyles[agent.status])} />
              {agent.status}
            </span>
          </div>

          <ul className="mt-2 flex flex-wrap gap-1.5">
            {agent.capabilities.slice(0, 3).map((capability) => (
              <li
                key={capability}
                className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
