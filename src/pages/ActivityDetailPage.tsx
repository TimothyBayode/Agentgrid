import { ArrowLeft, ArrowUpRight, Check, CircleCheck, Clock3 } from "lucide-react";
import { Link, useParams } from "@/lib/router";
import { getActivityById } from "@/data/activity";

export default function ActivityDetailPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const event = activityId ? getActivityById(activityId) : undefined;

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">Activity not found</h1>
        <p className="text-[13px] text-muted-foreground">
          This activity event is no longer available.
        </p>
        <Link
          to="/activity"
          className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Activity
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/activity"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Activity
        </Link>

        <header className="mt-6 flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[2px] bg-[#FAC102] text-black">
            {event.type === "Transaction confirmed" ? (
              <Check className="h-5 w-5" />
            ) : event.type === "Wallet connected" ? (
              <Clock3 className="h-5 w-5" />
            ) : (
              <CircleCheck className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[22px] font-semibold tracking-tight text-white">{event.type}</h1>
              <span className="text-[12px] font-medium text-emerald">Successful</span>
            </div>
            <p className="mt-1 text-[14px] text-muted-foreground">{event.title}</p>
            <p className="mt-1 text-[12px] text-muted-foreground">
              {event.dateGroup} at {event.time}
            </p>
          </div>
        </header>

        <section className="mt-6 rounded-[2px] border border-border bg-surface p-4">
          <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
            Event details
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            {event.metadata.map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="text-[11px] text-muted-foreground">{item.label}</dt>
                <dd className="mt-0.5 truncate text-[13px] font-medium text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {event.conversation ? (
          <section className="mt-6 rounded-[2px] border border-[#FAC102]/25 bg-[#FAC102]/5 p-4">
            <h2 className="mb-2 text-[12px] font-semibold tracking-wide text-[#FAC102] uppercase">
              Nexus response
            </h2>
            <p className="text-[13px] leading-relaxed text-foreground">{event.conversation}</p>
          </section>
        ) : null}

        {event.hireId ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to={`/hires/${event.hireId}`}
              className="inline-flex h-9 items-center rounded-[2px] bg-[#FAC102] px-4 text-[13px] font-medium text-black transition-colors hover:bg-[#FAC102]/90"
            >
              View Hire
            </Link>
            {event.transactionHash ? (
              <a
                href={`https://bscscan.com/tx/${event.transactionHash}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
              >
                View on Explorer
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        ) : null}

        {event.transactionHash && !event.hireId ? (
          <a
            href={`https://bscscan.com/tx/${event.transactionHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex h-9 items-center gap-1.5 rounded-[2px] border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
          >
            View on Explorer
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
