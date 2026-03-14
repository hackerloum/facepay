-- FacePay MVP - Initial Schema
-- Enable pgvector for face embeddings
create extension if not exists vector;

-- Users (customers who register faces)
create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  phone_network text not null check (phone_network in ('TZ-AIRTEL-C2B', 'TZ-TIGO-C2B', 'TZ-HALOTEL-C2B')),
  face_image_url text,
  face_embedding vector(128),
  created_at timestamptz default now()
);

-- Merchants
create table merchants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  shop_name text not null,
  owner_name text not null,
  tembo_account_id text,
  created_at timestamptz default now()
);

-- Transactions
create table transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id) on delete set null,
  merchant_id uuid references merchants(id) on delete set null,
  amount numeric not null,
  currency text default 'TZS',
  tembo_reference text,
  status text default 'PENDING' check (status in ('PENDING', 'SUCCESS', 'FAILED')),
  channel text,
  created_at timestamptz default now()
);

-- Indexes for common queries
create index idx_users_phone on users(phone);
create index idx_transactions_customer_id on transactions(customer_id);
create index idx_transactions_merchant_id on transactions(merchant_id);
create index idx_transactions_created_at on transactions(created_at desc);
create index idx_transactions_tembo_reference on transactions(tembo_reference);

-- RLS: Enable row-level security
alter table users enable row level security;
alter table merchants enable row level security;
alter table transactions enable row level security;

-- Users: Service role can do everything; anon can insert (registration) and read own by phone (via API)
create policy "Service role full access on users" on users for all using (auth.role() = 'service_role');
create policy "Allow insert for registration" on users for insert with check (true);
create policy "Allow read for authenticated" on users for select using (true);

-- Merchants: Only authenticated users can manage their own merchant record
create policy "Merchants: users can read own" on merchants for select using (auth.uid() = user_id);
create policy "Merchants: users can insert own" on merchants for insert with check (auth.uid() = user_id);
create policy "Merchants: users can update own" on merchants for update using (auth.uid() = user_id);
create policy "Merchants: service role full access" on merchants for all using (auth.role() = 'service_role');

-- Transactions: Merchants read their transactions; service role for API
create policy "Transactions: merchants read own" on transactions for select using (
  merchant_id in (select id from merchants where user_id = auth.uid())
);
create policy "Transactions: service role full access" on transactions for all using (auth.role() = 'service_role');
create policy "Transactions: allow insert" on transactions for insert with check (true);
