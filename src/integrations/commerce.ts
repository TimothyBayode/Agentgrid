import { apiRequest } from "@/integrations/api";
import type { CommerceQuote, HireAuthorization } from "@/integrations/types";

export function prepareHire(agentId: string, task: string) {
  return apiRequest<HireAuthorization>("hires/prepare", {
    method: "POST",
    body: JSON.stringify({ agentId, task }),
  });
}

/** Signing is intentionally left to Privy/wallet-provider code after user review. */
export async function requestHireSignature(hire: HireAuthorization, quote: CommerceQuote) {
  return { ...hire, quote, status: "awaiting_wallet_signature" as const };
}
