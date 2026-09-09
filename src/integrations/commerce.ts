import { apiRequest } from "@/integrations/api";
import type { CommerceQuote, HireAuthorization } from "@/integrations/types";

export function prepareHire(agentId: string, task: string) {
  return apiRequest<HireAuthorization>("hires/prepare", {
    method: "POST",
    body: JSON.stringify({ agentId, task }),
  });
}

export async function submitHire(hireId: string, agentId: string, task: string) {
  return apiRequest<{ hire: unknown }>("hires", {
    method: "POST",
    body: JSON.stringify({ hireId, agentId, task }),
  });
}

export async function listHires() {
  return apiRequest<{ hires: unknown[]; total: number }>("hires");
}

export async function getHire(hireId: string) {
  return apiRequest<{ hire: unknown }>(`hires/${hireId}`);
}

export async function cancelHire(hireId: string) {
  return apiRequest<{ hire: unknown }>(`hires/${hireId}/cancel`, {
    method: "POST",
  });
}

export async function requestHireSignature(
  hire: HireAuthorization,
  quote: CommerceQuote,
  sign: (message: string) => Promise<string>,
) {
  const signature = await sign(JSON.stringify({ hire, quote }));
  return { ...hire, quote, status: "awaiting_wallet_signature" as const, signature };
}
