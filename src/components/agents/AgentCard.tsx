import { useState } from "react";
import { ArrowUpRight, BotMessageSquare, Star, Wallet } from "lucide-react";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link, useNavigate } from "@/lib/router";

const statusStyles: Record<Agent["status"], string> = {
  online: "bg-emerald",
  busy: "bg-chart-4",
  offline: "bg-muted-foreground",
};

const actionButtonClasses =
  "flex-1 border border-border bg-transparent text-foreground hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black";

export function AgentCard({ agent }: { agent: Agent }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View details for ${agent.name}`}
        data-tip="View agent details"
        className="tip group block w-full text-left"
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

      <DialogContent className="max-w-3xl gap-0 overflow-hidden rounded-[2px] sm:rounded-[2px] border-border bg-surface p-0">
        <div className="grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="relative h-44 sm:h-full sm:min-h-[380px]">
            <img
              src={agent.thumbnail}
              alt={`${agent.name} preview`}
              width={720}
              height={540}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-5">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-[18px] text-foreground">{agent.name}</DialogTitle>
              <DialogDescription className="text-[13px]">
                {agent.creator} · {agent.protocol}
              </DialogDescription>
            </DialogHeader>

            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              {agent.description}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-2">
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

            <div className="mt-4">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Capabilities
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {agent.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-[2px] border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                className={actionButtonClasses}
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate(`/ask-grid?compare=${encodeURIComponent(agent.id)}`);
                }}
              >
                Compare
              </Button>
              <Button asChild className={actionButtonClasses} variant="outline">
                <a
                  href={
                    agent.onchain?.explorerTokenUrl ?? `https://bscscan.com/address/${agent.id}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View Onchain
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                className={actionButtonClasses}
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  navigate(`/ask-grid?hire=${encodeURIComponent(agent.id)}`);
                }}
              >
                Hire
              </Button>
            </div>
            <Button
              className="mt-2 w-full bg-[#FAC102] text-black hover:bg-[#FAC102]/90"
              onClick={() => {
                setOpen(false);
                navigate(`/ask-grid?hire=${encodeURIComponent(agent.id)}`);
              }}
            >
              <BotMessageSquare className="h-4 w-4" />
              Ask Grid
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[2px] border border-border bg-background px-3 py-1.5">
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium text-foreground">{children}</dd>
    </div>
  );
}
