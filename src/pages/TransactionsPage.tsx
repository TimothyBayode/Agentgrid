import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Clock3, Search, Upload } from "lucide-react";
import { Link } from "@/lib/router";
import { AppShell } from "@/components/app/AppShell";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { Button } from "@/components/ui/button";
import { ExportDialog, type ExportRow } from "@/components/export/ExportDialog";
import { TransactionSummary } from "@/components/transactions/TransactionSummary";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { DateRangePicker } from "@/components/transactions/DateRangePicker";
import { transactionFilters, transactions, transactionMatchesFilter } from "@/data/transactions";
import type { TransactionFilter } from "@/types/transaction";
import { cn } from "@/lib/utils";

const periodOptions = ["1D", "7D", "1W", "4W", "1M", "3M", "Custom"] as const;
type Period = "All time" | (typeof periodOptions)[number];

export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TransactionFilter>("All");
  const [network, setNetwork] = useState("All networks");
  const [asset, setAsset] = useState("All assets");
  const [period, setPeriod] = useState<Period>("All time");
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();
  const [customOpen, setCustomOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const matchesQuery =
        q.length === 0 ||
        [
          transaction.type,
          transaction.agentName,
          transaction.description,
          transaction.status,
          transaction.hash,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesNetwork = network === "All networks" || transaction.network === network;
      const matchesAsset = asset === "All assets" || transaction.asset === asset;
      const matchesPeriod = transactionMatchesPeriod(
        transaction.date,
        period,
        customFrom,
        customTo,
      );
      return (
        transactionMatchesFilter(transaction, filter) &&
        matchesQuery &&
        matchesNetwork &&
        matchesAsset &&
        matchesPeriod
      );
    });
  }, [asset, customFrom, customTo, filter, network, period, query]);

  const exportRows: ExportRow[] = filtered.map((transaction) => ({
    Date: transaction.date,
    Type: transaction.type,
    Agent: transaction.agentName,
    Description: transaction.description,
    Amount: transaction.amount === 0 ? "—" : String(transaction.amount),
    Asset: transaction.asset,
    Network: transaction.network,
    Status: transaction.status,
    Transaction: transaction.hash,
  }));

  return (
    <AppShell
      header={
        <div className="w-full max-w-[520px]">
          <AgentSearch value={query} onChange={setQuery} />
        </div>
      }
      actions={
        <Button
          asChild
          className="tip tip--bottom h-7 shrink-0 border border-transparent bg-[#333333] px-4 font-normal text-[12px] text-white transition-colors hover:bg-[#3d3d3d]"
        >
          <Link to="/auth">Sign In</Link>
        </Button>
      }
    >
      <div className="px-3 pb-8 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1 py-4 sm:px-0">
          <div>
            <h1 className="text-[16px] font-semibold text-white">Transactions</h1>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Track payments, blockchain transactions, and on-chain activity.
            </p>
          </div>
          <Button
            className="tip tip--bottom h-7 border border-transparent bg-[#FAC102] px-3 font-normal text-[12px] text-black transition-colors hover:bg-[#FAC102]/90"
            data-tip="Export filtered transactions"
            onClick={() => setExportOpen(true)}
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>

        <div className="space-y-6 rounded-[2px] border border-border bg-black p-4 sm:p-5">
          <TransactionSummary transactions={transactions} />

          <div className="flex flex-wrap items-center gap-2">
            {transactionFilters.map((option) => (
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

          <div className="flex flex-wrap items-center gap-2">
            <CustomSelect
              label="Network"
              value={network}
              onChange={setNetwork}
              options={["All networks", "BNB Smart Chain"]}
            />
            <CustomSelect
              label="Asset"
              value={asset}
              onChange={setAsset}
              options={["All assets", "USDT", "BNB"]}
            />
            <PeriodSelect
              value={period}
              onChange={setPeriod}
              onCustom={() => setCustomOpen(true)}
            />
          </div>

          <section>
            <h2 className="mb-3 text-[13px] font-semibold tracking-wide text-foreground uppercase">
              Transactions
            </h2>
            <TransactionTable transactions={filtered} />
          </section>
        </div>
      </div>

      {exportOpen ? (
        <ExportDialog
          title="Export transactions"
          countLabel={`${filtered.length} transaction${filtered.length === 1 ? "" : "s"}`}
          filename="agentgrid-transactions"
          sheetName="Transactions"
          rows={exportRows}
          onClose={() => setExportOpen(false)}
        />
      ) : null}

      {customOpen ? (
        <DateRangePicker
          from={customFrom}
          to={customTo}
          onApply={(range) => {
            setCustomFrom(range.from);
            setCustomTo(range.to);
            setPeriod("Custom");
            setCustomOpen(false);
          }}
          onClose={() => setCustomOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}

function PeriodSelect({
  value,
  onChange,
  onCustom,
}: {
  value: Period;
  onChange: (value: Period) => void;
  onCustom: () => void;
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
        className="inline-flex h-7 items-center gap-1.5 rounded-[2px] border border-transparent bg-[#333333] px-3 text-[12px] font-medium text-white transition-colors hover:bg-[#3d3d3d]"
      >
        <Clock3 className="h-3.5 w-3.5" />
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-white/70" />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Transaction period"
          className="absolute top-[calc(100%+4px)] left-0 z-30 grid min-w-full overflow-hidden rounded-[2px] border border-border bg-black p-1 shadow-xl"
        >
          {periodOptions.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={option === value}
              onClick={() => {
                if (option === "Custom") {
                  onCustom();
                } else {
                  onChange(option);
                }
                setOpen(false);
              }}
              className={cn(
                "w-full rounded-[2px] px-3 py-2 text-left text-[12px] whitespace-nowrap transition-colors",
                option === value
                  ? "bg-[#FAC102] text-black"
                  : "text-white hover:bg-[#FAC102] hover:text-black",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CustomSelect({
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
        className="inline-flex h-7 items-center gap-2 rounded-[2px] border border-transparent bg-[#333333] px-3 text-[12px] text-white transition-colors hover:bg-[#3d3d3d]"
      >
        <span className="text-white/60">{label}</span>
        <span className="font-medium">{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-white/70" />
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
                "block w-full rounded-[2px] px-3 py-2 text-left text-[12px] whitespace-nowrap transition-colors",
                option === value
                  ? "bg-[#FAC102] text-black"
                  : "text-white hover:bg-[#FAC102] hover:text-black",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function transactionMatchesPeriod(date: string, period: Period, from?: Date, to?: Date) {
  if (period === "All time") return true;
  if (period === "Custom") {
    const timestamp = new Date(date).getTime();
    return (
      (!from || timestamp >= startOfDay(from).getTime()) &&
      (!to || timestamp <= endOfDay(to).getTime())
    );
  }

  const daysByPeriod: Record<Exclude<Period, "All time" | "Custom">, number> = {
    "1D": 1,
    "7D": 7,
    "1W": 7,
    "4W": 28,
    "1M": 30,
    "3M": 90,
  };
  const latestTransactionTime = Math.max(
    ...transactions.map((transaction) => new Date(transaction.date).getTime()),
  );
  const cutoff = latestTransactionTime - daysByPeriod[period] * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() >= cutoff;
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}
