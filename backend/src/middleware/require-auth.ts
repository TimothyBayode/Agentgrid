import type { NextFunction, Request, Response } from "express";
import { privy } from "../lib/privy.js";

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorization = request.header("authorization");
  const accessToken = authorization?.replace(/^Bearer\s+/i, "").trim();

  if (!accessToken) {
    response.status(401).json({ error: "Missing Privy access token" });
    return;
  }

  try {
    const claims = await privy.utils().auth().verifyAccessToken(accessToken);
    request.privyClaims = { userId: claims.user_id, sessionId: claims.session_id };
    next();
  } catch {
    response.status(401).json({ error: "Invalid or expired Privy access token" });
  }
}
