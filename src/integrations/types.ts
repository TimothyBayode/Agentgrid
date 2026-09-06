export type WalletIdentity = {
  address: string;
  chainId: number;
  chainName: string;
  provider?: string;
  isEmbedded?: boolean;
};

export type AgentIdentity = {
  agentId: string;
  owner: string;
  chainId: number;
  registrationTxHash?: string;
  verified: boolean;
};

export type CommerceQuote = {
  amount: string;
  asset: string;
  chainId: number;
  protocol: "erc-8183" | "x402" | "b402";
  expiresAt?: string;
};

export type HireAuthorization = {
  agentId: string;
  task: string;
  quote: CommerceQuote;
  status: "prepared" | "awaiting_wallet_signature" | "submitted" | "confirmed" | "failed";
};

export type UploadAsset = {
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
};
