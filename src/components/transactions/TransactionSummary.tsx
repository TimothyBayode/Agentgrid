import { formatUsd } from "@/data/hires";
import type { Transaction } from "@/types/transaction";

export function TransactionSummary({ transactions }: { transactions: Transaction[] }) {
  const totalVolume = transactions.reduce(
    (sum, transaction) => sum + Math.abs(transaction.amount),
    0,
  );
  const totalSpent = transactions.reduce(
    (sum, transaction) => sum + (transaction.amount < 0 ? Math.abs(transaction.amount) : 0),
    0,
  );
  const pending = transactions.reduce(
    (sum, transaction) =>
      sum + (transaction.status === "Pending" ? Math.abs(transaction.amount) : 0),
    0,
  );
  const cards = [
    { label: "Total Volume", value: formatUsd(totalVolume) },
    { label: "Total Spent", value: formatUsd(totalSpent) },
    { label: "Pending", value: formatUsd(pending) },
    { label: "Transactions", value: String(transactions.length) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[2px] border border-border bg-surface p-4">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            {card.label}
          </p>
          <p className="mt-2 text-[26px] font-semibold tracking-tight text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
