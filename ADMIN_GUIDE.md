# Admin Product Management Guide

Use this guide to add dress product images, update product details, set Indian Rupee prices, and manage inventory.

## 1. Open The Admin Dashboard

1. Start the website with `npm run dev`.
2. Open `http://127.0.0.1:3000/admin`.
3. Sign in with an approved Supabase admin account.
4. The `/admin` page only opens for users listed in the `admin_users` table.

## 2. Upload Dress Product Images

1. Go to your Supabase project.
2. Open `Storage`.
3. Create a bucket named `product-images` if it does not already exist.
4. Upload at least two images for each product:
   - Front image: shown by default on the product card.
   - Hover image: shown when the customer hovers over the card.
5. Copy each image public URL.
6. Paste the URLs into the product image fields in the admin dashboard.

Recommended image format:

- Use `.webp` or optimized `.jpg`.
- Use a square or 4:5 portrait crop.
- Keep files ideally under 500 KB.
- Use clear filenames, for example `black-satin-dress-front.webp`.

## 3. Edit Product Information

For every dress product, update:

- Product name: customer-facing name, for example `Black Satin Dress`.
- Slug: lowercase URL name, for example `black-satin-dress`.
- Color: simple variant label, for example `Black`.
- Badge: optional label such as `New`, `Low stock`, or `Drop`.
- Sizes: comma-separated values such as `XS, S, M, L, XL`.
- Status: use `active` for visible products, `draft` for hidden products, and `archived` for discontinued products.

## 4. Set Product Prices In Indian Rupees

Enter prices as whole INR numbers without symbols:

- Correct: `2499`
- Correct: `15999`
- Avoid: `$29`
- Avoid: `₹2,499`

The storefront uses an INR formatter, so `2499` appears to customers as `₹2,499`.

## 5. Manage Inventory

1. Set `stock` to the number of available units.
2. When new stock arrives, increase the stock count.
3. When an item sells out, set stock to `0` and change status to `draft` or show a `Sold out` badge.
4. Archive products that will not return.
5. Review low-stock items daily before promoting them on the homepage.

## 6. Supabase Data Model Recommendation

Use a `products` table with these starter columns:

```txt
id uuid primary key
name text not null
slug text unique not null
color text
price_inr integer not null
stock integer not null default 0
sizes text[] not null default '{}'
status text not null default 'draft'
badge text
front_image_url text not null
hover_image_url text not null
created_at timestamptz default now()
updated_at timestamptz default now()
```

Keep service role keys server-only. Browser/admin forms should call protected route handlers or server actions, not write directly with a secret key in frontend code.

## 7. Admin Login Setup

Create an `admin_users` table:

```sql
create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);
```

After creating your admin user in Supabase Auth, copy the user's ID and insert it:

```sql
insert into public.admin_users (user_id, email)
values ('PASTE_AUTH_USER_ID_HERE', 'admin@example.com');
```

The website checks this table before rendering `/admin`.
