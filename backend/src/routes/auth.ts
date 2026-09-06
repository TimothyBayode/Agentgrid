import { Router } from "express";
import { requireAuth } from "../middleware/require-auth.js";

export const authRouter = Router();

authRouter.post("/sync", requireAuth, (request, response) => {
  const claims = request.privyClaims;

  if (!claims) {
    response.status(401).json({ error: "Authentication required" });
    return;
  }

  // Supabase upsert will be added here. Privy remains the identity authority.
  response.json({
    user: {
      privyUserId: claims.userId,
      sessionId: claims.sessionId,
    },
    wallets: [],
    paymentWallet: null,
  });
});
