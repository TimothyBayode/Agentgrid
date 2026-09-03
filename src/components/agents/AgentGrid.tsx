import type { Agent } from "@/types/agent";
import { AgentCard } from "./AgentCard";

export function AgentGrid({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-[13px] text-muted-foreground">
        No agents match your search yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-5">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
