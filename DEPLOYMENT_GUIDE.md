# Go-Live And Admin Access Guide

This guide explains how to put the VIP Raiments website online and access the admin dashboard from the live website.

## Simple Explanation

When the site is live:

- Customers visit your public store at `https://your-domain.com`.
- You visit the admin dashboard at `https://your-domain.com/admin`.
- The `/admin` page must be protected with login before launch.

Do not leave `/admin` public on a live website.

## Recommended Setup

Use:

- Vercel for hosting the Next.js website.
- Supabase for login, database, product images, and inventory.
- A custom domain later, for example `vipraiments.com`.

## Step 1. Create Accounts

1. Create a GitHub account if you do not already have one.
2. Create a Vercel account at `https://vercel.com`.
3. Create a Supabase account at `https://supabase.com`.

## Step 2. Upload The Project To GitHub

1. Open the project folder.
2. Commit the code to Git.
3. Create a new GitHub repository.
4. Push this project to GitHub.

Vercel deploys most easily from GitHub.

## Step 3. Create A Supabase Project

1. Open Supabase.
2. Create a new project.
3. Copy these values from Project Settings:
   - Project URL
   - Anon public key
   - Service role key
4. Keep the service role key private. Never place it inside frontend code.

## Step 4. Add Environment Variables

In Vercel, open your project settings and add:

```txt
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
```

Only variables starting with `NEXT_PUBLIC_` are available in the browser.

## Step 5. Deploy On Vercel

1. Open Vercel.
2. Click `Add New Project`.
3. Import the GitHub repository.
4. Framework preset should be `Next.js`.
5. Add the environment variables.
6. Click `Deploy`.

After deployment, Vercel gives you a live URL like:

```txt
https://vip-raiments.vercel.app
```

Your admin dashboard will be:

```txt
https://vip-raiments.vercel.app/admin
```

## Step 6. Protect Admin Access

The project now protects `/admin` with Supabase Auth. Before launch, finish the Supabase setup:

1. Create your admin user in Supabase Auth.
2. Create an `admin_users` table with your user ID.
3. Add the user to `admin_users`.
4. Confirm `/admin` redirects signed-out visitors to `/login`.

Recommended `admin_users` table:

```sql
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);
```

Add your admin user:

```sql
insert into public.admin_users (user_id, email)
values ('PASTE_AUTH_USER_ID_HERE', 'admin@example.com');
```

## Step 7. Upload Product Images

1. In Supabase, open `Storage`.
2. Create a bucket named `product-images`.
3. Upload dress images.
4. Copy the image URLs.
5. Paste those URLs into product records.

Use two images per product:

- Front image
- Hover image

## Step 8. Add Product Details

For every product, store:

- Product name
- Slug
- Color
- Sizes
- Price in INR
- Stock count
- Status
- Image URLs

Enter prices as numbers only:

```txt
2499
4999
15999
```

The storefront displays them as:

```txt
₹2,499
₹4,999
₹15,999
```

## Step 9. Connect A Custom Domain

After the Vercel URL works:

1. Buy a domain.
2. Open Vercel project settings.
3. Go to `Domains`.
4. Add your domain.
5. Follow Vercel's DNS instructions.

## Launch Checklist

- Website deploys successfully on Vercel.
- `/products` loads.
- `/admin` requires login.
- Supabase environment variables are set in Vercel.
- Product images load from Supabase Storage or another approved image host.
- Prices show in Indian Rupees.
- Stock counts are correct.
- Test order/payment flow is complete before accepting real customers.
