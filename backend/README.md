# AgentGrid Backend

This is the server-side integration boundary for AgentGrid. It currently contains Privy token verification and an `/api/auth/sync` foundation. Supabase is intentionally not configured yet; it will be added as the database layer after the Privy flow is verified.

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
```

Do not put these values in the frontend `.env.local` or in any `VITE_*` variable.

## Run

```bash
npm run dev
```

The server exposes:

- `GET /health`
- `POST /api/auth/sync` with `Authorization: Bearer <privy-access-token>`

## Next integration steps

1. Add Supabase server credentials and a database client.
2. Upsert the verified Privy user into `profiles`.
3. Retrieve and persist linked Privy wallets.
4. Resolve the active payment wallet.
5. Add authenticated marketplace, identity, hire, and transaction routes.
