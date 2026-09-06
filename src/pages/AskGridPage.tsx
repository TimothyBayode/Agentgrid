import { useMemo, useState } from "react";
import {
  ChevronRight,
  GitCompare,
  History,
  Plus,
  Send,
  Sparkles,
  Star,
  WalletCards,
  X,
} from "lucide-react";
import { Link } from "@/lib/router";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { agents } from "@/data/agents";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

const prompts = [
  "Find me the best yield agents",
  "Compare these two trading agents",
  "Which agent can monitor my health factor?",
  "Find an agent under 1 USDT per task",
];

const recentConversations = [
  ["Yield optimization agents", "Today"],
  ["Compare GridBot and TradeMaster", "Yesterday"],
  ["Find PancakeSwap agents", "Sep 3"],
  ["Best health factor monitors", "Sep 2"],
];

export default function AskGridPage() {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [compare, setCompare] = useState<Agent[]>([]);
  const [hireAgent, setHireAgent] = useState<Agent | null>(null);
  const [historyOpen, setHistoryOpen] = useState(true);

  const recommendations = useMemo(() => {
    const query = (question ?? "").toLowerCase();
    return agents
      .filter((agent) => {
        if (!query) return false;
        if (query.includes("yield"))
          return /yield|defi|rebalance|apy/i.test(
            `${agent.name} ${agent.description} ${agent.capabilities.join(" ")}`,
          );
        if (query.includes("trading") || query.includes("trade"))
          return agent.category === "Trading";
        if (query.includes("health") || query.includes("liquidation"))
          return /health|risk|approval|monitor/i.test(
            `${agent.name} ${agent.description} ${agent.capabilities.join(" ")}`,
          );
        if (query.includes("pancake")) return agent.protocol === "PancakeSwap";
        return true;
      })
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, 4);
  }, [question]);

  const ask = (value: string) => {
    const next = value.trim();
    if (!next) return;
    setQuestion(next);
    setInput("");
    setCompare([]);
  };

  const toggleCompare = (agent: Agent) => {
    setCompare((current) =>
      current.some((item) => item.id === agent.id)
        ? current.filter((item) => item.id !== agent.id)
        : [...current, agent].slice(-2),
    );
  };

  return (
    <AppShell
      header={null}
      actions={
        <Button
          asChild
          className="h-7 border border-transparent bg-[#333333] px-4 text-[12px] font-normal text-white hover:bg-[#3d3d3d]"
        >
          <Link to="/auth">Sign In</Link>
        </Button>
      }
    >
      <main
        className={cn(
          "grid min-h-[calc(100vh-65px)]",
          historyOpen ? "lg:grid-cols-[220px_minmax(0,1fr)]" : "lg:grid-cols-[52px_minmax(0,1fr)]",
        )}
      >
        <aside className="hidden border-r border-border p-3 lg:block">
          <div className="flex items-center justify-between">
            {historyOpen ? (
              <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <History className="h-3.5 w-3.5 text-[#FAC102]" />
                Conversations
              </p>
            ) : null}
            <button
              type="button"
              aria-label={
                historyOpen ? "Collapse conversation history" : "Expand conversation history"
              }
              className="ml-auto rounded-[2px] p-1 text-muted-foreground hover:bg-white/5 hover:text-[#FAC102]"
              onClick={() => setHistoryOpen((current) => !current)}
            >
              <ChevronRight
                className={cn("h-3.5 w-3.5 transition-transform", historyOpen && "rotate-180")}
              />
            </button>
          </div>
          {historyOpen ? (
            <div className="mt-4 space-y-1">
              {recentConversations.map(([title, date]) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setQuestion(title ?? "")}
                  className="w-full rounded-[2px] px-2 py-2 text-left transition-colors hover:bg-white/5"
                >
                  <p className="truncate text-[12px] text-foreground">{title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{date}</p>
                </button>
              ))}
            </div>
          ) : null}
        </aside>

        <section className="flex min-w-0 flex-col px-4 py-8 sm:px-8">
          <div className={cn("mx-auto flex w-full max-w-[720px] flex-1 flex-col")}>
            {!question ? (
              <div className="text-center">
                <div className="mx-auto h-12 w-12">
                  <img
                    src="/favicon.svg"
                    alt="AgentGrid"
                    className="h-full w-full object-contain"
                  />
                </div>
                <h1 className="mt-5 text-[28px] font-semibold tracking-tight text-white">
                  Ask Grid
                </h1>
                <p className="mx-auto mt-3 max-w-[500px] text-[14px] leading-relaxed text-muted-foreground">
                  Tell Grid what you want to accomplish. I&apos;ll find, compare, and help you hire
                  the right agent.
                </p>
              </div>
            ) : (
              <Conversation
                question={question}
                recommendations={recommendations}
                selected={selected}
                compare={compare}
                onSelect={setSelected}
                onCompare={toggleCompare}
                onHire={setHireAgent}
              />
            )}
            <div className={cn("mt-8", question && "mt-auto pt-8")}>
              {!question ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {prompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => ask(prompt)}
                      className="rounded-[2px] border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground transition-colors hover:border-[#FAC102]/50 hover:bg-[#FAC102] hover:text-black"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              ) : null}
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  ask(input);
                }}
                className="rounded-[2px] border border-border bg-background p-3 focus-within:border-[#FAC102]/60"
              >
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={question ? 2 : 3}
                  placeholder="What do you want to accomplish?"
                  className="w-full resize-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
                />
                <div className="flex items-center justify-between">
                  <span />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 border-dashed border-white/35 bg-transparent px-3 text-[12px] text-white hover:border-white/60 hover:bg-white/5 hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add context
                    </Button>
                    <Button
                      type="submit"
                      className="h-7 bg-[#FAC102] px-3 text-[12px] text-black hover:bg-[#FAC102]/90"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      {hireAgent ? <HirePreparation agent={hireAgent} onClose={() => setHireAgent(null)} /> : null}
    </AppShell>
  );
}

