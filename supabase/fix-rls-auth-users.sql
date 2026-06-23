-- Fix: use auth.email() instead of querying auth.users directly
-- auth.users table is not accessible via anon key

-- Drop the policies that reference auth.users
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Users can view orders by email'
  ) THEN
    DROP POLICY "Users can view orders by email" ON public.orders;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Users can view own order items'
  ) THEN
    DROP POLICY "Users can view own order items" ON public.order_items;
  END IF;
END $$;

-- Recreate with auth.email() which works with anon key
CREATE POLICY "Users can view orders by email"
  ON public.orders FOR SELECT
  USING (
    email = auth.email()
    OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND (
          orders.email = auth.email()
          OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
        )
    )
  );
