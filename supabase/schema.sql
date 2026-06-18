-- Run in Supabase SQL Editor (Project → SQL → New query)

-- Products
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  color text not null default '',
  price_inr integer not null check (price_inr >= 0),
  stock integer not null default 0 check (stock >= 0),
  sizes text[] not null default '{}',
  status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
  badge text,
  front_image_url text not null,
  hover_image_url text not null,
  is_priority boolean not null default false,
  category text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  customer_name text not null,
  phone text,
  address_line text not null,
  city text not null,
  postal_code text not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  total_inr integer not null check (total_inr >= 0),
  payment_provider text not null default 'mock',
  payment_reference text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  product_slug text not null,
  size text not null,
  quantity integer not null check (quantity > 0),
  unit_price_inr integer not null check (unit_price_inr >= 0),
  line_total_inr integer not null check (line_total_inr >= 0)
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists products_status_idx on public.products (status);

-- RLS
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (status = 'active');

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Anyone can read own orders by id" on public.orders;
create policy "Anyone can read orders"
on public.orders for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can insert order items" on public.order_items;
create policy "Anyone can insert order items"
on public.order_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Anyone can read order items" on public.order_items;
create policy "Anyone can read order items"
on public.order_items for select
to anon, authenticated
using (true);

-- Admin users can read/insert/update all products (used when SUPABASE_SERVICE_ROLE_KEY is not set)
drop policy if exists "Admin users can read all products" on public.products;
create policy "Admin users can read all products"
on public.products for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin users can insert products" on public.products;
create policy "Admin users can insert products"
on public.products for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin users can update products" on public.products;
create policy "Admin users can update products"
on public.products for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Admin users (if not already created)
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Users can read their own admin row" on public.admin_users;
create policy "Users can read their own admin row"
on public.admin_users for select
to authenticated
using (auth.uid() = user_id);

-- Payment intents (UPI gateway-less)
create table if not exists public.payment_intents (
  id uuid primary key default gen_random_uuid(),
  txn_id text not null unique,
  order_ref text not null,
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  customer_email text not null,
  customer_name text not null,
  customer_phone text,
  upi_link text,
  checkout_payload jsonb,
  provider_ref text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists payment_intents_status_idx on public.payment_intents (status);
create index if not exists payment_intents_txn_id_idx on public.payment_intents (txn_id);

alter table public.payment_intents enable row level security;

drop policy if exists "Anyone can insert payment intents" on public.payment_intents;
create policy "Anyone can insert payment intents"
on public.payment_intents for insert
to anon, authenticated
with check (true);

drop policy if exists "Anyone can read payment intents" on public.payment_intents;
create policy "Anyone can read payment intents"
on public.payment_intents for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can update payment intents" on public.payment_intents;
create policy "Anyone can update payment intents"
on public.payment_intents for update
to anon, authenticated
using (true)
with check (true);

-- Product overrides (cross-device admin edits, no service role key needed)
create table if not exists public.product_overrides (
  product_id text primary key,
  overrides jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.product_overrides enable row level security;

drop policy if exists "Anyone can read product_overrides" on public.product_overrides;
create policy "Anyone can read product_overrides"
on public.product_overrides for select
to anon, authenticated
using (true);

drop policy if exists "Admin users can insert product_overrides" on public.product_overrides;
create policy "Admin users can insert product_overrides"
on public.product_overrides for insert
to authenticated
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admin users can update product_overrides" on public.product_overrides;
create policy "Admin users can update product_overrides"
on public.product_overrides for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));
