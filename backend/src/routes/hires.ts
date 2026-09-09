import { Router } from "express";
import { serverEnv } from "../config/env.js";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase.js";
import { requireAuth } from "../middleware/require-auth.js";

export const hiresRouter = Router();

type CreateHireBody = {
  agentId: string;
  task: string;
  category?: string;
};

type HireRow = {
  id: string;
  privy_user_id: string;
  agent_id: string;
  agent_name: string;
  agent_thumbnail: string;
  task: string;
  category: string;
  status: string;
  progress: number;
  started_at: string;
  completed_at: string | null;
  execution_seconds: number | null;
  cost_usd: number;
  cost_bnb: string;
  result: string | null;
  output: string | null;
  current_step: string | null;
  transaction_hash: string | null;
  transaction_status: string | null;
  transaction_network: string | null;
  performance_success_rate: number | null;
  performance_avg_response_seconds: number | null;
  performance_reputation: number | null;
};

function toHire(row: HireRow) {
  return {
    id: row.id,
    agentId: row.agent_id,
    agentName: row.agent_name,
    agentThumbnail: row.agent_thumbnail,
    task: row.task,
    category: row.category,
    status: row.status,
    progress: row.progress,
    startedAt: row.started_at,
    completedAt: row.completed_at ?? undefined,
    executionSeconds: row.execution_seconds ?? undefined,
    cost: row.cost_usd,
    bnbCost: row.cost_bnb,
    result: row.result ?? undefined,
    output: row.output ?? undefined,
    currentStep: row.current_step ?? undefined,
    transaction: {
      hash: row.transaction_hash ?? "",
      status: (row.transaction_status as "Confirmed" | "Pending" | "Failed") ?? "Pending",
      network: row.transaction_network ?? "BNB Smart Chain",
    },
    performance: {
      successRate: row.performance_success_rate ?? 0,
      avgResponseSeconds: row.performance_avg_response_seconds ?? 0,
      reputation: row.performance_reputation ?? 0,
    },
  };
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

hiresRouter.post("/prepare", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const { agentId, task, category } = request.body as CreateHireBody;
  if (!agentId || !task?.trim()) {
    response.status(400).json({ error: "agentId and task are required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "Hire preparation is not configured on this server" });
    return;
  }

  const supabase = getSupabase();
  const hireId = `hire-${claims.userId}-${Date.now()}`;

  const authorization = {
    agentId,
    task: task.trim(),
    category: category?.trim() || "General",
    quote: {
      amount: "0.001",
      asset: "BNB",
      chainId: 56,
      protocol: "b402" as const,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
    status: "prepared" as const,
    hireId,
  };

  try {
    await supabase.from("hires").insert({
      id: hireId,
      privy_user_id: claims.userId,
      agent_id: agentId,
      agent_name: agentId,
      agent_thumbnail: "",
      task: task.trim(),
      category: category?.trim() || "General",
      status: "Pending",
      progress: 0,
      started_at: new Date().toISOString(),
      cost_usd: 0,
      cost_bnb: "0",
      transaction_status: "Pending",
      transaction_network: "BNB Smart Chain",
      performance_success_rate: 0,
      performance_avg_response_seconds: 0,
      performance_reputation: 0,
    });

    response.json({ authorization, hireId });
  } catch (error) {
    response.status(500).json({
      error: "Failed to prepare hire",
      detail: errorMessage(error),
    });
  }
});

hiresRouter.post("/", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const { hireId, agentId, task, category, transactionHash, transactionStatus } = request.body as {
    hireId: string;
    agentId: string;
    task: string;
    category?: string;
    transactionHash?: string;
    transactionStatus?: "Confirmed" | "Pending" | "Failed";
  };

  if (!hireId || !agentId || !task?.trim()) {
    response.status(400).json({ error: "hireId, agentId, and task are required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "Hire submission is not configured on this server" });
    return;
  }

  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("hires")
      .update({
        status: transactionStatus === "Confirmed" ? "Payment Confirmed" : "Awaiting Payment",
        transaction_hash: transactionHash ?? null,
        transaction_status: transactionStatus ?? "Pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", hireId)
      .eq("privy_user_id", claims.userId)
      .select("*")
      .single();

    if (error || !data) {
      response.status(404).json({ error: "Hire not found" });
      return;
    }

    response.json({ hire: toHire(data as HireRow) });
  } catch (error) {
    response.status(500).json({
      error: "Failed to submit hire",
      detail: errorMessage(error),
    });
  }
});

hiresRouter.get("/", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "Hires are not configured on this server" });
    return;
  }

  const supabase = getSupabase();
  const status = typeof request.query.status === "string" ? request.query.status : undefined;

  try {
    let query = supabase
      .from("hires")
      .select("*", { count: "exact" })
      .eq("privy_user_id", claims.userId)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    response.json({
      hires: (data ?? []).map((row) => toHire(row as HireRow)),
      total: count ?? 0,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to list hires",
      detail: errorMessage(error),
    });
  }
});

hiresRouter.get("/:hireId", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const { hireId } = request.params;
  if (!hireId) {
    response.status(400).json({ error: "hireId is required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "Hires are not configured on this server" });
    return;
  }

  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("hires")
      .select("*")
      .eq("id", hireId)
      .eq("privy_user_id", claims.userId)
      .single();

    if (error || !data) {
      response.status(404).json({ error: "Hire not found" });
      return;
    }

    response.json({ hire: toHire(data as HireRow) });
  } catch (error) {
    response.status(500).json({
      error: "Failed to fetch hire",
      detail: errorMessage(error),
    });
  }
});

hiresRouter.post("/:hireId/cancel", requireAuth, async (request, response) => {
  const claims = request.privyClaims;
  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  const { hireId } = request.params;
  if (!hireId) {
    response.status(400).json({ error: "hireId is required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "Hires are not configured on this server" });
    return;
  }

  const supabase = getSupabase();

  try {
    const { data, error } = await supabase
      .from("hires")
      .update({
        status: "Cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", hireId)
      .eq("privy_user_id", claims.userId)
      .in("status", ["Pending", "Awaiting Payment", "Queued"])
      .select("*")
      .single();

    if (error || !data) {
      response.status(404).json({ error: "Hire not found or cannot be cancelled" });
      return;
    }

    response.json({ hire: toHire(data as HireRow) });
  } catch (error) {
    response.status(500).json({
      error: "Failed to cancel hire",
      detail: errorMessage(error),
    });
  }
});
