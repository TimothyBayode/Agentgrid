import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  Copy,
  ExternalLink,
  Pause,
  Play,
  Plus,
  Settings2,
  Star,
  Users,
} from "lucide-react";
import { Link, useNavigate, useParams } from "@/lib/router";
import { AppShell } from "@/components/app/AppShell";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { Button } from "@/components/ui/button";
import { agents } from "@/data/agents";
import { getOwnedAgent, ownedAgents, type OwnedAgentStatus } from "@/data/my-agents";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const statusStyles: Record<OwnedAgentStatus, string> = {
  Live: "border-emerald/40 bg-emerald/10 text-emerald",
  Draft: "border-white/15 bg-white/5 text-muted-foreground",
  Paused: "border-chart-4/40 bg-chart-4/10 text-chart-4",
  "Under Review": "border-[#FAC102]/40 bg-[#FAC102]/10 text-[#FAC102]",
  Unlisted: "border-white/15 bg-white/5 text-muted-foreground",
  Suspended: "border-destructive/40 bg-destructive/10 text-destructive",
};

export default function MyAgentsPage() {
  const { agentId } = useParams<{ agentId?: string }>();
  return agentId ? <AgentManagement agentId={agentId} /> : <MyAgentsDashboard />;
}

function MyAgentsDashboard() {
  const [query, setQuery] = useState("");
  const [walletCopied, setWalletCopied] = useState(false);
  const [status, setStatus] = useState<OwnedAgentStatus | "All">("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Performance");
  const owned = useMemo(
    () =>
      ownedAgents.map((item) => ({
        ...item,
        agent: agents.find((agent) => agent.id === item.agentId)!,
      })),
    [],
  );
  const categories = ["All", ...new Set(owned.map(({ agent }) => agent.category))];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return owned
      .filter(
        ({ agent, status: agentStatus }) =>
          (!normalized ||
            `${agent.name} ${agent.description} ${agent.category}`
              .toLowerCase()
              .includes(normalized)) &&
          (status === "All" || agentStatus === status) &&
          (category === "All" || agent.category === category),
      )
      .sort((a, b) => (sort === "Earnings" ? b.earnings - a.earnings : b.hires - a.hires));
  }, [category, owned, query, sort, status]);
  const totalHires = owned.reduce((sum, item) => sum + item.hires, 0);
  const totalEarnings = owned.reduce((sum, item) => sum + item.earnings, 0);
  const active = owned.filter((item) => item.status === "Live").length;

  return (
    <AppShell
      header={
        <div className="w-full max-w-[520px]">
          <AgentSearch value={query} onChange={setQuery} />
        </div>
      }
    >
      <main className="px-3 pb-10 sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-4 py-6">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-white">My Agents</h1>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Manage your agents, monitor performance, and control their marketplace presence.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Button
              disabled
              className="h-7 cursor-not-allowed gap-2 bg-[#FAC102] px-3 text-[12px] text-black opacity-80"
            >
              <Plus className="h-3.5 w-3.5" />
              List an Agent
              <span className="rounded-[2px] bg-black/15 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase">
                Soon
              </span>
            </Button>
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald" />
              Connected wallet <code className="text-foreground">0x71...92F</code>
              <button
                type="button"
                aria-label="Copy connected wallet address"
                data-tip={walletCopied ? "Copied" : "Copy wallet address"}
                onClick={() => {
                  void navigator.clipboard.writeText("0x71...92F");
                  setWalletCopied(true);
                  window.setTimeout(() => setWalletCopied(false), 1500);
                }}
                className="tip tip--bottom rounded-[2px] p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-[#FAC102]"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <section className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            label="Total agents"
            value={owned.length}
            detail={`${owned.filter((item) => item.status === "Draft").length} in setup`}
          />
          <Metric
            label="Active agents"
            value={active}
            detail={`${owned.reduce((sum, item) => sum + item.jobsToday, 0)} jobs today`}
          />
          <Metric
            label="Total hires"
            value={totalHires.toLocaleString()}
            detail={`${owned.reduce((sum, item) => sum + item.completed, 0).toLocaleString()} completed`}
          />
          <Metric
            label="Earnings"
            value={`$${totalEarnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            detail="$382.40 pending"
          />
        </section>

        <div className="flex flex-col items-start gap-2 py-4 lg:flex-row">
          <FilterSelect
            label="Status"
            value={status}
            options={["All", "Live", "Draft", "Paused", "Under Review", "Unlisted", "Suspended"]}
            onChange={(value) => setStatus(value as OwnedAgentStatus | "All")}
          />
          <FilterSelect
            label="Category"
            value={category}
            options={categories}
            onChange={setCategory}
          />
          <FilterSelect
            label="Sort"
            value={sort}
            options={["Performance", "Earnings"]}
            onChange={setSort}
          />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              My agents
            </h2>
            <span className="text-[11px] text-muted-foreground">
              {filtered.length} of {owned.length}
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-3">
            {filtered.map(({ agent, ...ownership }) => (
              <OwnerAgentCard key={agent.id} agent={agent} ownership={ownership} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="border border-dashed border-border py-12 text-center text-[13px] text-muted-foreground">
              No owned agents match these filters.
            </div>
          ) : null}
        </section>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <div className="border border-border bg-background p-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#FAC102]" />
              <h2 className="text-[14px] font-semibold">Portfolio performance</h2>
            </div>
            <div className="mt-5 flex h-32 items-end gap-2 border-b border-l border-border px-3">
              {[34, 45, 42, 58, 70, 66, 84, 92, 88, 100].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-[#FAC102]/70 transition-colors hover:bg-[#FAC102]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Aug 01</span>
              <span>Sep 04</span>
            </div>
          </div>
          <div className="border border-[#FAC102]/30 bg-background p-5">
            <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Pending earnings
            </p>
            <p className="mt-3 text-[25px] font-semibold text-white">$382.40</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              From 14 unsettled jobs across your live agents.
            </p>
            <Button
              asChild
              variant="outline"
              className="mt-5 w-full border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
            >
              <Link to="/transactions">
                View transactions
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon?: LucideIcon;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="border border-border bg-background p-4">
      {Icon ? <Icon className="h-4 w-4 text-[#FAC102]" /> : null}
      <p className="text-[24px] font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">{label}</p>
      <p className="mt-3 text-[11px] text-emerald">{detail}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-9 min-w-28 cursor-pointer items-center justify-between gap-2 rounded-[2px] border border-border bg-background px-3 text-[12px] text-foreground transition-colors hover:border-[#FAC102]/60"
      >
        <span>
          <span className="text-muted-foreground">{label}: </span>
          {value === "All" ? "Any" : value}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+4px)] left-0 z-30 min-w-full overflow-hidden rounded-[2px] border border-border bg-black p-1 shadow-xl"
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={cn(
                "block w-full cursor-pointer rounded-[2px] px-3 py-2 text-left text-[12px] whitespace-nowrap transition-colors",
                option === value
                  ? "bg-[#FAC102] text-black"
                  : "text-white hover:bg-[#FAC102] hover:text-black",
              )}
            >
              {option === "All" ? `All ${label.toLowerCase()}` : option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function OwnerAgentCard({
  agent,
  ownership,
}: {
  agent: (typeof agents)[number];
  ownership: (typeof ownedAgents)[number];
}) {
  return (
    <article className="border border-border bg-background p-5 transition-colors hover:border-white/25">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[2px] border border-border bg-surface">
          <img src={agent.thumbnail} alt="" className="h-full w-full rounded-[2px] object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold text-foreground">{agent.name}</h3>
            <StatusBadge status={ownership.status} />
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {agent.category} · {agent.protocol}
          </p>
        </div>
        <span className="text-[11px] text-muted-foreground">{ownership.visibility}</span>
      </div>
      <p className="mt-5 text-[13px] font-medium text-foreground">{agent.description}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 py-3">
        <Stat icon={Star} value={agent.reputation.toFixed(1)} label="Rating" />
        <Stat value={`${ownership.successRate}%`} label="Success" />
        <Stat value={ownership.hires.toLocaleString()} label="Hires" />
      </div>
      {ownership.status === "Draft" ? (
        <p className="mt-4 text-[12px] text-muted-foreground">
          Not currently visible in the marketplace.
        </p>
      ) : (
        <p className="mt-4 text-[12px] text-muted-foreground">
          Earnings{" "}
          <strong className="ml-1 font-medium text-foreground">
            ${ownership.earnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </strong>
        </p>
      )}
      <div className="mt-5 flex gap-2">
        <Button
          asChild
          className="flex-1 bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90"
        >
          <Link to={`/my-agents/${agent.id}`}>
            {ownership.status === "Draft" ? "Continue setup" : "Manage"}
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          <Link to={`/agents`}>
            Marketplace profile
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function Stat({ icon: Icon, value, label }: { icon?: typeof Star; value: string; label: string }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[13px] font-semibold text-foreground">
        {Icon ? <Icon className="h-3 w-3 fill-[#FAC102] text-[#FAC102]" /> : null}
        {value}
      </p>
      <p className="mt-1 text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
function StatusBadge({ status }: { status: OwnedAgentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[2px] border px-2 py-1 text-[10px] font-semibold",
        statusStyles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function AgentManagement({ agentId }: { agentId: string }) {
  const navigate = useNavigate();
  const item = getOwnedAgent(agentId);
  const [paused, setPaused] = useState(item?.status === "Paused");
  if (!item) return <div className="p-10 text-center text-muted-foreground">Agent not found.</div>;
  const status = paused ? "Paused" : item.status;
  return (
    <AppShell
      header={
        <Link
          to="/my-agents"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-foreground hover:text-[#FAC102]"
        >
          <ArrowLeft className="h-4 w-4" />
          My Agents
        </Link>
      }
      actions={
        <Button
          asChild
          variant="outline"
          className="h-7 border-border px-3 text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          <Link to="/agents">View marketplace</Link>
        </Button>
      }
    >
      <main className="px-3 pb-10 sm:px-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border py-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold text-white">{item.name}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="mt-2 text-[13px] text-muted-foreground">{item.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-8 border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume agent" : "Pause agent"}
            </Button>
            <Button className="h-8 bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90">
              <Settings2 className="h-3.5 w-3.5" />
              Configure
            </Button>
          </div>
        </div>
        <div className="grid gap-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={Users}
            label="Hires"
            value={item.hires.toLocaleString()}
            detail="+12% this month"
          />
          <Metric
            icon={Check}
            label="Completed"
            value={item.completed.toLocaleString()}
            detail={`${item.successRate}% success rate`}
          />
          <Metric
            icon={Star}
            label="Rating"
            value={item.reputation.toFixed(1)}
            detail="AgentGrid feedback"
          />
          <Metric
            icon={CircleDollarSign}
            label="Earnings"
            value={`$${item.earnings.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
            detail="$124.20 pending"
          />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <section className="border border-border bg-background p-5">
            <SectionTitle title="Performance" />
            <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-border px-4">
              {[30, 38, 35, 48, 52, 61, 58, 74, 81, 94, 88, 100].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-[#FAC102]/70"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              <span>Aug</span>
              <span>Sep</span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
              <Stat value={`${item.successRate}%`} label="Success rate" />
              <Stat value="2m 14s" label="Avg. execution" />
              <Stat value={item.reputation.toFixed(1)} label="Avg. rating" />
              <Stat value={item.completed.toLocaleString()} label="Total jobs" />
            </div>
          </section>
          <section className="border border-border bg-background p-5">
            <SectionTitle title="Reputation" />
            <div className="mt-5 text-[22px] tracking-[0.12em] text-[#FAC102]">★★★★★</div>
            <p className="mt-1 text-[18px] font-semibold text-foreground">
              {item.reputation.toFixed(1)}{" "}
              <span className="text-[12px] font-normal text-muted-foreground">
                AgentGrid rating
              </span>
            </p>
            <div className="mt-5 space-y-3 border-t border-border pt-4">
              <Review text="Completed the task exactly as requested." wallet="0x83...91F" />
              <Review text="Fast execution and accurate result." wallet="0x12...A92" />
            </div>
          </section>
        </div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <InfoPanel title="Agent information">
            <InfoRow label="Category" value={item.category} />
            <InfoRow label="Capabilities" value={item.capabilities.join(" · ")} />
            <InfoRow label="Pricing" value={item.pricePerRun} />
          </InfoPanel>
          <InfoPanel title="Onchain identity">
            <InfoRow label="Standard" value="ERC-8004" />
            <InfoRow label="Agent ID" value="#82931" />
            <InfoRow label="Owner" value="0x71...92F" />
            <InfoRow label="Network" value="BNB Smart Chain" />
            <Button
              variant="outline"
              className="mt-4 w-full border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
              onClick={() => navigate("/transactions")}
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              View transactions
            </Button>
          </InfoPanel>
        </div>
        <InfoPanel title="Marketplace controls">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow label="Visibility" value={item.visibility} />
            <InfoRow label="Accept new hires" value={item.acceptHires ? "ON" : "OFF"} />
            <InfoRow label="Maximum concurrent jobs" value="10" />
            <InfoRow label="Payment asset" value="USDT · BNB Smart Chain" />
          </div>
          <Button className="mt-5 bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90">
            Save changes
          </Button>
        </InfoPanel>
      </main>
    </AppShell>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
      {title}
    </h2>
  );
}
function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-border bg-background p-5">
      <SectionTitle title={title} />
      <div className="mt-4">{children}</div>
    </section>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 first:pt-0 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[13px] text-foreground">{value}</span>
    </div>
  );
}
function Review({ text, wallet }: { text: string; wallet: string }) {
  return (
    <div>
      <div className="text-[12px] tracking-widest text-[#FAC102]">★★★★★</div>
      <p className="mt-1 text-[12px] text-foreground">“{text}”</p>
      <p className="mt-1 text-[10px] text-muted-foreground">{wallet}</p>
    </div>
  );
}
