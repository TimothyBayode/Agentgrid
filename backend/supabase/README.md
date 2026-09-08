# AgentGrid Supabase Setup

## First-time setup

1. Open the Supabase Dashboard for the project.
2. Go to **SQL Editor** and create a new query.
3. Paste and run the complete contents of [`schema.sql`](./schema.sql).
4. Confirm that the tables exist under **Table Editor**:
   - `profiles`
   - `wallets`
   - `agents`
   - `agent_sync_state`
   - `hires`
   - `transactions`
   - `activity_events`

`schema.sql` is idempotent. It can be run again safely and includes the
columns and sync-state table required by the ERC-8004 agent synchronizer.

## Existing projects

Run the complete `schema.sql` file even if the project already has some of the
tables. The `create table if not exists` and `alter table ... add column if not
exists` statements preserve existing data while adding the newer agent sync
columns.

## Backend environment

The backend must use the Supabase **service role** key. Do not put this key in
the frontend or expose it through a `VITE_*` variable.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The schema enables Row Level Security without creating public policies. This
is intentional: the backend is the only component that should read or write
these tables, and its service role key bypasses RLS.

## Agent synchronization

The backend stores the last successful synchronization time in
`agent_sync_state`. Discovered ERC-8004 agents are inserted into `agents` with
`(chain_id, agent_id)` as the duplicate key. Re-running a sync ignores an
existing on-chain agent and does not overwrite marketplace-owned fields such
as pricing, category, or run counts.

The backend performs an initial sync and repeats it every 30 minutes. Vercel
deployments also use the cron configured in `../../vercel.json`, which calls
`GET /api/agents/sync` every 30 minutes.
