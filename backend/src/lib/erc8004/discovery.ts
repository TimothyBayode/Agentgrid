import { createPublicClient, http, type PublicClient } from "viem";
import { identityRegistryAbi, reputationRegistryAbi } from "./abis.js";
import { getErc8004ChainConfig, type Erc8004ChainConfig } from "./registry.js";

export type AgentService = {
  name: string;
  endpoint: string;
  version?: string;
};

export type AgentRegistrationFile = {
  type?: string;
  name?: string;
  description?: string;
  image?: string;
  services?: AgentService[];
  x402Support?: boolean;
  active?: boolean;
  registrations?: Array<{ agentRegistry: string; agentId: number }>;
  supportedTrust?: string[];
  [key: string]: unknown;
};

export type ReputationSignal = {
  client: string;
  feedbackIndex: number;
  value: number;
  valueDecimals: number;
  tag1: string;
  tag2: string;
};

export type AgentReputation = {
  /** Total non-revoked feedback entries. */
  count: number;
  /** Average of `starred` feedback (0-100) rescaled to 0-5, or null if no starred signal. */
  average: number | null;
  /** Number of distinct clients that gave feedback. */
  clientCount: number;
  signals: ReputationSignal[];
};

export type OnchainAgent = {
  /** ERC-721 tokenId, as a string. */
  agentId: string;
  /** `eip155:{chainId}:{identityRegistry}`. */
  agentRegistry: string;
  owner: string;
  agentWallet: string | null;
  tokenUri: string;
  registration: AgentRegistrationFile | null;
  reputation: AgentReputation;
};

const REQUEST_TIMEOUT_MS = 8000;
const MAX_AGENTS = 200;
const DEFAULT_LIST_LIMIT = 60;
const MAX_URI_BYTES = 1_000_000;
const CONCURRENCY = 5;
const LIST_CACHE_TTL_MS = 60_000;
const IDS_CACHE_TTL_MS = 5 * 60_000;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let client: { url: string; value: PublicClient } | null = null;

function getClient(rpcUrl: string): PublicClient {
  if (!client || client.url !== rpcUrl) {
    client = {
      url: rpcUrl,
      value: createPublicClient({ transport: http(rpcUrl, { timeout: REQUEST_TIMEOUT_MS }) }),
    };
  }
  return client.value;
}

type AgentCore = {
  owner: string;
  tokenUri: string;
  registration: AgentRegistrationFile | null;
  reputation: AgentReputation;
};

type CacheEntry = { expires: number; value: unknown };

const agentCoreCache = new Map<string, CacheEntry>();
const agentWalletCache = new Map<string, CacheEntry>();
let idsCache: { key: string; expires: number; value: bigint[] } | null = null;

function cacheGet(cache: Map<string, CacheEntry>, key: string): unknown | undefined {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expires <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

function cacheSet(cache: Map<string, CacheEntry>, key: string, value: unknown) {
  cache.set(key, { expires: Date.now() + LIST_CACHE_TTL_MS, value });
}

export type AgentListResult = {
  agents: OnchainAgent[];
  total: number;
  limit: number;
  offset: number;
};

export async function listOnchainAgents(
  options: {
    limit?: number;
    offset?: number;
  } = {},
): Promise<AgentListResult> {
  const chain = getErc8004ChainConfig();
  const publicClient = getClient(chain.rpcUrl);

  const allIds = await findAgentIds(publicClient, chain);
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIST_LIMIT, 1), MAX_AGENTS);
  const offset = Math.max(options.offset ?? 0, 0);
  const pageIds = allIds.slice(offset, offset + limit);

  const agents: OnchainAgent[] = [];
  await mapLimit(pageIds, CONCURRENCY, async (id) => {
    const agent = await fetchAgent(publicClient, chain, id, { includeWallet: false }).catch(
      () => null,
    );
    if (agent) agents.push(agent);
  });

  return {
    agents: agents.sort((a, b) => Number(a.agentId) - Number(b.agentId)),
    total: allIds.length,
    limit,
    offset,
  };
}

export async function getOnchainAgent(agentId: bigint): Promise<OnchainAgent> {
  const chain = getErc8004ChainConfig();
  const publicClient = getClient(chain.rpcUrl);
  return fetchAgent(publicClient, chain, agentId, { includeWallet: true });
}

async function fetchAgent(
  publicClient: PublicClient,
  chain: Erc8004ChainConfig,
  agentId: bigint,
  options: { includeWallet: boolean },
): Promise<OnchainAgent> {
  const coreKey = `${chain.chainId}:${agentId}`;

  let core = cacheGet(agentCoreCache, coreKey) as AgentCore | undefined;
  if (!core) {
    core = await fetchAgentCore(publicClient, chain, agentId);
    cacheSet(agentCoreCache, coreKey, core);
  }

  let agentWallet: string | null = null;
  if (options.includeWallet) {
    const cachedWallet = cacheGet(agentWalletCache, coreKey) as string | null | undefined;
    if (cachedWallet !== undefined) {
      agentWallet = cachedWallet;
    } else {
      const wallet = await publicClient
        .readContract({
          address: chain.identityRegistry,
          abi: identityRegistryAbi,
          functionName: "getAgentWallet",
          args: [agentId],
        })
        .catch(() => null);
      agentWallet = wallet === ZERO_ADDRESS ? null : wallet;
      cacheSet(agentWalletCache, coreKey, agentWallet);
    }
  }

  return {
    agentId: agentId.toString(),
    agentRegistry: chain.agentRegistry,
    ...core,
    agentWallet,
  };
}

