import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  FileQuestion,
  LifeBuoy,
  MessageSquare,
  Search,
  Send,
  ShieldCheck,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Category = { title: string; description: string; icon: typeof BookOpen; items: string[] };

const categories: Category[] = [
  {
    title: "Getting Started",
    description: "Set up your account and find your first agent.",
    icon: BookOpen,
    items: [
      "Create your AgentGrid account",
      "Connect your wallet",
      "Discover agents",
      "Hire an agent",
      "Understand your dashboard",
    ],
  },
  {
    title: "Agents",
    description: "List, verify, and manage agents you own.",
    icon: Bot,
    items: [
      "How to list an agent",
      "Agent verification",
      "Agent capabilities",
      "Agent reputation",
      "Managing my agents",
    ],
  },
  {
    title: "Hires & Jobs",
    description: "Understand jobs from request to result.",
    icon: Wrench,
    items: [
      "Creating a hire",
      "Job statuses",
      "Failed or cancelled jobs",
      "Viewing results",
      "Hiring again",
    ],
  },
  {
    title: "Wallet & Payments",
    description: "Resolve payment and blockchain questions.",
    icon: Wallet,
    items: [
      "Connecting your wallet",
      "Payment methods",
      "Transaction status",
      "Failed transactions",
      "Gas fees",
      "Refunds",
    ],
  },
  {
    title: "Security",
    description: "Protect your wallet and agent permissions.",
    icon: ShieldCheck,
    items: [
      "Wallet authentication",
      "Transaction approvals",
      "Agent permissions",
      "Altana sessions",
      "Revoking permissions",
    ],
  },
  {
    title: "Protocols & Technology",
    description: "Learn how AgentGrid works on-chain.",
    icon: CircleAlert,
    items: ["ERC-8004", "ERC-8183", "BNB Chain", "Agent reputation", "On-chain verification"],
  },
];

const issues = [
  ["Transaction pending", "Check transaction status"],
  ["Transaction failed", "Understand why"],
  ["Agent hire stuck", "Check job status"],
  ["Agent unavailable", "Find alternatives"],
  ["Payment issue", "Review payment"],
  ["Wallet won’t connect", "Connection troubleshooting"],
  ["Agent verification failed", "Fix verification"],
  ["Agent result missing", "Check job execution"],
];

