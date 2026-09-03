import { useMemo, useState } from "react";
import { Link } from "@/lib/router";
import { AgentSidebar } from "@/components/agents/AgentSidebar";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { agentCategories, agents } from "@/data/agents";

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchesCategory = category === "All" || agent.category === category;
      const matchesQuery =
        q.length === 0 ||
        [agent.name, agent.creator, agent.protocol, ...agent.capabilities]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-sidebar pb-14 lg:pb-0 lg:pl-[64px]">
      <AgentSidebar />

      <div className="flex flex-col">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 bg-sidebar/95 px-4 py-3 backdrop-blur-sm sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-6">
          <Logo className="lg:hidden" />
          <div className="mx-auto w-full max-w-[520px] sm:col-start-2">
            <AgentSearch value={query} onChange={setQuery} />
          </div>
          <Button
            asChild
            variant="soft"
            size="sm"
            className="col-span-2 justify-self-center sm:col-span-1 sm:justify-self-end"
          >
            <Link to="/auth">Sign In</Link>
          </Button>
        </header>

        <div className="px-4 pb-3 sm:px-6">
          <AgentFilters categories={agentCategories} active={category} onChange={setCategory} />
        </div>

        <div className="px-3 pb-8 sm:px-5">
          <section className="rounded-2xl border border-border bg-background p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-[16px] font-semibold">Agent catalog</h1>
              <p className="text-[12px] text-muted-foreground">
                {filtered.length} agents available on BNB Chain
              </p>
            </div>
            <AgentGrid agents={filtered} />
          </section>
        </div>
      </div>
    </div>
  );
}
