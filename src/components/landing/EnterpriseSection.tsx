import { Check } from "lucide-react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";

const highlights = [
  "Private agent registry",
  "Role-based approvals",
  "Audit-ready logs",
  "Dedicated BNB Chain infrastructure",
];

const stats = [
  { value: "99.98%", label: "Uptime SLA" },
  { value: "12ms", label: "Median signal latency" },
  { value: "24/7", label: "Operational monitoring" },
  { value: "0", label: "Unexpected fees" },
];

const checklist = [
  { label: "Policy controls", status: "Enabled" },
  { label: "Approval scanning", status: "Active" },
  { label: "Isolated execution", status: "Ready" },
  { label: "Compliance export", status: "Available" },
];

export function EnterpriseSection() {
  return (
    <section id="enterprise" className="scroll-mt-28 border-t border-border">
      <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-foreground md:text-[36px]">
            Run agents with institutional controls
          </h2>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted-foreground">
            AgentGrid Enterprise gives protocols, funds, and treasury teams the guardrails they need
            to deploy autonomous work at scale — without giving up visibility.
          </p>

          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[14px] text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FAC102]" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-[#FAC102] text-black hover:bg-[#FAC102]/90">
              <Link to="/auth">Talk to sales</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <a href="#resources">Read the enterprise guide</a>
            </Button>
          </div>
        </div>

        <div className="rounded-[2px] border border-border bg-surface p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[2px] border border-border bg-background/50 p-4"
              >
                <p className="text-[24px] font-semibold tracking-tight text-white">{stat.value}</p>
                <p className="mt-1 text-[12px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-[2px] border border-border bg-background/50 p-4">
            <p className="text-[12px] font-semibold tracking-wide text-foreground uppercase">
              Deployment checklist
            </p>
            <ul className="mt-3 space-y-2.5">
              {checklist.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between text-[13px] text-muted-foreground"
                >
                  <span>{item.label}</span>
                  <span className="font-medium text-[#FAC102]">{item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
