# AgentGrid Backend

This is the server-side integration boundary for AgentGrid. It contains Privy token verification, user/wallet sync into Supabase, and read-only ERC-8004 agent discovery.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in the server-only values in `backend/.env`:

```env
PRIVY_APP_ID=
PRIVY_APP_SECRET=
PRIVY_JWT_VERIFICATION_KEY=
ERC8004_CHAIN=testnet
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not put these values in the frontend `.env.local` or in any `VITE_*` variable.

### Supabase

1. Create a project at https://supabase.com.
2. Run `supabase/schema.sql` in the project's SQL editor (it is idempotent).
3. Copy the Project URL and the **service role** key into `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.

The backend is the only Supabase client. RLS is enabled on every table with no policies, so the anon key is rejected; all reads and writes go through the backend with the service role. Privy remains the identity authority — `profiles` and `wallets` rows are synchronized from it.

`ERC8004_CHAIN` is `testnet` (BSC Testnet, chainId 97) or `mainnet` (BSC, chainId 56). The optional `BSC_TESTNET_RPC_URL` / `BSC_MAINNET_RPC_URL` override the default public endpoints — use a private RPC (Alchemy, QuickNode, Ankr) for reliable, low-latency reads.

## Run

```bash
npm run dev
```

The server exposes:

- `GET /health`
- `POST /api/auth/sync` with `Authorization: Bearer <privy-access-token>` — upserts the Privy user into `profiles`, synchronizes linked Ethereum wallets into `wallets`, and resolves the active payment wallet (oldest linked wallet). Returns `{ user, wallets, paymentWallet }`.
- `GET /api/agents?limit=&offset=` — on-chain agent catalog from the ERC-8004 Identity Registry, with registration file and Reputation Registry signals
- `GET /api/agents/:agentId` — single agent detail (adds the verified `agentWallet` and explorer links)

### ERC-8004 notes

- Agents are read live from the official ERC-8004 registry singletons (deterministic CREATE2 addresses, e.g. `eip155:97:0x8004A818...`).
- Agent ids are minted incrementally from zero; the registry is enumerated with a binary search over `ownerOf`, so no archive node or event indexing is required.
- Registration files are resolved from `tokenURI` (`data:`, `https://`, or `ipfs://` URIs).
- Results are cached in memory (agents 60s, id list 5min) because public RPCs are slow and rate-limited. Expect ~10s for a cold page and <100ms when warm; a private RPC brings cold loads down to ~1–2s.

## Completed integration steps

1. ~~Add Supabase server credentials and a database client.~~ (`src/lib/supabase.ts`, `supabase/schema.sql`)
2. ~~Upsert the verified Privy user into `profiles`.~~ (`POST /api/auth/sync`)
3. ~~Retrieve and persist linked Privy wallets.~~ (`POST /api/auth/sync`)
4. ~~Resolve the active payment wallet.~~ (`POST /api/auth/sync`, `wallets.is_payment`)

## Next integration steps

1. Add authenticated marketplace, identity, hire, and transaction routes backed by the `agents`, `hires`, `transactions`, and `activity_events` tables.
2. Agent registration (mint + `setAgentURI`) via a connected Privy wallet.
