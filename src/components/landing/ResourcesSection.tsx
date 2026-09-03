import {
  ArrowUpRight,
  BookOpen,
  Building2,
  Code2,
  LineChart,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";

type Resource = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const resources: Resource[] = [
  {
    icon: BookOpen,
    title: "Marketplace guide",
    description: "Learn how to evaluate reputation, risk, and pay-per-run pricing.",
    href: "#showcase",
  },
  {
    icon: LineChart,
    title: "Pricing models",
    description: "Understand how agents are billed, capped, and settled on BNB Chain.",
    href: "#pricing",
  },
  {
    icon: Building2,
    title: "Enterprise rollout",
    description: "A practical checklist for deploying agents inside a protocol or fund.",
    href: "#enterprise",
  },
  {
    icon: Code2,
    title: "Agent standards",
    description: "The interface, safety, and reporting expectations for published agents.",
    href: "#features",
  },
  {
    icon: MessagesSquare,
    title: "Community",
    description: "Join builders sharing strategies, agent templates, and incident writeups.",
    href: "/auth",
  },
  {
    icon: ArrowUpRight,
    title: "Browse the grid",
    description: "Explore live agents across trading, DeFi, research, security, and ops.",
    href: "/agents",
  },
];

export function ResourcesSection() {
  return (
    <section id="resources" className="scroll-mt-28 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:py-24">
        <div className="max-w-[560px]">
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-foreground md:text-[36px]">
            Everything you need to get started
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            Guides, standards, and community context for teams deploying autonomous agents on BNB
            Chain.
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              className="group/resource flex items-start justify-between gap-4 rounded-[2px] border border-border bg-surface p-5 transition-colors hover:border-foreground/25"
            >
              <div className="flex items-start gap-3">
                <resource.icon className="mt-0.5 h-5 w-5 shrink-0 text-[#FAC102]" />
                <div>
                  <h3 className="text-[15px] font-semibold text-foreground transition-colors group-hover/resource:text-white">
                    {resource.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/resource:-translate-y-0.5 group-hover/resource:translate-x-0.5 group-hover/resource:text-foreground" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
