import { Router } from "express";
import { getChainInfo, getOnchainAgent, listOnchainAgents } from "../lib/erc8004/discovery.js";

export const agentsRouter = Router();

const EXPLORERS: Record<number, string> = {
  56: "https://bscscan.com",
  97: "https://testnet.bscscan.com",
};

function parseBoundedInt(value: unknown, min: number, max: number): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return undefined;
  return parsed;
}

function chainPayload() {
  const chain = getChainInfo();
  const explorer = EXPLORERS[chain.chainId] ?? "";
  return {
    chainId: chain.chainId,
    chainName: chain.chainName,
    identityRegistry: chain.identityRegistry,
    reputationRegistry: chain.reputationRegistry,
    agentRegistry: chain.agentRegistry,
    explorer,
  };
}

agentsRouter.get("/", async (request, response) => {
  try {
    const limit = parseBoundedInt(request.query.limit, 1, 200);
    const offset = parseBoundedInt(request.query.offset, 0, Number.MAX_SAFE_INTEGER);
    const result = await listOnchainAgents({ limit, offset });
    response.json({ source: "erc8004", chain: chainPayload(), ...result });
  } catch (error) {
    response.status(502).json({
      source: "erc8004",
      error: "Failed to read ERC-8004 registry",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

agentsRouter.get("/:agentId", async (request, response) => {
  const rawAgentId = request.params.agentId;
  if (!/^\d+$/.test(rawAgentId)) {
    response.status(400).json({ error: "agentId must be a non-negative integer" });
    return;
  }

  const agentId = BigInt(rawAgentId);
  try {
    const agent = await getOnchainAgent(agentId);
    const chain = getChainInfo();
    const explorer = EXPLORERS[chain.chainId] ?? "";
    response.json({
      source: "erc8004",
      chain: chainPayload(),
      agent,
      links: {
        token: `${explorer}/token/${chain.identityRegistry}#TokenTab=tokenID`,
        owner: agent.owner ? `${explorer}/address/${agent.owner}` : null,
      },
    });
  } catch {
    response.status(404).json({ error: `Agent ${rawAgentId} not found in the ERC-8004 registry` });
  }
});
