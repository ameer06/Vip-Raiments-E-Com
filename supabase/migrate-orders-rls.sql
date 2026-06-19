-- Tighten RLS: restrict orders/order_items SELECT to admin users only
-- Run this in Supabase SQL Editor (Project → SQL → New query)

drop policy if exists "Anyone can read orders" on public.orders;
drop policy if exists "Admin users can read orders" on public.orders;
create policy "Admin users can read orders"
on public.orders for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Anyone can read order items" on public.order_items;
drop policy if exists "Admin users can read order items" on public.order_items;
create policy "Admin users can read order items"
on public.order_items for select
to authenticated
using (exists (select 1 from public.admin_users where user_id = auth.uid()));
