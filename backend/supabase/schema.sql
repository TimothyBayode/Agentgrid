-- AgentGrid Supabase schema
--
-- Apply this file in the Supabase SQL editor (or via `supabase db push` if you
-- adopt the Supabase CLI). It is idempotent: safe to run more than once.
--
-- Access model: the backend is the only client and uses the service role key,
-- which bypasses RLS. RLS is enabled on every table with no policies, so any
-- direct connection with an anon/authenticated key is denied by default.

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles: one row per Privy user (Privy remains the identity authority)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  privy_user_id text primary key,
  email text,
  is_guest boolean not null default false,
  custom_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- wallets: Privy-linked wallets synchronized per user. Exactly one row per
-- user carries is_payment = true (resolved on sync, defaulting to the oldest
-- linked Ethereum wallet).
-- ---------------------------------------------------------------------------

create table if not exists public.wallets (
  privy_user_id text not null references public.profiles (privy_user_id) on delete cascade,
  address text not null,
  chain_type text not null default 'ethereum',
  display_name text,
  is_payment boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (privy_user_id, address)
);

-- ---------------------------------------------------------------------------
-- agents: marketplace listings. On-chain ERC-8004 discovery remains the
-- source of truth for registry state; rows here add marketplace fields and an
-- optional on-chain reference (chain_id + agent_id).
-- ---------------------------------------------------------------------------

create table if not exists public.agents (
  id text primary key,
  name text not null,
  creator text,
  description text not null default '',
  category text not null default 'General',
  capabilities jsonb not null default '[]'::jsonb,
  reputation numeric(5, 2) not null default 0,
  runs integer not null default 0,
  price_per_run_bnb numeric(18, 8) not null default 0,
  status text not null default 'offline' check (status in ('online', 'busy', 'offline')),
  protocol text not null default 'erc-8004',
  thumbnail text,
  avatar_tint text,
  badge text,
  chain_id integer,
  agent_id text,
  agent_registry text,
  owner text,
  agent_wallet text,
  token_uri text,
  registration jsonb,
  reputation_signals jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chain_id, agent_id)
);

-- These columns are also safe to add to an existing project created from an
-- older version of this schema.
alter table public.agents add column if not exists agent_wallet text;
alter table public.agents add column if not exists token_uri text;
alter table public.agents add column if not exists registration jsonb;
alter table public.agents add column if not exists reputation_signals jsonb not null default '[]'::jsonb;

create index if not exists agents_status_idx on public.agents (status);
create index if not exists agents_category_idx on public.agents (category);

create table if not exists public.agent_sync_state (
  chain_id integer primary key,
  last_synced_at timestamptz not null
);
alter table public.agent_sync_state enable row level security;

-- ---------------------------------------------------------------------------
-- hires: one row per agent hire, mirroring the HireStatus lifecycle
-- ---------------------------------------------------------------------------

create table if not exists public.hires (
  id text primary key,
  privy_user_id text not null references public.profiles (privy_user_id) on delete cascade,
  agent_id text not null references public.agents (id) on delete restrict,
  task text not null default '',
  category text not null default 'General',
  status text not null default 'Pending'
    check (status in (
      'Pending', 'Awaiting Payment', 'Payment Confirmed', 'Queued',
      'Running', 'Completed', 'Failed', 'Cancelled', 'Expired'
    )),
  progress integer not null default 0 check (progress between 0 and 100),
  cost_usd numeric(12, 2) not null default 0,
  cost_bnb numeric(18, 8) not null default 0,
  current_step text,
  result text,
  output text,
  transaction_hash text,
  transaction_status text,
  transaction_network text,
  started_at timestamptz,
  completed_at timestamptz,
  execution_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hires_user_created_idx on public.hires (privy_user_id, created_at desc);
create index if not exists hires_agent_idx on public.hires (agent_id);
create index if not exists hires_status_idx on public.hires (status);

-- ---------------------------------------------------------------------------
-- transactions: ledger of hires, payments, earnings, and contract calls
-- ---------------------------------------------------------------------------

create table if not exists public.transactions (
  id text primary key,
  privy_user_id text not null references public.profiles (privy_user_id) on delete cascade,
  type text not null check (type in ('Agent Hire', 'Payment', 'Agent Earnings', 'Contract Interaction')),
  agent_name text,
  description text not null default '',
  amount numeric(18, 8) not null default 0,
  asset text not null default 'BNB',
  network text not null default 'BNB Smart Chain',
  status text not null default 'Created'
    check (status in (
      'Created', 'Awaiting Signature', 'Submitted', 'Pending',
      'Confirmed', 'Rejected', 'Failed', 'Expired', 'Cancelled'
    )),
  hash text,
  from_address text,
  to_address text,
  block text,
  gas_fee text not null default '0',
  hire_id text references public.hires (id) on delete set null,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transactions_user_created_idx on public.transactions (privy_user_id, created_at desc);
create index if not exists transactions_hash_idx on public.transactions (hash);
create index if not exists transactions_hire_idx on public.transactions (hire_id);

-- ---------------------------------------------------------------------------
-- activity_events: per-user feed of marketplace events
-- ---------------------------------------------------------------------------

create table if not exists public.activity_events (
  id bigint generated always as identity primary key,
  privy_user_id text not null references public.profiles (privy_user_id) on delete cascade,
  type text not null,
  category text not null,
  title text not null,
  description text not null default '',
  hire_id text,
  transaction_hash text,
  conversation text,
  metadata jsonb not null default '[]'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists activity_user_occurred_idx on public.activity_events (privy_user_id, occurred_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists wallets_set_updated_at on public.wallets;
create trigger wallets_set_updated_at
  before update on public.wallets
  for each row execute function public.set_updated_at();

drop trigger if exists agents_set_updated_at on public.agents;
create trigger agents_set_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

drop trigger if exists hires_set_updated_at on public.hires;
create trigger hires_set_updated_at
  before update on public.hires
  for each row execute function public.set_updated_at();

drop trigger if exists transactions_set_updated_at on public.transactions;
create trigger transactions_set_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: enabled with no policies => deny all direct (anon /
-- authenticated key) access. Only the service role used by the backend can
-- read and write.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.agents enable row level security;
alter table public.hires enable row level security;
alter table public.transactions enable row level security;
alter table public.activity_events enable row level security;
