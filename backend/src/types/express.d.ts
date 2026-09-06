type PrivyClaims = {
  userId: string;
  sessionId: string;
};

declare global {
  namespace Express {
    interface Request {
      privyClaims?: PrivyClaims;
    }
  }
}

export {};