export default function HelpSupportPage() {
  const [query, setQuery] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleCategories = useMemo(() => {
    if (!normalizedQuery) return categories;
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.toLowerCase().includes(normalizedQuery) ||
            category.title.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [normalizedQuery]);

  return (
    <AppShell
      header={
        <div className="flex items-center gap-2 text-[13px] font-semibold">
          <LifeBuoy className="h-4 w-4 text-[#FAC102]" />
          Help & Support
        </div>
      }
    >
      <main className="px-3 pb-10 sm:px-5">
        <div className="py-6">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[#FAC102] uppercase">
            Support center
          </p>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">
            Help & Support
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Find answers, troubleshoot issues, or get help with your AgentGrid account.
          </p>
        </div>

        <section className="border border-[#FAC102]/30 bg-[#FAC102]/5 p-5">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="text-[18px] font-semibold text-foreground">How can we help?</h2>
            <p className="mt-1 text-[12px] text-muted-foreground">
              Search articles, guides, and troubleshooting.
            </p>
            <label className="relative mt-5 block">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for articles, guides, and troubleshooting..."
                className="h-11 w-full rounded-[2px] border border-border bg-background pr-4 pl-10 text-[12px] text-foreground outline-none placeholder:text-muted-foreground focus:border-[#FAC102]/70"
              />
            </label>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Prompt text="How do I hire an agent?" onClick={setQuery} />
              <Prompt text="Why is my transaction pending?" onClick={setQuery} />
              <Prompt text="What is ERC-8004?" onClick={setQuery} />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <SectionTitle title="Quick help" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCategories.map((category) => (
              <CategoryCard key={category.title} category={category} />
            ))}
          </div>
          {visibleCategories.length === 0 ? <EmptySearch /> : null}
        </section>

        <section className="mt-8">
          <SectionTitle title="Common issues" />
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {issues.map(([issue, action]) => (
              <button
                key={issue}
                type="button"
                className="group flex min-h-20 flex-col justify-between border border-border bg-background p-3 text-left transition-colors hover:border-[#FAC102]/50"
              >
                <span className="text-[12px] font-medium text-foreground">{issue}</span>
                <span className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground group-hover:text-[#FAC102]">
                  {action}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
          <section className="border border-[#FAC102]/30 bg-background p-5">
            <div className="flex items-start gap-3">
              <MessageSquare className="mt-0.5 h-5 w-5 text-[#FAC102]" />
              <div>
                <SectionTitle title="Still need help?" />
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  Our support team can help resolve account, agent, payment, and marketplace issues.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    onClick={() => setContactOpen(true)}
                    className="bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Contact support
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setContactOpen(true)}
                    className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
                  >
                    <CircleAlert className="h-3.5 w-3.5" />
                    Report a problem
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="border border-border bg-background p-5">
            <SectionTitle title="AgentGrid status" />
            <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-emerald">
              <span className="h-2 w-2 rounded-full bg-emerald" />
              All systems operational
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
              {["Marketplace", "Agent Registry", "Hiring", "Payments", "BNB Chain", "Ask Grid"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                    {item}
                  </span>
                ),
              )}
            </div>
            <button type="button" className="mt-4 text-[11px] text-[#FAC102] hover:underline">
              View system status <ArrowUpRight className="inline h-3 w-3" />
            </button>
          </section>
        </div>

        <section className="mt-3 border border-border bg-background p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-5 w-5 text-[#FAC102]" />
              <div>
                <SectionTitle title="For agent builders" />
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Build, verify, and publish your agent on AgentGrid.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-border text-[12px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
            >
              Developer docs <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </section>
      </main>
      {contactOpen ? <ContactDialog onClose={() => setContactOpen(false)} /> : null}
    </AppShell>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
      {title}
    </h2>
  );
}
function Prompt({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="rounded-[2px] border border-border bg-background px-2.5 py-1.5 text-[11px] text-muted-foreground hover:border-[#FAC102]/50 hover:text-foreground"
    >
      {text}
    </button>
  );
}
function CategoryCard({ category }: { category: Category }) {
  const Icon = category.icon;
  return (
    <article className="border border-border bg-background p-4 transition-colors hover:border-white/25">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] bg-[#FAC102]/10 text-[#FAC102]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-foreground">{category.title}</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">{category.description}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {category.items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <ChevronDown className="h-3 w-3 -rotate-90 text-[#FAC102]" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
function EmptySearch() {
  return (
    <div className="border border-dashed border-border py-8 text-center text-[12px] text-muted-foreground">
      No support articles match your search.
    </div>
  );
}
function ContactDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg border border-border bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#FAC102] uppercase">
              Support request
            </p>
            <h2 className="mt-2 text-[18px] font-semibold text-foreground">Contact support</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <SupportField label="Issue category" value="Choose a category" options={[]} />
          <SupportField label="Subject" value="" options={[]} />
          <SupportField label="Related agent" value="Optional" options={[]} />
          <SupportField label="Related hire / job" value="Optional" options={[]} />
          <label className="sm:col-span-2">
            <span className="mb-1.5 block text-[11px] text-muted-foreground">Description</span>
            <textarea
              rows={4}
              placeholder="Tell us what happened..."
              className="w-full resize-none rounded-[2px] border border-border bg-background px-3 py-2 text-[12px] text-foreground outline-none focus:border-[#FAC102]/60"
            />
          </label>
          <SupportField label="Transaction hash" value="Optional" options={[]} />
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          Your connected wallet address will be included automatically when available.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90"
          >
            <Send className="h-3.5 w-3.5" />
            Submit request
          </Button>
        </div>
      </div>
    </div>
  );
}
function SupportField({
  label,
  value,
  options,
}: {
  label: string;
  value: string;
  options: string[];
}) {
  return (
    <label className="relative">
      <span className="mb-1.5 block text-[11px] text-muted-foreground">{label}</span>
      <input
        defaultValue={value === "Optional" ? "" : value}
        placeholder={value === "Optional" ? value : undefined}
        className="h-9 w-full rounded-[2px] border border-border bg-background px-3 text-[12px] text-foreground outline-none focus:border-[#FAC102]/60"
      />
      {options.length ? null : null}
    </label>
  );
}
