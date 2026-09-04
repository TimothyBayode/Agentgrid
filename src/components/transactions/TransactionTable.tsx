import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/router";
import { formatTransactionDate } from "@/data/transactions";
import { formatUsd } from "@/data/hires";
import type { Transaction } from "@/types/transaction";
import { TransactionStatus } from "./TransactionStatus";

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <p className="rounded-[2px] border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
        No transactions match your filters.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2px] border border-border">
      <table className="hidden w-full text-left text-[13px] md:table">
        <thead className="bg-surface text-[11px] tracking-wide text-muted-foreground uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Agent</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="transition-colors hover:bg-surface/50">
              <td className="px-4 py-3 text-muted-foreground">
                {formatTransactionDate(transaction.date)}
              </td>
              <td className="px-4 py-3 text-foreground">{transaction.type}</td>
              <td className="px-4 py-3 font-medium text-foreground">{transaction.agentName}</td>
              <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">
                {transaction.description}
              </td>
              <td
                className={
                  transaction.amount > 0
                    ? "px-4 py-3 font-medium text-emerald"
                    : "px-4 py-3 text-foreground"
                }
              >
                {transaction.amount === 0
                  ? "—"
                  : `${transaction.amount > 0 ? "+" : "-"}${formatUsd(Math.abs(transaction.amount))}`}
                <span className="ml-1 text-[11px] text-muted-foreground">{transaction.asset}</span>
              </td>
              <td className="px-4 py-3">
                <TransactionStatus status={transaction.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/transactions/${transaction.id}`}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground transition-colors hover:text-[#FAC102]"
                >
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-border md:hidden">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <Link
              to={`/transactions/${transaction.id}`}
              className="block p-4 transition-colors hover:bg-surface/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-foreground">
                    {transaction.agentName}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-muted-foreground">
                    {transaction.description}
                  </p>
                </div>
                <TransactionStatus status={transaction.status} />
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">
                  {transaction.type} · {formatTransactionDate(transaction.date)}
                </span>
                <span
                  className={
                    transaction.amount > 0
                      ? "font-medium text-emerald"
                      : "font-medium text-foreground"
                  }
                >
                  {transaction.amount === 0
                    ? "—"
                    : `${transaction.amount > 0 ? "+" : "-"}${formatUsd(Math.abs(transaction.amount))}`}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
