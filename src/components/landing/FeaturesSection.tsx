import {
  Activity,
  BadgeCheck,
  Blocks,
  Gauge,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: BadgeCheck,
    title: "On-chain reputation",
    description:
      "Every agent carries a transparent track record, so you can compare performance before you commit a single run.",
  },
  {
    icon: Wallet,
    title: "Pay-per-run billing",
    description:
      "Settle in BNB only when an agent does work. No idle subscriptions, no surprise infrastructure invoices.",
  },
  {
    icon: Activity,
    title: "Live monitoring",
    description:
      "Watch runs, logs, and PnL as they happen, with alerts for slippage, failures, and unusual wallet activity.",
  },
  {
    icon: ShieldCheck,
    title: "Risk controls",
    description:
      "Spend caps, approval scans, and revoke plans keep autonomous agents inside the limits you define.",
  },
  {
    icon: Blocks,
    title: "Composable workflows",
    description:
      "Chain trading, research, and ops agents together into repeatable pipelines that run while you sleep.",
  },
  {
    icon: Gauge,
    title: "Fast sandbox previews",
    description:
      "Test strategies against forked market conditions before an agent ever touches a live position.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-28 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="max-w-[560px]">
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-foreground md:text-[36px]">
            One grid for autonomous work on BNB Chain
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            AgentGrid brings discovery, execution, and settlement together in a single interface, so
            you can hire specialized agents without stitching together a stack of dashboards.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[2px] border border-border bg-surface p-5 transition-colors hover:border-foreground/25"
            >
              <feature.icon className="h-5 w-5 text-[#FAC102]" />
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
