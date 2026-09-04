import { Link } from "@/lib/router";
import type { Hire } from "@/types/hire";
import { formatDate, formatUsd } from "@/data/hires";
import { StatusBadge } from "./StatusBadge";

export function HireTable({ hires }: { hires: Hire[] }) {
  if (hires.length === 0) {
    return (
      <p className="rounded-[2px] border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
        No hires match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2px] border border-border">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-[13px] md:table">
        <thead className="bg-surface text-[11px] tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Agent</th>
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Cost</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {hires.map((hire) => (
            <tr key={hire.id} className="group transition-colors hover:bg-surface/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={hire.agentThumbnail}
                    alt=""
                    className="h-8 w-8 rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <span className="font-medium text-foreground">{hire.agentName}</span>
                </div>
              </td>
              <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">
                {hire.task}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{hire.category}</td>
              <td className="px-4 py-3">
                <StatusBadge status={hire.status} />
              </td>
              <td className="px-4 py-3 text-foreground">{formatUsd(hire.cost)}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(hire.startedAt)}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/hires/${hire.id}`}
                  className="text-[12px] font-medium text-muted-foreground transition-colors hover:text-[#FAC102]"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden">
        {hires.map((hire) => (
          <li key={hire.id}>
            <Link
              to={`/hires/${hire.id}`}
              className="block p-4 transition-colors hover:bg-surface/50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <img
                    src={hire.agentThumbnail}
                    alt=""
                    className="h-9 w-9 rounded-[2px] object-cover"
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
              <div className="mt-3 flex items-center justify-between text-[12px] text-muted-foreground">
                <span>{hire.category}</span>
                <span className="font-medium text-foreground">{formatUsd(hire.cost)}</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {formatDate(hire.startedAt)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
