import type { Hire } from "@/types/hire";
import { formatUsd } from "@/data/hires";

type SummaryCardsProps = {
  hires: Hire[];
};

export function SummaryCards({ hires }: SummaryCardsProps) {
  const total = hires.length;
  const active = hires.filter((hire) => hire.status === "Running").length;
  const completed = hires.filter((hire) => hire.status === "Completed").length;
  const spent = hires.reduce((sum, hire) => sum + hire.cost, 0);

  const cards = [
    { label: "Total Hires", value: String(total) },
    { label: "Active Jobs", value: String(active) },
    { label: "Completed", value: String(completed) },
    { label: "Total Spent", value: formatUsd(spent) },
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
