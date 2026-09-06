import type { WalletIdentity } from "@/integrations/types";

export type AuthSession = {
  userId: string;
  wallet: WalletIdentity | undefined;
  accessToken: string;
};

export interface AuthAdapter {
  getSession(): Promise<AuthSession | null>;
  login(): Promise<AuthSession>;
  logout(): Promise<void>;
  getAccessToken(): Promise<string | null>;
}

/** Privy will implement this adapter when its SDK is enabled. */
export const authAdapter: AuthAdapter = {
  async getSession() {
    return null;
  },
  async login() {
    throw new Error("Auth provider is not configured");
  },
  async logout() {},
  async getAccessToken() {
    return null;
  },
};
