import type { Agent } from "@/types/agent";

const unsplashImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=768&h=768&q=80&crop=entropy`;

export const showcaseImages = [
  unsplashImage("photo-1526374965328-7f61d4dc18c5"),
  unsplashImage("photo-1485827404703-89b55fcc595e"),
  unsplashImage("photo-1544197150-b99a580bb7a8"),
  unsplashImage("photo-1620712943543-bcc4688e7485"),
  unsplashImage("photo-1515879218367-8466d910aaa4"),
  unsplashImage("photo-1558494949-ef010cbdcc31"),
  unsplashImage("photo-1593508512255-86ab42a8e620"),
  unsplashImage("photo-1535378917042-10a22c95931a"),
  unsplashImage("photo-1589254065878-42c9da997008"),
  unsplashImage("photo-1580894732444-8ecded7900cd"),
  unsplashImage("photo-1461749280684-dccba630e2f6"),
  unsplashImage("photo-1460925895917-afdab827c52f"),
];

export const agentCategories = [
  "All",
  "Trading",
  "DeFi",
  "Research",
  "Data",
  "Security",
  "Social",
  "NFT",
  "Gaming",
  "Ops",
  "Trending",
  "Newly listed",
  "Rebalancing",
  "Yield",
  "PancakeSwap",
] as const;

export function agentMatchesFilter(agent: Agent, filter: string): boolean {
  if (filter === "All" || filter === agent.category) return true;

  switch (filter) {
    case "Trending":
      return agent.badge === "Trending";
    case "Newly listed":
      return agent.badge === "New";
    case "PancakeSwap":
      return agent.protocol === "PancakeSwap";
    case "Rebalancing":
      return agent.capabilities.some((capability) => capability.toLowerCase().includes("rebalanc"));
    case "Yield":
      return (
        agent.capabilities.some((capability) => /yield|apy/i.test(capability)) ||
        /yield|apy/i.test(`${agent.name} ${agent.description}`)
      );
    default:
      return false;
  }
}

const seeds: Array<Omit<Agent, "id" | "thumbnail">> = [
  {
    name: "Alpha Scout",
    creator: "GridLabs",
    description: "Scans BNB Chain mempool for early liquidity events.",
    category: "Trading",
    capabilities: ["Mempool watch", "Signals", "Auto-alerts"],
    reputation: 4.9,
    runs: 128400,
    pricePerRun: "0.0012 BNB",
    status: "online",
    protocol: "PancakeSwap",
    avatarTint: "oklch(0.62 0.19 255)",
    badge: "Trending",
  },
  {
    name: "Yield Pilot",
    creator: "Vaultworks",
    description: "Rebalances LP positions across BNB Chain vaults.",
    category: "DeFi",
    capabilities: ["Rebalancing", "APY tracking", "Risk caps"],
    reputation: 4.7,
    runs: 82100,
    pricePerRun: "0.004 BNB",
    status: "online",
    protocol: "Venus",
    avatarTint: "oklch(0.68 0.15 162)",
  },
  {
    name: "Deep Digest",
    creator: "Nocturne AI",
    description: "Summarizes protocol governance threads every hour.",
    category: "Research",
    capabilities: ["Summarize", "Cite sources", "Digest email"],
    reputation: 4.8,
    runs: 45300,
    pricePerRun: "0.0008 BNB",
    status: "busy",
    protocol: "Snapshot",
    avatarTint: "oklch(0.7 0.16 65)",
  },
  {
    name: "Chain Sentinel",
    creator: "Sentinel Guild",
    description: "Audits contract calls and flags malicious approvals.",
    category: "Security",
    capabilities: ["Approval scan", "Threat score", "Revoke plan"],
    reputation: 5,
    runs: 210900,
    pricePerRun: "0.002 BNB",
    status: "online",
    protocol: "BscScan",
    avatarTint: "oklch(0.62 0.22 26)",
    badge: "New",
  },
  {
    name: "Index Weaver",
    creator: "GridLabs",
    description: "Builds live datasets from on-chain events and APIs.",
    category: "Data",
    capabilities: ["ETL", "Webhooks", "SQL export"],
    reputation: 4.6,
    runs: 33700,
    pricePerRun: "0.001 BNB",
    status: "online",
    protocol: "The Graph",
    avatarTint: "oklch(0.65 0.18 300)",
  },
  {
    name: "Cast Composer",
    creator: "Studio Nine",
    description: "Drafts and schedules social posts from wallet activity.",
    category: "Social",
    capabilities: ["Copywriting", "Scheduling", "Threading"],
    reputation: 4.4,
    runs: 19800,
    pricePerRun: "0.0006 BNB",
    status: "offline",
    protocol: "Farcaster",
    avatarTint: "oklch(0.72 0.14 200)",
  },
  {
    name: "Mint Ranger",
    creator: "Pixel Foundry",
    description: "Tracks NFT mints and sniping windows in real time.",
    category: "NFT",
    capabilities: ["Mint alerts", "Floor watch", "Rarity"],
    reputation: 4.5,
    runs: 61200,
    pricePerRun: "0.0015 BNB",
    status: "online",
    protocol: "OpenSea",
    avatarTint: "oklch(0.7 0.19 20)",
  },
  {
    name: "Quest Runner",
    creator: "Arcade DAO",
    description: "Automates in-game quests and reward claiming.",
    category: "Gaming",
    capabilities: ["Quest loop", "Claim rewards", "Inventory"],
    reputation: 4.3,
    runs: 27500,
    pricePerRun: "0.0009 BNB",
    status: "busy",
    protocol: "Immutable",
    avatarTint: "oklch(0.66 0.17 145)",
  },
  {
    name: "Treasury Clerk",
    creator: "Ledgerhouse",
    description: "Reconciles multisig spend and exports monthly books.",
    category: "Ops",
    capabilities: ["Reconcile", "CSV export", "Alerts"],
    reputation: 4.8,
    runs: 15400,
    pricePerRun: "0.003 BNB",
    status: "online",
    protocol: "Safe",
    avatarTint: "oklch(0.6 0.12 250)",
  },
  {
    name: "Arb Weaver",
    creator: "Zerolag",
    description: "Simulates cross-DEX arbitrage before you commit gas.",
    category: "Trading",
    capabilities: ["Route sim", "Slippage guard", "Backtest"],
    reputation: 4.9,
    runs: 97600,
    pricePerRun: "0.0025 BNB",
    status: "online",
    protocol: "1inch",
    avatarTint: "oklch(0.75 0.16 95)",
    badge: "Trending",
  },
  {
    name: "Docs Oracle",
    creator: "Nocturne AI",
    description: "Answers protocol questions with cited documentation.",
    category: "Research",
    capabilities: ["RAG search", "Citations", "Slack bot"],
    reputation: 4.6,
    runs: 40100,
    pricePerRun: "0.0005 BNB",
    status: "online",
    protocol: "Notion",
    avatarTint: "oklch(0.68 0.13 330)",
  },
  {
    name: "Stream Keeper",
    creator: "Flowline",
    description: "Manages payroll streams and vesting schedules.",
    category: "DeFi",
    capabilities: ["Streaming", "Vesting", "Notifications"],
    reputation: 4.5,
    runs: 12200,
    pricePerRun: "0.0018 BNB",
    status: "busy",
    protocol: "Sablier",
    avatarTint: "oklch(0.7 0.12 190)",
  },
];

export const agents: Agent[] = seeds.map((seed, index) => ({
  ...seed,
  id: `agent-${index + 1}`,
  thumbnail: showcaseImages[index % showcaseImages.length]!,
}));
