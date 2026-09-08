export type AskGridMessage = {
  role: "user" | "grid";
  content: string;
  timestamp: number;
};

export type AskGridAskRequest = {
  question: string;
  conversationId?: string;
  previousMessages?: AskGridMessage[];
};

export type AskGridRecommendation = {
  agentId: string;
  reason: string;
  matchScore: number;
};

export type AskGridCompareEntry = {
  agentId: string;
  strengths: string[];
  weaknesses: string[];
};

export type AskGridAskResponse = {
  answer: string;
  conversationId?: string | null;
  recommendations?: AskGridRecommendation[];
  compared?: AskGridCompareEntry[];
  suggestedAction?: "view" | "compare" | "hire";
};

export type AskGridCompareRequest = {
  agentIds: string[];
  criteria?: string[];
};

export type AskGridCompareResponse = {
  summary: string;
  recommendation: string;
  recommendedAgentId: string;
  entries: AskGridCompareEntry[];
};
