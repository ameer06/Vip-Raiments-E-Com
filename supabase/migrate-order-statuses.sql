-- Order status expansion migration
-- Run in Supabase SQL Editor

-- Expand order status enum
drop policy if exists "Admin users can update orders" on public.orders;
create policy "Admin users can update orders"
on public.orders for update
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- Add tracking and notes columns to orders
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists shipping_carrier text;
alter table public.orders add column if not exists estimated_delivery timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
alter table public.orders add column if not exists cancelled_at timestamptz;
alter table public.orders add column if not exists updated_at timestamptz not null default now();

-- Update the status check to include all statuses
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'));

-- Set existing orders to correct statuses
update public.orders set status = 'paid' where status = 'paid';
update public.orders set status = 'pending_payment' where status = 'pending';

-- Create order status history table
create table if not exists public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.order_status_history enable row level security;

drop policy if exists "Admin users can manage status history" on public.order_status_history;
create policy "Admin users can manage status history"
on public.order_status_history for all
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()))
with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Anyone can read status history" on public.order_status_history;
create policy "Anyone can read status history"
on public.order_status_history for select
to anon, authenticated
using (true);

drop policy if exists "System can insert status history" on public.order_status_history;
create policy "System can insert status history"
on public.order_status_history for insert
to anon, authenticated
with check (true);

create index if not exists order_status_history_order_idx on public.order_status_history (order_id);
create index if not exists order_status_history_created_idx on public.order_status_history (created_at desc);
