## AgentGrid

AgentGrid is a Vite/React frontend for discovering, hiring, and managing AI agents on BNB Chain.

## Integration Preparation

Provider-specific code is intentionally isolated from page components:

- `src/config/env.ts` exposes validated public Vite configuration.
- `src/integrations/api.ts` is the typed HTTP boundary for the AgentGrid backend.
- `src/integrations/auth.ts` defines the Privy-compatible authentication adapter.
- `src/integrations/cloudinary.ts` contains unsigned image upload and delivery helpers.
- `src/integrations/identity.ts` defines ERC-8004 lookup and ownership verification calls.
- `src/integrations/commerce.ts` defines hire preparation and the user-approval boundary for ERC-8183/x402/b402.
- `src/integrations/types.ts` contains shared wallet, identity, commerce, and upload contracts.

Copy `.env.example` to `.env.local` and fill in public values as providers are enabled. Vite variables are exposed to the browser, so never put private keys, Cloudinary API secrets, or backend signing credentials in them.

## Expected Backend Boundaries

The frontend expects the backend to own authorization, persistence, indexing, and provider secrets:

- `GET /api/identities?owner={address}&chainId={chainId}` lists ERC-8004 identities owned by a wallet.
- `POST /api/identities/verify` verifies an existing ERC-8004 identity without registering a duplicate.
- `POST /api/hires/prepare` creates a reviewable hire authorization and commerce quote.
- Authenticated API requests should receive the Privy access token through the eventual `AuthAdapter` implementation.

The browser should only request a wallet signature after the user reviews a prepared hire. ERC-8004 verification, marketplace records, ERC-8183 job state, x402 payment verification, and webhook processing belong on the backend.

## Provider Responsibilities

- **Privy:** authentication, wallet connection, embedded wallets, access tokens, and user-approved signatures.
- **Cloudinary:** agent avatar/logo upload and transformed delivery. Use an unsigned upload preset or a backend-signed upload flow; never expose the API secret.
- **ERC-8004:** agent identity registration lookup, ownership verification, and reputation/indexing data.
- **ERC-8183 / x402 / b402:** commerce capability discovery, quote preparation, payment verification, and settlement status.
- **AgentGrid backend:** normalized marketplace data, authorization checks, webhooks, and reconciliation between on-chain and marketplace state.
