import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "@/lib/router";
import {
  getTransactionById,
  formatTransactionDate,
  formatTransactionTime,
} from "@/data/transactions";
import { formatUsd, getHireById } from "@/data/hires";
import { TransactionStatus } from "@/components/transactions/TransactionStatus";

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const transaction = transactionId ? getTransactionById(transactionId) : undefined;
  const hire = transaction?.hireId ? getHireById(transaction.hireId) : undefined;

  if (!transaction) return <NotFoundTransaction />;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/transactions"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transactions
        </Link>
        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-tight text-white">Transaction</h1>
            <TransactionStatus status={transaction.status} />
          </div>
          <p className="mt-2 text-[15px] text-foreground">{transaction.description}</p>
          <p
            className={
              transaction.amount >= 0
                ? "mt-2 text-[26px] font-semibold text-emerald"
                : "mt-2 text-[26px] font-semibold text-white"
            }
          >
            {transaction.amount === 0
              ? "—"
              : `${transaction.amount > 0 ? "+" : "-"}${formatUsd(Math.abs(transaction.amount))}`}{" "}
            <span className="text-[14px] text-muted-foreground">{transaction.asset}</span>
          </p>
        </header>

        {transaction.reason ? (
          <p className="mt-5 rounded-[2px] border border-destructive/30 bg-destructive/5 p-3 text-[13px] leading-relaxed text-muted-foreground">
            {transaction.reason}
          </p>
        ) : null}

        <DetailSection title="Transaction Details">
          <DetailGrid
            rows={[
              ["Type", transaction.type],
              ["Status", <TransactionStatus status={transaction.status} />],
              ["Network", transaction.network],
              ["Asset", transaction.asset],
              ["Amount", `${Math.abs(transaction.amount).toFixed(2)} ${transaction.asset}`],
              ["From", transaction.from],
              ["To", transaction.to],
              [
                "Transaction Hash",
                `${transaction.hash.slice(0, 8)}...${transaction.hash.slice(-6)}`,
              ],
              ["Block", transaction.block ?? "Pending"],
              ["Gas Fee", transaction.gasFee],
            ]}
          />
        </DetailSection>

        {hire ? (
          <DetailSection title="Linked Job">
            <DetailGrid
              rows={[
                ["Agent", hire.agentName],
                ["Task", hire.task],
                ["Job ID", hire.id.toUpperCase()],
                ["Started", formatTransactionTime(hire.startedAt)],
                ["Date", formatTransactionDate(hire.startedAt)],
              ]}
            />
          </DetailSection>
        ) : null}

        <DetailSection title="Time">
          <DetailGrid
            rows={[
              ["Submitted", formatTransactionTime(transaction.date)],
              [
                "Confirmed",
                transaction.status === "Confirmed" ? formatTransactionTime(transaction.date) : "—",
              ],
            ]}
          />
        </DetailSection>

        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={`https://bscscan.com/tx/${transaction.hash}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-[2px] bg-[#FAC102] px-4 text-[13px] font-medium text-black transition-colors hover:bg-[#FAC102]/90"
          >
            View on BscScan
            <ArrowUpRight className="h-4 w-4" />
          </a>
          {hire ? (
            <Link
              to={`/hires/${hire.id}`}
              className="inline-flex h-9 items-center rounded-[2px] border border-border px-4 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
            >
              View Hire
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[2px] border border-border bg-surface p-4">
      <h2 className="mb-3 text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DetailGrid({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-[11px] text-muted-foreground">{label}</dt>
          <dd className="mt-0.5 truncate text-[13px] font-medium text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function NotFoundTransaction() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">Transaction not found</h1>
      <Link
        to="/transactions"
        className="inline-flex items-center gap-1.5 rounded-[2px] border border-border px-4 py-2 text-[13px] font-medium text-foreground transition-colors hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Transactions
      </Link>
    </div>
  );
}
