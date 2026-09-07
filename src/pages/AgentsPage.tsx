import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { AgentSidebar } from "@/components/agents/AgentSidebar";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { agentCategories, agents, agentMatchesFilter } from "@/data/agents";
import { fetchOnchainAgents, toAgent } from "@/integrations/agents";
import type { Agent } from "@/types/agent";
import { cn } from "@/lib/utils";

type CatalogSource = "erc8004" | "demo";

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalog, setCatalog] = useState<Agent[]>(agents);
  const [source, setSource] = useState<CatalogSource>("demo");
  const [chainName, setChainName] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchOnchainAgents(12)
      .then((result) => {
        if (cancelled) return;
        setCatalog(result.agents.map((agent, index) => toAgent(agent, result.chain, index)));
        setChainName(result.chain.chainName);
        setSource("erc8004");
      })
      .catch(() => {
        if (cancelled) return;
        setCatalog(agents);
        setSource("demo");
      })
      .finally(() => {
        if (!cancelled) setSyncing(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleSidebar = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setSidebarOpen((prev) => (isDesktop ? !prev : true));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((agent) => {
      const matchesQuery =
        q.length === 0 ||
        [agent.name, agent.creator, agent.protocol, ...agent.capabilities]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return agentMatchesFilter(agent, category) && matchesQuery;
    });
  }, [catalog, query, category]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <AgentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-200",
          sidebarOpen ? "lg:pl-64" : "lg:pl-16",
        )}
      >
        <header className="sticky top-0 z-20 flex items-center gap-3 bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            data-tip="Menu"
            onClick={toggleSidebar}
            className="tip tip--bottom grid h-9 w-9 shrink-0 place-items-center border border-border text-foreground transition-colors hover:bg-white/5"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="w-full max-w-[520px]">
            <AgentSearch value={query} onChange={setQuery} />
          </div>
        </header>

        <div className="px-4 py-4 sm:px-6">
          <AgentFilters categories={agentCategories} active={category} onChange={setCategory} />
        </div>

        <div className="px-3 pb-8 sm:px-5">
          <section className="rounded-[2px] border border-border bg-background p-4 sm:p-5">
            <p
              className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
              aria-live="polite"
            >
              {syncing ? (
                <>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-chart-4" />
                  Syncing with the ERC-8004 registry…
                </>
              ) : source === "erc8004" ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
                  Live from ERC-8004 · {chainName}
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  Demo data — on-chain registry unavailable
                </>
              )}
            </p>
            <AgentGrid agents={filtered} />
          </section>
        </div>
      </div>
    </div>
  );
}
