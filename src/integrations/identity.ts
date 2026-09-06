import { apiRequest } from "@/integrations/api";
import type { AgentIdentity, WalletIdentity } from "@/integrations/types";

export function listWalletAgents(wallet: WalletIdentity) {
  return apiRequest<AgentIdentity[]>(
    `identities?owner=${encodeURIComponent(wallet.address)}&chainId=${wallet.chainId}`,
  );
}

export function verifyAgentIdentity(agentId: string, wallet: WalletIdentity) {
  return apiRequest<AgentIdentity>("identities/verify", {
    method: "POST",
    body: JSON.stringify({ agentId, owner: wallet.address, chainId: wallet.chainId }),
  });
}
