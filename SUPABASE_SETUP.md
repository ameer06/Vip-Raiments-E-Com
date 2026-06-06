# Supabase Setup Guide

Complete step-by-step guide to configure Supabase for VIP Raiments.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name:** vip-raiments (or your choice)
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to your users
5. Wait for project to be created (2-3 minutes)

## Step 2: Get Your Credentials

Once project is created:

1. Go to **Settings → API**
2. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

3. Save these values - you'll need them for Vercel

## Step 3: Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click **Run** to execute
5. Wait for confirmation (should see "Success")

This creates:
- `products` table
- `orders` table
- `order_items` table
- `admin_users` table

## Step 4: Seed Sample Products (Optional)

1. Go to **SQL Editor** → **New Query**
2. Copy and paste `supabase/seed-products.sql`
3. Click **Run**

This adds 10 sample products for testing.

## Step 5: Set Up Storage Bucket

1. Go to **Storage** in Supabase
2. Click **Create a new bucket**
3. Fill in:
   - **Bucket name:** `product-images`
   - **Access level:** Public
4. Click **Create bucket**

5. Go to **product-images** bucket → **Policies**
6. Click **New policy** → **Create a policy from template**
7. Choose: **Allow public read access**
8. Click **Review** → **Save policy**

9. For uploads, click **New policy** → **Create a policy from template**
10. Choose: **Give users access to upload files**
11. Filter: `(auth.role() = 'authenticated')`
12. Click **Review** → **Save policy**

## Step 6: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Invite user**
3. Enter admin email
4. Supabase will send invite link (check spam folder)
5. Accept invite and set password

6. Copy the user ID (appears in user row)

7. Go to **SQL Editor** → **New Query**
8. Run:
   ```sql
   INSERT INTO public.admin_users (user_id, email, role)
   VALUES ('USER_ID_HERE', 'admin@example.com', 'admin');
   ```
   (Replace USER_ID_HERE with the copied ID)

## Step 7: Configure Vercel Environment Variables

1. Go to [vercel.com](https://vercel.com)
2. Select your **vip-raiments** project
3. Go to **Settings → Environment Variables**
4. Add these variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=razorpay_key_id
   RAZORPAY_KEY_SECRET=razorpay_secret_key
   ```

5. Click **Save**
6. Vercel will automatically redeploy with new env vars

## Step 8: Add Razorpay Credentials (Optional)

If you want to use real Razorpay payments:

1. Go to [razorpay.com](https://razorpay.com)
2. Create account → Sign in
3. Go to **Settings → API Keys**
4. Copy:
   - **Key ID** → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - **Key Secret** → `RAZORPAY_KEY_SECRET`

5. Add to Vercel environment variables (see Step 7)

## Step 9: Test the Setup

1. Go to https://vip-raiments.vercel.app
2. Add products to cart
3. Go to checkout
4. Fill in shipping details
5. Click "Pay with mock gateway"
6. You should see order confirmation page

If you get errors:
- Check Supabase credentials in Vercel env vars
- Verify tables exist: Go to Supabase → Table Editor
- Check browser console for detailed error messages

## Troubleshooting

### Error: "Could not find table 'products'"
- **Fix:** Make sure you ran the schema.sql file
- Check: Supabase → Table Editor should show products, orders, order_items tables

### Error: "Service role key not configured"
- **Fix:** Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel env vars
- Make sure it's NOT prefixed with `NEXT_PUBLIC_`

### Login not working
- **Fix:** Make sure you created admin user in Step 6
- Verify user exists: Supabase → Authentication → Users

### Images not uploading
- **Fix:** Make sure `product-images` bucket exists
- Check policies allow uploads (see Step 5)

## Next Steps

Once setup is complete:

1. ✅ Add products via admin dashboard (/admin)
2. ✅ Test checkout flow
3. ✅ Configure email notifications (optional)
4. ✅ Set up analytics tracking (optional)

## Support

For issues:
- Check Supabase docs: https://supabase.com/docs
- Check Razorpay docs: https://razorpay.com/docs
- Check Next.js docs: https://nextjs.org/docs
