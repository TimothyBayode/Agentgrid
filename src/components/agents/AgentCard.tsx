import { useState } from "react";
import { Star, Wallet } from "lucide-react";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusStyles: Record<Agent["status"], string> = {
  online: "bg-emerald",
  busy: "bg-chart-4",
  offline: "bg-muted-foreground",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View details for ${agent.name}`}
        className="group block w-full text-left"
      >
        <div className="relative overflow-hidden rounded-[2px] bg-surface">
          <img
            src={agent.thumbnail}
            alt={`${agent.name} preview`}
            loading="lazy"
            width={500}
            height={300}
            className="aspect-[5/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {agent.badge ? (
            <span className="absolute top-2 left-2 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm">
              {agent.badge}
            </span>
          ) : null}
        </div>
        <div className="mt-1.5 flex items-center gap-1">
          <h3 className="min-w-0 truncate text-[12px] font-semibold text-foreground">
            {agent.name}
          </h3>
          <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] text-muted-foreground">
            <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
            {agent.reputation.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Wallet className="h-3 w-3 text-muted-foreground" />
          {agent.pricePerRun}
        </p>
      </button>

      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-[2px] border-border bg-surface p-0">
        <div className="relative">
          <img
            src={agent.thumbnail}
            alt={`${agent.name} preview`}
            width={640}
            height={360}
            className="aspect-[16/9] w-full object-cover"
          />
          {agent.badge ? (
            <span className="absolute top-3 left-3 rounded-md bg-background/85 px-2 py-1 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm">
              {agent.badge}
            </span>
          ) : null}
        </div>

        <div className="p-5">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[18px] text-foreground">{agent.name}</DialogTitle>
            <DialogDescription className="text-[13px]">
              {agent.creator} · {agent.protocol}
            </DialogDescription>
          </DialogHeader>

          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            {agent.description}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Detail label="Reputation">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-chart-4 text-chart-4" />
                {agent.reputation.toFixed(1)}
              </span>
            </Detail>
            <Detail label="Total runs">{(agent.runs / 1000).toFixed(1)}k</Detail>
            <Detail label="Price per run">{agent.pricePerRun}</Detail>
            <Detail label="Status">
              <span className="inline-flex items-center gap-1.5">
                <i className={cn("h-1.5 w-1.5 rounded-full", statusStyles[agent.status])} />
                {agent.status}
              </span>
            </Detail>
            <Detail label="Category">{agent.category}</Detail>
            <Detail label="Protocol">{agent.protocol}</Detail>
          </dl>

          <div className="mt-5">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Capabilities
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {agent.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {capability}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2px] border border-border bg-background px-3 py-2">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-foreground">{children}</dd>
    </div>
  );
}
