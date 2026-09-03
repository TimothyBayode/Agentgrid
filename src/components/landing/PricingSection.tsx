import { Check } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const plans: Plan[] = [
  {
    name: "Explorer",
    price: "Free",
    period: "forever",
    description: "For builders evaluating agents and testing their first workflows.",
    features: [
      "Browse the full agent grid",
      "3 sandbox runs per month",
      "Read-only analytics",
      "Community support",
    ],
    cta: "Start free",
  },
  {
    name: "Builder",
    price: "0.0005 BNB",
    period: "per run",
    description: "For teams shipping autonomous strategies to production.",
    features: [
      "Unlimited production runs",
      "Priority agent queue",
      "Spend caps and alerts",
      "Full run history and exports",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual",
    description: "For protocols and funds that need private infrastructure.",
    features: [
      "Private agent registry",
      "Dedicated BNB Chain infrastructure",
      "Policy controls and audit logs",
      "24/7 support with SLA",
    ],
    cta: "Contact sales",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-28 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="max-w-[560px]">
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-foreground md:text-[36px]">
            Pay for work, not seats
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Every plan settles on BNB Chain. Start free, upgrade when your agents start earning, and
            move to enterprise when you need isolation.
          </p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[2px] border p-6",
                plan.highlighted ? "border-[#FAC102] bg-surface" : "border-border bg-surface/60",
              )}
            >
              {plan.highlighted ? (
                <span className="absolute -top-3 left-6 rounded-[2px] bg-[#FAC102] px-2 py-1 text-[10px] font-semibold tracking-wide text-black uppercase">
                  Most popular
                </span>
              ) : null}

              <h3 className="text-[15px] font-semibold text-foreground">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[32px] font-semibold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-[12px] text-muted-foreground">{plan.period}</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-[13px] text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FAC102]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-2">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "w-full",
                    plan.highlighted
                      ? "bg-[#FAC102] text-black hover:bg-[#FAC102]/90"
                      : plan.name === "Enterprise"
                        ? "bg-white text-black hover:bg-white/90"
                        : "border border-border bg-transparent text-foreground hover:bg-surface-2",
                  )}
                >
                  <Link to="/auth">{plan.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
