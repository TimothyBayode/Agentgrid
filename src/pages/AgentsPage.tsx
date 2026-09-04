import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Link } from "@/lib/router";
import { AgentSidebar } from "@/components/agents/AgentSidebar";
import { AgentSearch } from "@/components/agents/AgentSearch";
import { AgentFilters } from "@/components/agents/AgentFilters";
import { AgentGrid } from "@/components/agents/AgentGrid";
import { Button } from "@/components/ui/button";
import { agentCategories, agents, agentMatchesFilter } from "@/data/agents";
import { cn } from "@/lib/utils";

export default function AgentsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    setSidebarOpen((prev) => (isDesktop ? !prev : true));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchesQuery =
        q.length === 0 ||
        [agent.name, agent.creator, agent.protocol, ...agent.capabilities]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return agentMatchesFilter(agent, category) && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface">
      <AgentSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className={cn(
          "flex flex-col transition-[padding] duration-200",
          sidebarOpen ? "lg:pl-72" : "lg:pl-16",
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

          <Button
            asChild
            className="tip tip--bottom ml-auto h-7 shrink-0 border border-transparent bg-[#333333] px-4 font-normal text-[12px] text-white transition-colors hover:bg-[#3d3d3d]"
          >
            <Link to="/auth">Sign In</Link>
          </Button>
        </header>

        <div className="px-4 py-4 sm:px-6">
          <AgentFilters categories={agentCategories} active={category} onChange={setCategory} />
        </div>

        <div className="px-3 pb-8 sm:px-5">
          <section className="rounded-[2px] border border-border bg-background p-4 sm:p-5">
            <AgentGrid agents={filtered} />
          </section>
        </div>
      </div>
    </div>
  );
}
