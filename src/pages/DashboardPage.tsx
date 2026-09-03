import { Activity, ArrowRight, Gauge, Plus, Star, Wallet } from "lucide-react";
import { Link, useNavigate } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { agents } from "@/data/agents";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

const statusStyles: Record<Agent["status"], string> = {
  online: "bg-emerald",
  busy: "bg-chart-4",
  offline: "bg-muted-foreground",
};

const stats = [
  {
    icon: Activity,
    label: "Active agents",
    value: "3",
    trend: "+1 this week",
  },
  {
    icon: Gauge,
    label: "Runs today",
    value: "128",
    trend: "+12% vs yesterday",
  },
  {
    icon: Wallet,
    label: "Spend this month",
    value: "0.014 BNB",
    trend: "Pay-per-run",
  },
  {
    icon: Star,
    label: "Average reputation",
    value: "4.8",
    trend: "Across 12 agents",
  },
];

const dashboardAgents = agents.slice(0, 4);

const quickActions = [
  { label: "Hire an agent", href: "/agents" },
  { label: "Browse the marketplace", href: "/agents" },
  { label: "View showcase", href: "/" },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden bg-white text-black hover:bg-white/90 sm:inline-flex"
            >
              <Link to="/agents">Hire an agent</Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:text-foreground"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-medium tracking-tight text-white">
              AgentGrid Dashboard
            </h1>
            <p className="mt-2 max-w-[520px] text-[14px] text-muted-foreground">
              Monitor your agents, runs, and spend in one place.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#FAC102] text-black hover:bg-[#FAC102]/90">
            <Link to="/agents">
              <Plus className="h-4 w-4" />
              Hire an agent
            </Link>
          </Button>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[2px] border border-border bg-surface p-5">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-[#FAC102]" />
                <span className="text-[11px] text-muted-foreground">{stat.trend}</span>
              </div>
              <p className="mt-4 text-[26px] font-semibold tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-3 lg:grid-cols-[1.8fr_1fr]">
          <div className="rounded-[2px] border border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-[15px] font-semibold text-foreground">Your agents</h2>
              <Link
                to="/agents"
                className="text-[12px] text-muted-foreground transition-colors hover:text-[#FAC102]"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {dashboardAgents.map((agent) => (
                <li key={agent.id} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={agent.thumbnail}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[14px] font-semibold text-foreground">
                        {agent.name}
                      </h3>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          statusStyles[agent.status],
                        )}
                      />
                      <span className="text-[11px] text-muted-foreground">{agent.status}</span>
                    </div>
                    <p className="mt-1 truncate text-[12px] text-muted-foreground">
                      {agent.creator} · {agent.protocol}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="flex items-center justify-end gap-1 text-[13px] font-medium text-foreground">
                      <Star className="h-3 w-3 fill-[#FAC102] text-[#FAC102]" />
                      {agent.reputation.toFixed(1)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {(agent.runs / 1000).toFixed(1)}k runs
                    </p>
                  </div>
                  <span className="hidden rounded-[2px] border border-border bg-background px-3 py-1.5 text-[12px] text-foreground md:inline-flex">
                    {agent.pricePerRun}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <Link to="/agents">View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[2px] border border-border bg-surface p-5">
              <h2 className="text-[15px] font-semibold text-foreground">Quick actions</h2>
              <ul className="mt-4 grid gap-2">
                {quickActions.map((action) => (
                  <li key={action.label}>
                    <Link
                      to={action.href}
                      className="group flex items-center justify-between rounded-[2px] border border-border bg-background px-4 py-3 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102]/40"
                    >
                      {action.label}
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[#FAC102]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2px] border border-[#FAC102]/30 bg-surface p-5">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[#FAC102]" />
                <span className="text-[12px] text-muted-foreground">BNB balance</span>
              </div>
              <p className="mt-3 text-[24px] font-semibold tracking-tight text-white">0.4821 BNB</p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Pay-per-run settlement is enabled.
              </p>
              <Button
                className="mt-4 w-full bg-white text-black hover:bg-white/90"
                onClick={() => navigate("/agents")}
              >
                Browse agents
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
