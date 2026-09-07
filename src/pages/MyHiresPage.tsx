import { useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { Link } from "@/lib/router";
import { AppShell } from "@/components/app/AppShell";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { Button } from "@/components/ui/button";
import { ExportDialog, type ExportRow } from "@/components/export/ExportDialog";
import { SummaryCards } from "@/components/hires/SummaryCards";
import { ActiveHires } from "@/components/hires/ActiveHires";
import { HireTable } from "@/components/hires/HireTable";
import { AskGrid } from "@/components/hires/AskGrid";
import { formatDate, formatUsd, hires, isLive, statusGroup, type StatusGroup } from "@/data/hires";
import { cn } from "@/lib/utils";

const statusFilters: Array<StatusGroup | "All"> = [
  "All",
  "Active",
  "Completed",
  "Pending",
  "Failed",
  "Cancelled",
];

export default function MyHiresPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusGroup | "All">("All");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hires.filter((hire) => {
      const matchesStatus =
        status === "All" ||
        (status === "Active" ? hire.status === "Running" : statusGroup(hire.status) === status);
      const matchesQuery =
        q.length === 0 ||
        [hire.agentName, hire.task, hire.category, hire.status].join(" ").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const activeHires = useMemo(() => filtered.filter((hire) => isLive(hire.status)), [filtered]);

  const handleAskGridFilter = (next: StatusGroup | "All") => {
    setStatus(next);
    setQuery("");
  };

  const exportRows: ExportRow[] = filtered.map((hire) => ({
    Agent: hire.agentName,
    Task: hire.task,
    Category: hire.category,
    Status: hire.status,
    Cost: formatUsd(hire.cost),
    Date: formatDate(hire.startedAt),
    Transaction: hire.transaction.hash,
  }));

  return (
    <AppShell
      header={
        <div className="w-full max-w-[520px]">
          <AgentSearch value={query} onChange={setQuery} />
        </div>
      }
    >
      <div className="px-3 pb-8 sm:px-5">
        <div className="flex items-center justify-between gap-3 px-1 py-4 sm:px-0">
          <h1 className="text-[16px] font-semibold text-white">My Hires</h1>
          <div className="flex items-center gap-2">
            <Button
              className="tip tip--bottom h-7 border border-transparent bg-[#FAC102] px-3 font-normal text-[12px] text-black transition-colors hover:bg-[#FAC102]/90"
              data-tip="Export filtered hires"
              onClick={() => setExportOpen(true)}
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
            <Button
              asChild
              className="h-7 border border-transparent bg-[#333333] px-4 font-normal text-[12px] text-white transition-colors hover:bg-[#3d3d3d]"
            >
              <Link to="/agents">Hire an Agent</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-6 rounded-[2px] border border-border bg-black p-4 sm:p-5">
          <SummaryCards hires={hires} />

          <div className="flex flex-wrap items-center gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatus(filter)}
                className={cn(
                  "h-7 rounded-[2px] border px-4 text-[12px] font-medium transition-colors",
                  status === filter
                    ? "border-black bg-black text-white"
                    : "border-transparent bg-[#333333] text-white hover:bg-[#3d3d3d]",
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          <ActiveHires hires={activeHires} />

          <section>
            <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-foreground uppercase">
              All Hires
            </h2>
            <HireTable hires={filtered} />
          </section>

          <AskGrid onFilter={handleAskGridFilter} />
        </div>
      </div>

      {exportOpen ? (
        <ExportDialog
          title="Export hires"
          countLabel={`${filtered.length} hire${filtered.length === 1 ? "" : "s"}`}
          filename="agentgrid-hires"
          sheetName="Hires"
          rows={exportRows}
          onClose={() => setExportOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}