function Conversation({
  question,
  recommendations,
  selected,
  compare,
  onSelect,
  onCompare,
  onHire,
}: {
  question: string;
  recommendations: Agent[];
  selected: Agent | null;
  compare: Agent[];
  onSelect: (agent: Agent) => void;
  onCompare: (agent: Agent) => void;
  onHire: (agent: Agent) => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
          You
        </p>
        <p className="mt-2 text-[18px] leading-relaxed text-foreground">{question}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[#FAC102] uppercase">Grid</p>
        <p className="mt-2 text-[14px] leading-relaxed text-foreground">
          I found {recommendations.length || 3} agents matching your requirements.
        </p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          I ranked them using reputation, success rate, execution time, price, and recent activity.
        </p>
      </div>
      {recommendations.length ? (
        <div className="mt-5 grid gap-3">
          {recommendations.map((agent, index) => (
            <RecommendationCard
              key={agent.id}
              agent={agent}
              index={index}
              selected={selected?.id === agent.id}
              compared={compare.some((item) => item.id === agent.id)}
              onSelect={() => onSelect(agent)}
              onCompare={() => onCompare(agent)}
              onHire={() => onHire(agent)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[2px] border border-border p-4 text-[12px] text-muted-foreground">
          Try mentioning a category, protocol, capability, or budget and Grid will narrow the
          marketplace for you.
        </div>
      )}
      {compare.length === 2 ? <Comparison agents={compare} /> : null}
    </div>
  );
}

function RecommendationCard({
  agent,
  index,
  selected,
  compared,
  onSelect,
  onCompare,
  onHire,
}: {
  agent: Agent;
  index: number;
  selected: boolean;
  compared: boolean;
  onSelect: () => void;
  onCompare: () => void;
  onHire: () => void;
}) {
  return (
    <article
      className={cn(
        "border bg-background p-4 transition-colors",
        selected ? "border-[#FAC102]" : "border-border hover:border-white/30",
      )}
    >
      <div className="flex items-start gap-3">
        <img src={agent.thumbnail} alt="" className="h-9 w-9 shrink-0 rounded-[2px] object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onSelect}
              className="truncate text-left text-[14px] font-semibold text-foreground hover:text-[#FAC102]"
            >
              {index + 1} {agent.name}
            </button>
            <span className="flex shrink-0 items-center gap-1 text-[12px] text-foreground">
              <Star className="h-3 w-3 fill-[#FAC102] text-[#FAC102]" />
              {agent.reputation.toFixed(1)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {agent.category} · {agent.protocol}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[12px]">
        <span className="text-emerald">
          {Math.min(99.9, agent.reputation * 20 - 0.1).toFixed(1)}% success
        </span>
        <span className="text-right text-foreground">{agent.pricePerRun}</span>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          asChild
          variant="outline"
          className="h-7 flex-1 border-border px-2 text-[11px] hover:border-[#FAC102] hover:bg-[#FAC102] hover:text-black"
        >
          <Link to="/agents">View Agent</Link>
        </Button>
        <button
          type="button"
          onClick={onCompare}
          className={cn(
            "h-7 rounded-[2px] border px-2 text-[11px] transition-colors",
            compared
              ? "border-[#FAC102] bg-[#FAC102] text-black"
              : "border-border text-muted-foreground hover:border-[#FAC102] hover:text-foreground",
          )}
        >
          <GitCompare className="h-3 w-3" />
        </button>
        <Button
          onClick={onHire}
          className="h-7 flex-1 bg-[#FAC102] px-2 text-[11px] text-black hover:bg-[#FAC102]/90"
        >
          Hire
        </Button>
      </div>
    </article>
  );
}

function Comparison({ agents: compared }: { agents: Agent[] }) {
  return (
    <div className="mt-6 overflow-x-auto border border-[#FAC102]/30 bg-[#FAC102]/5 p-4">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[#FAC102] uppercase">
        Comparison
      </p>
      <div className="mt-4 min-w-[420px] grid grid-cols-[1fr_repeat(2,minmax(100px,1fr))] gap-y-2 text-[11px]">
        <div className="text-muted-foreground" />
        {compared.map((agent) => (
          <strong key={agent.id} className="truncate text-foreground">
            {agent.name}
          </strong>
        ))}
        {[
          ["Rating", ...compared.map((agent) => agent.reputation.toFixed(1))],
          ["Jobs", ...compared.map((agent) => agent.runs.toLocaleString())],
          ["Price", ...compared.map((agent) => agent.pricePerRun)],
          ["Protocol", ...compared.map((agent) => agent.protocol)],
        ].map(([label, ...values]) => (
          <>
            <span className="text-muted-foreground">{label}</span>
            {values.map((value, index) => (
              <span key={`${label}-${index}`} className="text-foreground">
                {value}
              </span>
            ))}
          </>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-relaxed text-foreground">
        {compared[0]?.name} is the stronger choice if your priority is reputation and marketplace
        activity.
      </p>
    </div>
  );
}

function ContextStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-2">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-[12px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function HirePreparation({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md border border-border bg-surface p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] text-[#FAC102] uppercase">
              Prepare hire
            </p>
            <h2 className="mt-2 text-[18px] font-semibold text-foreground">
              Review before signing
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 space-y-3 border-y border-border py-4">
          <ContextStat label="Agent" value={agent.name} />
          <ContextStat label="Estimated cost" value={agent.pricePerRun} />
          <ContextStat label="Network" value="BNB Smart Chain" />
          <ContextStat label="Execution" value="Agent analyzes and returns a result" />
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
          Grid will prepare the hire, but no transaction starts until you review and approve it with
          your wallet.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">
            Cancel
          </Button>
          <Button className="bg-[#FAC102] text-[12px] text-black hover:bg-[#FAC102]/90">
            <WalletCards className="h-3.5 w-3.5" />
            Review & Hire
          </Button>
        </div>
      </div>
    </div>
  );
}
