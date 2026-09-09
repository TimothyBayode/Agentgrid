import { getSupabase, isSupabaseConfigured } from "./supabase.js";
import { getChainInfo, listOnchainAgents, type OnchainAgent } from "./erc8004/discovery.js";

const SYNC_INTERVAL_MS = 30 * 60 * 1000;
let syncPromise: Promise<void> | null = null;

type AgentRow = {
  agentId: string;
  agentRegistry: string;
  owner: string;
  agentWallet: string | null;
  tokenUri: string;
  registration: OnchainAgent["registration"];
  reputation: OnchainAgent["reputation"];
};

function toAgentRow(agent: OnchainAgent) {
  const registration = agent.registration;
  const signals = agent.reputation.signals;
  return {
    id: `erc8004-${getChainInfo().chainId}-${agent.agentId}`,
    name: registration?.name?.trim() || `Agent ${agent.agentId}`,
    creator: agent.owner,
    description: registration?.description ?? "",
    category: "General",
    capabilities: (registration?.services ?? registration?.endpoints ?? []).map(
      (service) => service.name,
    ),
    reputation: agent.reputation.average ?? 0,
    status: registration?.active === false ? "offline" : "online",
    protocol: "erc-8004",
    thumbnail: registration?.image ?? null,
    chain_id: getChainInfo().chainId,
    agent_id: agent.agentId,
    agent_registry: agent.agentRegistry,
    owner: agent.owner,
    agent_wallet: agent.agentWallet,
    token_uri: agent.tokenUri,
    registration,
    reputation_signals: signals,
  };
}

async function syncAgents(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  const { agents } = await listOnchainAgents({ limit: 200, offset: 0 });
  const rows = agents.map(toAgentRow);
  if (rows.length > 0) {
    const { error } = await supabase.from("agents").upsert(rows, {
      onConflict: "chain_id,agent_id",
    });
    if (error) throw error;
  }

  // Remove records that were revoked or are no longer enumerable. This keeps
  // the marketplace a snapshot of the selected BSC registry, not an archive.
  const currentAgentIds = agents.map((agent) => agent.agentId);
  const { data: storedAgents, error: storedError } = await supabase
    .from("agents")
    .select("agent_id")
    .eq("chain_id", getChainInfo().chainId);
  if (storedError) throw storedError;
  const staleIds = (storedAgents ?? [])
    .map((row) => row.agent_id as string)
    .filter((agentId) => !currentAgentIds.includes(agentId));
  if (staleIds.length > 0) {
    const { error } = await supabase
      .from("agents")
      .delete()
      .eq("chain_id", getChainInfo().chainId)
      .in("agent_id", staleIds);
    if (error) throw error;
  }
  const { error } = await supabase
    .from("agent_sync_state")
    .upsert(
      { chain_id: getChainInfo().chainId, last_synced_at: new Date().toISOString() },
      { onConflict: "chain_id" },
    );
  if (error) throw error;
}

export async function syncAgentsIfStale(force = false): Promise<void> {
  if (!isSupabaseConfigured()) return;
  if (syncPromise) return syncPromise;

  if (!force) {
    const { data, error } = await getSupabase()
      .from("agent_sync_state")
      .select("last_synced_at")
      .eq("chain_id", getChainInfo().chainId)
      .maybeSingle();
    if (error) throw error;
    const lastSyncedAt = data?.last_synced_at ? Date.parse(data.last_synced_at) : 0;
    if (Date.now() - lastSyncedAt < SYNC_INTERVAL_MS) return;
  }

  syncPromise = syncAgents().finally(() => {
    syncPromise = null;
  });
  return syncPromise;
}

export async function listStoredAgents(options: { limit?: number; offset?: number } = {}) {
  const supabase = getSupabase();
  const limit = Math.min(Math.max(options.limit ?? 60, 1), 200);
  const offset = Math.max(options.offset ?? 0, 0);
  const { data, count, error } = await supabase
    .from("agents")
    .select("*", { count: "exact" })
    .eq("chain_id", getChainInfo().chainId)
    .order("agent_id", { ascending: true })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return {
    agents: (data ?? []).map((row) => ({
      agentId: row.agent_id,
      agentRegistry: row.agent_registry,
      owner: row.owner,
      agentWallet: row.agent_wallet,
      tokenUri: row.token_uri ?? "",
      registration: row.registration,
      reputation: {
        count: row.reputation_signals?.length ?? 0,
        average: Number(row.reputation) || null,
        clientCount: new Set(
          (row.reputation_signals ?? []).map((signal: { client: string }) => signal.client),
        ).size,
        signals: row.reputation_signals ?? [],
      },
    })) as AgentRow[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export function startAgentSync(): void {
  void syncAgentsIfStale().catch((error) => console.error("Initial agent sync failed:", error));
  setInterval(() => {
    void syncAgentsIfStale(true).catch((error) =>
      console.error("Scheduled agent sync failed:", error),
    );
  }, SYNC_INTERVAL_MS).unref();
}
