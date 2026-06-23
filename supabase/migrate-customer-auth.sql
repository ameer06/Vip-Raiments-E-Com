-- Customer profiles table
-- Links to Supabase Auth users and stores shipping defaults

CREATE TABLE IF NOT EXISTS public.customer_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  default_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Allow customers to read their own profile
ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read own profile"
  ON public.customer_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Customers update own profile"
  ON public.customer_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Customers insert own profile"
  ON public.customer_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow customers to read their own orders (via email match)
-- Orders table already has RLS; we add a customer-facing policy

-- Check if orders table RLS policy exists for customers
DO $$
BEGIN
  -- Drop existing admin-only select policy if it exists
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'orders'
      AND policyname = 'Admins can view all orders'
  ) THEN
    DROP POLICY "Admins can view all orders" ON public.orders;
  END IF;
END $$;

-- Recreate: admins see all, customers see their own orders by email
CREATE POLICY "Users can view orders by email"
  ON public.orders FOR SELECT
  USING (
    email = auth.email()
    OR EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

-- Allow authenticated customers to insert orders (via upi confirm route using anon key)
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Customers can view their own order items through orders
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
