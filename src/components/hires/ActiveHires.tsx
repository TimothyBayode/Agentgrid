import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "@/lib/router";
import type { Hire } from "@/types/hire";
import { formatUsd, relativeStart } from "@/data/hires";
import { StatusBadge } from "./StatusBadge";

export function ActiveHires({ hires }: { hires: Hire[] }) {
  if (hires.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
        </span>
        <h2 className="text-[13px] font-semibold tracking-wide text-foreground uppercase">
          Active
        </h2>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {hires.map((hire) => (
          <div key={hire.id} className="rounded-[2px] border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={hire.agentThumbnail}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-[2px] object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-foreground">
                    {hire.agentName}
                  </p>
                  <p className="truncate text-[12px] text-muted-foreground">{hire.task}</p>
                </div>
              </div>
              <StatusBadge status={hire.status} />
            </div>

            {hire.currentStep ? (
              <p className="mt-3 text-[12px] text-muted-foreground">{hire.currentStep}</p>
            ) : null}

            {hire.status === "Running" ? (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Progress</span>
                  <span>{hire.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-[#FAC102] transition-all"
                    style={{ width: `${hire.progress}%` }}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
              <span>
                Cost: <span className="text-foreground">{formatUsd(hire.cost)}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Started {relativeStart(hire.startedAt)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/hires/${hire.id}`}
                className="inline-flex h-8 items-center rounded-[2px] border border-border bg-surface px-3 text-[12px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
              >
                View Job
              </Link>
              <a
                href={`https://bscscan.com/tx/${hire.transaction.hash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-[2px] border border-border px-3 text-[12px] font-medium text-muted-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
              >
                View Transaction
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
