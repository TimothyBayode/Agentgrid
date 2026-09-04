import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import type { ActivityEvent } from "@/types/activity";
import { ActivityIcon } from "./ActivityIcon";

const categoryColors: Record<ActivityEvent["category"], string> = {
  Hires: "bg-[#FAC102] text-black",
  Agents: "bg-emerald text-black",
  Transactions: "bg-white text-black",
  Payments: "bg-white text-black",
  Wallet: "bg-[#FAC102] text-black",
  AI: "bg-white text-black",
  Security: "bg-destructive text-white",
};

export function ActivityTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="rounded-[2px] border border-dashed border-border p-10 text-center text-[13px] text-muted-foreground">
        No activity matches your filters.
      </p>
    );
  }

  const groups = events.reduce<Record<string, ActivityEvent[]>>((result, event) => {
    (result[event.dateGroup] ??= []).push(event);
    return result;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, groupEvents]) => (
        <section key={group}>
          <h2 className="mb-4 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            {group}
          </h2>
          <div className="relative space-y-3 before:absolute before:top-3 before:bottom-3 before:left-[19px] before:w-px before:bg-border">
            {groupEvents.map((event) => (
              <article key={event.id} className="relative flex gap-3">
                <div
                  className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-[2px] ${categoryColors[event.category]}`}
                >
                  <ActivityIcon type={event.type} />
                </div>
                <div className="min-w-0 flex-1 rounded-[2px] border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{event.type}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {event.title}
                      </p>
                    </div>
                    <time className="shrink-0 text-[11px] text-muted-foreground">{event.time}</time>
                  </div>

                  <p className="mt-3 text-[12px] text-foreground">{event.description}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">{event.category}</span>
                    {event.hireId ? (
                      <Link
                        to={`/hires/${event.hireId}`}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-[#FAC102]"
                      >
                        View Hire
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : event.transactionHash ? (
                      <a
                        href={`https://bscscan.com/tx/${event.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-[#FAC102]"
                      >
                        View Transaction
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={`/activity/${event.id}`}
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-[#FAC102]"
                      >
                        {event.conversation ? "View Conversation" : "View Details"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
