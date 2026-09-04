import { ArrowLeft, ArrowUpRight, Check, Plus } from "lucide-react";
import { Link, useParams } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/hires/StatusBadge";
import { formatDuration, formatDate, formatTime, formatUsd, getHireById } from "@/data/hires";

export default function HireDetailPage() {
  const { hireId } = useParams<{ hireId: string }>();
  const hire = hireId ? getHireById(hireId) : undefined;

  if (!hire) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">Hire not found</h1>
        <p className="text-[13px] text-muted-foreground">
          This hire may have been removed or the link is incorrect.
        </p>
        <Link
          to="/hires"
          className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Hires
        </Link>
      </div>
    );
  }

  const execution =
    hire.executionSeconds != null
      ? formatDuration(hire.executionSeconds)
      : hire.completedAt
        ? formatDuration(
            Math.max(
              0,
              Math.round(
                (new Date(hire.completedAt).getTime() - new Date(hire.startedAt).getTime()) / 1000,
              ),
            ),
          )
        : "—";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/hires"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Hires
        </Link>

        <header className="mt-6 flex items-start gap-4">
          <img
            src={hire.agentThumbnail}
            alt=""
            className="h-14 w-14 shrink-0 rounded-[2px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-[22px] font-semibold tracking-tight text-white">
                {hire.agentName}
              </h1>
              <StatusBadge status={hire.status} />
            </div>
            <p className="mt-1 text-[14px] text-muted-foreground">{hire.task}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Hired {formatDate(hire.startedAt)}
              {hire.completedAt ? `, ${formatDate(hire.completedAt)}` : ""}
            </p>
          </div>
        </header>

        {hire.result ? (
          <Section title="Result">
            <p className="text-[14px] leading-relaxed text-foreground">{hire.result}</p>
            {hire.output ? (
              <div className="mt-3 rounded-[2px] border border-border bg-surface p-3">
                <p className="mb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  Agent Output
                </p>
                <p className="text-[13px] leading-relaxed text-muted-foreground">{hire.output}</p>
              </div>
            ) : null}
          </Section>
        ) : null}

        <Section title="Job Details">
          <DetailGrid
            rows={[
              { label: "Agent", value: hire.agentName },
              { label: "Category", value: hire.category },
              { label: "Started", value: formatTime(hire.startedAt) },
              {
                label: hire.status === "Completed" ? "Completed" : "Status",
                value: hire.completedAt ? formatTime(hire.completedAt) : hire.status,
              },
              { label: "Execution time", value: execution },
              { label: "Cost", value: formatUsd(hire.cost) },
            ]}
          />
        </Section>

        <Section title="Transaction">
          <DetailGrid
            rows={[
              { label: "Payment", value: shortHash(hire.transaction.hash) },
              {
                label: "Status",
                value: (
                  <span className="inline-flex items-center gap-1.5">
                    {hire.transaction.status === "Confirmed" ? (
                      <Check className="h-3.5 w-3.5 text-emerald" />
                    ) : (
                      <span
                        className={
                          hire.transaction.status === "Failed"
                            ? "h-1.5 w-1.5 rounded-full bg-destructive"
                            : "h-1.5 w-1.5 rounded-full bg-[#FAC102]"
                        }
                      />
                    )}
                    {hire.transaction.status}
                  </span>
                ),
              },
              { label: "Network", value: hire.transaction.network },
            ]}
          />
          <a
            href={`https://bscscan.com/tx/${hire.transaction.hash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex h-8 items-center gap-1 rounded-[2px] border border-border px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
          >
            View on Explorer
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </Section>

        <Section title="Agent Performance">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Success rate" value={`${hire.performance.successRate}%`} />
            <Stat
              label="Avg. response"
              value={formatDuration(hire.performance.avgResponseSeconds)}
            />
            <Stat label="Reputation" value={`${hire.performance.reputation} / 5`} />
          </div>
        </Section>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild className="bg-[#FAC102] text-black hover:bg-[#FAC102]/90">
            <Link to="/agents">
              <Plus className="h-4 w-4" />
              Hire Again
            </Link>
          </Button>
          <Button
            asChild
            className="border border-border bg-transparent text-foreground hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
          >
            <Link to="/agents">View Agent</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[2px] border border-border bg-surface/40 p-4">
      <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DetailGrid({ rows }: { rows: Array<{ label: string; value: React.ReactNode }> }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
      {rows.map((row) => (
        <div key={row.label} className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{row.label}</dt>
          <dd className="mt-0.5 truncate text-[13px] font-medium text-foreground">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[2px] border border-border bg-background p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-[16px] font-semibold text-white">{value}</p>
    </div>
  );
}

function shortHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}
