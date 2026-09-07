import type { LinkedAccount, User } from "@privy-io/node";
import { Router } from "express";
import { getChainInfo } from "../lib/erc8004/discovery.js";
import { privy } from "../lib/privy.js";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase.js";
import { requireAuth } from "../middleware/require-auth.js";

export const authRouter = Router();

type SyncedWallet = {
  address: string;
  chainId: number;
  chainName: string;
  provider: "Privy";
  isPayment: boolean;
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function emailFromLinkedAccounts(linkedAccounts: Array<LinkedAccount>): string | null {
  const email = linkedAccounts.find(
    (account): account is Extract<LinkedAccount, { type: "email" }> => account.type === "email",
  );
  return email?.address ?? null;
}

async function listUserWallets(
  userId: string,
): Promise<Array<{ address: string; createdAt: number }>> {
  const wallets: Array<{ address: string; createdAt: number }> = [];
  for await (const wallet of privy.wallets().list({ user_id: userId, chain_type: "ethereum" })) {
    wallets.push({ address: wallet.address, createdAt: wallet.created_at });
  }
  return wallets;
}

/** Oldest linked Ethereum wallet is the default payment wallet. */
function resolvePaymentWallet(wallets: Array<{ address: string; createdAt: number }>) {
  if (wallets.length === 0) return null;
  return wallets.reduce((selected, wallet) =>
    wallet.createdAt < selected.createdAt ? wallet : selected,
  );
}

authRouter.post("/sync", requireAuth, async (request, response) => {
  const claims = request.privyClaims;

  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  if (!isSupabaseConfigured()) {
    response.status(503).json({ error: "User sync is not configured on this server" });
    return;
  }

  const supabase = getSupabase();
  const { userId, sessionId } = claims;

  let privyUser: User;
  let linkedWallets: Array<{ address: string; createdAt: number }>;
  try {
    [privyUser, linkedWallets] = await Promise.all([
      privy.users()._get(userId),
      listUserWallets(userId),
    ]);
  } catch (error) {
    response.status(502).json({
      error: "Failed to fetch Privy user or wallets",
      detail: errorMessage(error),
    });
    return;
  }

  const paymentWallet = resolvePaymentWallet(linkedWallets);
  const chain = getChainInfo();

  try {
    await supabase.from("profiles").upsert(
      {
        privy_user_id: userId,
        email: emailFromLinkedAccounts(privyUser.linked_accounts),
        is_guest: privyUser.is_guest,
        custom_metadata: privyUser.custom_metadata ?? {},
      },
      { onConflict: "privy_user_id" },
    );

    const walletRows = linkedWallets.map((wallet) => ({
      privy_user_id: userId,
      address: wallet.address,
      chain_type: "ethereum",
    }));
    if (walletRows.length > 0) {
      await supabase.from("wallets").upsert(walletRows, { onConflict: "privy_user_id,address" });
    }

    if (paymentWallet) {
      await supabase.from("wallets").update({ is_payment: false }).eq("privy_user_id", userId);
      await supabase
        .from("wallets")
        .update({ is_payment: true })
        .eq("privy_user_id", userId)
        .eq("address", paymentWallet.address);
    }

    const { data: walletRecords, error } = await supabase
      .from("wallets")
      .select("address, is_payment")
      .eq("privy_user_id", userId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    const wallets: SyncedWallet[] = (walletRecords ?? []).map((record) => ({
      address: record.address as string,
      chainId: chain.chainId,
      chainName: chain.chainName,
      provider: "Privy",
      isPayment: Boolean(record.is_payment),
    }));

    response.json({
      user: {
        privyUserId: userId,
        sessionId,
        email: emailFromLinkedAccounts(privyUser.linked_accounts),
        isGuest: privyUser.is_guest,
      },
      wallets,
      paymentWallet: wallets.find((wallet) => wallet.isPayment) ?? null,
    });
  } catch (error) {
    response.status(500).json({
      error: "Failed to sync user to Supabase",
      detail: errorMessage(error),
    });
  }
});
