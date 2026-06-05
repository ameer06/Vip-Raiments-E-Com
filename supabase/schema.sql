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
