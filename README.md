# VIP Raiments

Premium mobile-first commerce scaffold built with Next.js App Router, Tailwind CSS, Framer Motion, and Supabase.

## Project Skeleton

```txt
app/
  globals.css
  layout.tsx
  page.tsx
  account/page.tsx
  admin/page.tsx
  login/page.tsx
  products/page.tsx
  products/[slug]/page.tsx
components/
  features/
    Hero.tsx
    ProductCard.tsx
    ProductGrid.tsx
  layout/
    Header.tsx
    Layout.tsx
  ui/
    Marquee.tsx
data/
  products.ts
hooks/
  useCart.ts
  useSupabaseSession.ts
lib/
  supabase/
    client.ts
    server.ts
  utils.ts
ADMIN_GUIDE.md
DEPLOYMENT_GUIDE.md
```

## Phased Plan

### MVP

- Core App Router layout, metadata, Inter font, and global Tailwind setup.
- Sticky glassmorphism header with mobile-first navigation.
- High-conversion homepage hero with animated entrance and trending drops marquee.
- Product grid skeleton with hover image swap and quick-add cart chip.
- Basic routing via `/` and `/products`.
- Starter admin route via `/admin` with product, pricing, image, and inventory guidance.
- Supabase environment setup using `.env.local`.
- Local scripts for development, type checking, linting, production build, and serving.

### Enhancements

- Accessibility pass: focus traps for menus, cart drawer semantics, motion-reduction refinements, and richer aria labels.
- Commerce components: size picker, cart drawer, checkout CTA, product detail page, collection filters, search, wishlist, and promo banner.
- Real data wiring: Supabase tables for products, variants, inventory, carts, orders, and customer profiles.
- Auth flows: email OTP, OAuth, account page, protected order history, and server-side session refresh middleware.
- Analytics: conversion funnel events, product impressions, add-to-cart tracking, and checkout handoff events.
- Performance: image CDN transforms, route-level loading states, Suspense streaming, cache tags, and bundle analysis.

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are exposed to the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never import it in client components.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Live Deployment

- Storefront: [https://vip-raiments.vercel.app](https://vip-raiments.vercel.app)
- Admin login: [https://vip-raiments.vercel.app/login](https://vip-raiments.vercel.app/login)

See `DEPLOYMENT_GUIDE.md` for Supabase and Vercel environment setup.

## Build For Production

```bash
npm run type-check
npm run lint
npm run build
npm run start
```

## Routing Notes

- `/` is the conversion-focused storefront homepage.
- `/products` reuses the product grid as a collection page.
- `/admin` is the starter product management dashboard and should be protected before production.
- `/login` is the Supabase admin login page used before accessing `/admin`.
- `/account` is the starter account/admin access explainer.
- `/admin` is server-protected: signed-out users are redirected to `/login`, and signed-in users must exist in `admin_users`.
- Recommended next routes: `/products/[slug]`, `/cart`, `/checkout`, `/account`, and `/login`.
- Default auth scope: Supabase browser client for public session state, server client for route handlers/server components, and service role only in trusted server-only operations.

## Assumptions

- The first release prioritizes a direct-to-consumer storefront over a marketplace.
- Supabase auth starts with email/password or OTP, with OAuth added later.
- Product imagery uses remote CDN URLs in development and should move to Supabase Storage or a dedicated image CDN for production.
