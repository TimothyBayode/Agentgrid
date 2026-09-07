import { useMemo, useState } from "react";
import { Clock3, Search, Upload } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { ExportDialog, type ExportRow } from "@/components/export/ExportDialog";
import { ActivityTimeline } from "@/components/activity/ActivityTimeline";
import { AskGrid } from "@/components/hires/AskGrid";
import { activityCounts, activityEvents, activityFilters } from "@/data/activity";
import type { ActivityCategory } from "@/types/activity";
import { cn } from "@/lib/utils";

export default function ActivityPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActivityCategory | "All">("All");
  const [period, setPeriod] = useState("Today");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activityEvents.filter((event) => {
      const matchesFilter = filter === "All" || event.category === filter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [event.type, event.title, event.description, event.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesPeriod = period === "All time" || event.dateGroup === "Today";
      return matchesFilter && matchesQuery && matchesPeriod;
    });
  }, [filter, period, query]);

  const counts = activityCounts(filtered);

  const exportRows: ExportRow[] = filtered.map((event) => ({
    Type: event.type,
    Category: event.category,
    Activity: event.title,
    Details: event.description,
    Time: `${event.dateGroup}, ${event.time}`,
    Transaction: event.transactionHash ?? "",
  }));

  const handleAskGridFilter = (
    next: "All" | "Active" | "Completed" | "Pending" | "Failed" | "Cancelled",
  ) => {
    if (next === "All") {
      setFilter("All");
    } else if (next === "Failed") {
      setFilter("Security");
    } else {
      setFilter(next === "Pending" ? "Transactions" : "Agents");
    }
  };

  return (
    <AppShell
      header={
        <div className="relative w-full max-w-[520px]">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-white" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search activity..."
            aria-label="Search activity"
            className="h-10 w-full rounded-[2px] border border-border bg-black pr-4 pl-11 text-[13px] text-white transition-colors placeholder:text-white/60 focus:border-[#333333] focus:outline-none"
          />
        </div>
      }
    >
      <div className="px-3 pb-8 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-4 sm:px-0">
          <h1 className="text-[16px] font-semibold text-white">Activity</h1>
          <div className="flex items-center gap-2">
            <Button
              className="h-7 border border-transparent bg-[#FAC102] px-3 font-normal text-[12px] text-black transition-colors hover:bg-[#FAC102]/90"
              onClick={() => setExportOpen(true)}
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <button
              type="button"
              onClick={() => setPeriod(period === "Today" ? "All time" : "Today")}
              className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-transparent bg-[#333333] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#3d3d3d]"
            >
              <Clock3 className="h-3.5 w-3.5" />
              {period}
            </button>
          </div>
        </div>

        <div className="space-y-6 rounded-[2px] border border-border bg-black p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-muted-foreground">
            <span>
              <strong className="text-foreground">{counts.activities}</strong> Activities
            </span>
            <span>
              <strong className="text-foreground">{counts.hires}</strong> Hires
            </span>
            <span>
              <strong className="text-foreground">{counts.transactions}</strong> Transactions
            </span>
            <span>
              <strong className="text-foreground">{counts.ai}</strong> AI Interactions
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activityFilters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={cn(
                  "h-7 rounded-[2px] border px-4 text-[12px] font-medium transition-colors",
                  filter === option
                    ? "border-black bg-black text-white"
                    : "border-transparent bg-[#333333] text-white hover:bg-[#3d3d3d]",
                )}
              >
                {option}
              </button>
            ))}
          </div>

          <ActivityTimeline events={filtered} />

          <AskGrid onFilter={handleAskGridFilter} />
        </div>
      </div>

      {exportOpen ? (
        <ExportDialog
          title="Export activity"
          countLabel={`${filtered.length} activit${filtered.length === 1 ? "y" : "ies"}`}
          filename="agentgrid-activity"
          sheetName="Activity"
          rows={exportRows}
          onClose={() => setExportOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}