async function fetchAgentCore(
  publicClient: PublicClient,
  chain: Erc8004ChainConfig,
  agentId: bigint,
): Promise<AgentCore> {
  const [owner, tokenUri] = await Promise.all([
    publicClient.readContract({
      address: chain.identityRegistry,
      abi: identityRegistryAbi,
      functionName: "ownerOf",
      args: [agentId],
    }),
    publicClient
      .readContract({
        address: chain.identityRegistry,
        abi: identityRegistryAbi,
        functionName: "tokenURI",
        args: [agentId],
      })
      .catch(() => ""),
  ]);

  const [registration, reputation] = await Promise.all([
    resolveRegistrationFile(tokenUri),
    readReputation(publicClient, chain, agentId),
  ]);

  return { owner, tokenUri, registration, reputation };
}

/**
 * Agent ids are minted incrementally from zero, so the highest id bounds the
 * registry. Public RPCs may not serve full history, but `ownerOf` works at the
 * latest block, which is all enumeration needs.
 */
async function findAgentIds(
  publicClient: PublicClient,
  chain: Erc8004ChainConfig,
): Promise<bigint[]> {
  const cacheKey = `${chain.chainId}:${chain.identityRegistry}`;
  if (idsCache && idsCache.key === cacheKey && idsCache.expires > Date.now()) {
    return idsCache.value;
  }

  const ids = await enumerateAgentIds(publicClient, chain);
  idsCache = { key: cacheKey, expires: Date.now() + IDS_CACHE_TTL_MS, value: ids };
  return ids;
}

async function enumerateAgentIds(
  publicClient: PublicClient,
  chain: Erc8004ChainConfig,
): Promise<bigint[]> {
  const exists = async (id: bigint): Promise<boolean> =>
    publicClient
      .readContract({
        address: chain.identityRegistry,
        abi: identityRegistryAbi,
        functionName: "ownerOf",
        args: [id],
      })
      .then(() => true)
      .catch(() => false);

  if (!(await exists(0n))) return [];

  let low = 0n;
  let high = 1n;
  while ((await exists(high)) && high < 1_000_000n) {
    low = high;
    high *= 2n;
  }

  while (low + 1n < high) {
    const mid = (low + high) / 2n;
    if (await exists(mid)) low = mid;
    else high = mid;
  }

  const count = Math.min(Number(low + 1n), MAX_AGENTS);
  return Array.from({ length: count }, (_, index) => BigInt(index));
}

async function resolveRegistrationFile(uri: string): Promise<AgentRegistrationFile | null> {
  const trimmed = uri?.trim();
  if (!trimmed) return null;

  let payload: string | null = null;

  try {
    if (trimmed.startsWith("data:")) {
      const base64 = trimmed.split(",", 2)[1];
      if (!base64) return null;
      payload = Buffer.from(base64, "base64").toString("utf8");
    } else {
      const target = toHttpUrl(trimmed);
      const response = await fetchWithTimeout(target);
      if (!response.ok) return null;
      payload = await response.text();
    }
  } catch {
    return null;
  }

  if (payload.length > MAX_URI_BYTES) return null;

  try {
    const parsed: unknown = JSON.parse(payload);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as AgentRegistrationFile;
  } catch {
    return null;
  }
}

function toHttpUrl(uri: string): string {
  if (uri.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${uri.slice("ipfs://".length)}`;
  }
  return uri;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function readReputation(
  publicClient: PublicClient,
  chain: Erc8004ChainConfig,
  agentId: bigint,
): Promise<AgentReputation> {
  const result = await publicClient
    .readContract({
      address: chain.reputationRegistry,
      abi: reputationRegistryAbi,
      functionName: "readAllFeedback",
      args: [agentId, [], "", "", false],
    })
    .catch(() => null);
  if (!result) return { count: 0, average: null, clientCount: 0, signals: [] };

  const [feedbackClients, indexes, values, decimals, tag1s, tag2s] = result;

  const signals: ReputationSignal[] = feedbackClients.map((client, i) => ({
    client,
    feedbackIndex: Number(indexes[i] ?? 0n),
    value: Number(values[i] ?? 0n),
    valueDecimals: Number(decimals[i] ?? 0),
    tag1: tag1s[i] ?? "",
    tag2: tag2s[i] ?? "",
  }));

  const clients = new Set<string>();
  for (const signal of signals) clients.add(signal.client);

  const starred = signals.filter((signal) => signal.tag1 === "starred");
  let average: number | null = null;
  if (starred.length > 0) {
    // Per the ERC-8004 spec, `starred` is a 0-100 quality rating.
    const sum = starred.reduce((acc, signal) => acc + signal.value / 10 ** signal.valueDecimals, 0);
    average = Math.round((sum / starred.length / 100) * 5 * 10) / 10;
  }

  return {
    count: signals.length,
    average,
    clientCount: clients.size,
    signals,
  };
}

async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<void> {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      await fn(items[current]!);
    }
  });
  await Promise.all(workers);
}

export function getChainInfo() {
  return getErc8004ChainConfig();
}
