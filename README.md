# VIP Raiments

Premium mobile-first e-commerce platform built with Next.js App Router, Tailwind CSS, Framer Motion, and Supabase.

## Features

### Storefront
- **Product catalog** with search and sort (by price, name, newest)
- **Product detail pages** with size selection and image hover swap
- **Shopping cart** with quantity controls and localStorage persistence
- **Checkout** with UPI payment (QR code, app chooser, manual UPI ID)
- **Order tracking** by order ID or email with status timeline

### Customer Account
- **Sign up / Sign in** with email and password
- **Order history** showing all past orders with status
- **Profile management** with name, phone, and default address
- **Auto-fill checkout** for logged-in users

### Admin Dashboard
- **Product management** — create, edit, upload images, manage inventory
- **Order management** — search, filter by status, update status, add tracking
- **CSV export** for order data

### Security
- **Three-layer admin protection** — middleware + requireAdmin + RLS
- **Atomic stock deduction** via Supabase RPC (prevents overselling)
- **Server-side input validation** on all API routes
- **Rate limiting** on payment endpoints
- **Row Level Security** — customers see only their own orders

### UX
- **Skeleton loading states** for products, orders, and tracking
- **Custom error pages** (404, 500)
- **Responsive design** — mobile-first with glassmorphism header
- **Animated hero** with trending drops marquee

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | UPI (Google Pay, PhonePe, Paytm) |
| Hosting | Vercel |

## Project Structure

```txt
app/
  page.tsx                    # Homepage with hero + product grid
  layout.tsx                  # Root layout with fonts
  not-found.tsx               # Custom 404 page
  error.tsx                   # Custom 500 page
  global-error.tsx            # Global error boundary
  login/page.tsx              # Admin login
  account/page.tsx            # Customer dashboard
  account/login/page.tsx      # Customer login
  account/signup/page.tsx     # Customer signup
  products/page.tsx           # Product catalog with search/sort
  products/[slug]/page.tsx    # Product detail
  products/loading.tsx        # Product skeleton
  cart/page.tsx               # Shopping cart
  checkout/page.tsx           # Checkout with UPI
  order/[id]/page.tsx         # Order confirmation
  order/[id]/loading.tsx      # Order skeleton
  track/page.tsx              # Order tracking
  track/loading.tsx           # Tracking skeleton
  admin/page.tsx              # Admin dashboard
components/
  features/
    Hero.tsx                  # Homepage hero
    ProductCard.tsx           # Product card with hover swap
    ProductGrid.tsx           # Product grid layout
    ProductSearchBar.tsx      # Search input
    ProductSort.tsx           # Sort dropdown
    ProductAddToCart.tsx      # Add to cart button
    CartView.tsx              # Cart drawer
    CartToast.tsx             # Cart toast notification
    CheckoutForm.tsx          # Checkout form
    UPIPayment.tsx            # UPI payment with QR
    LoginForm.tsx             # Admin login form
    CustomerDashboard.tsx     # Customer account dashboard
    CustomerLoginForm.tsx     # Customer login form
    CustomerSignupForm.tsx    # Customer signup form
    CustomerOrdersList.tsx    # Customer order history
    OrderTrackingClient.tsx   # Order tracking UI
  admin/
    AdminDashboardClient.tsx  # Admin product management
    AdminOrdersTab.tsx        # Admin order management
    AdminTabs.tsx             # Products/Orders tab switcher
  layout/
    Header.tsx                # Sticky header with nav
    Footer.tsx                # Footer
    Layout.tsx                # Layout wrapper
  ui/
    Skeleton.tsx              # Skeleton loading components
    Marquee.tsx               # Animated marquee
data/
  products.ts                 # Static product catalog
hooks/
  useCart.ts                  # Cart state (localStorage)
  useSupabaseSession.ts       # Supabase session hook
lib/
  supabase/
    client.ts                 # Browser client
    server.ts                 # Server client
    admin.ts                  # Service role client
    public.ts                 # Public client
  products/
    get-products.ts           # Product fetching
    map.ts                    # Product row mapping
  orders/
    types.ts                  # Order status types
  validation.ts               # Input validation
  rate-limit.ts               # Rate limiting
  overrides.ts                # Product overrides
  utils.ts                    # Utilities (cn, formatInr)
supabase/
  schema.sql                  # Database schema
  seed-products.sql           # Sample products
  migrate-order-statuses.sql  # Order status expansion
  migrate-orders-rls.sql      # Orders RLS policies
  migrate-customer-auth.sql   # Customer auth tables
  migrate-atomic-stock.sql    # Atomic stock RPC
```

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ameer06/Vip-Raiments-E-Com.git
cd Vip-Raiments-E-Com
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run these SQL files in **Supabase SQL Editor** in order:

1. `supabase/schema.sql` — Creates all tables
2. `supabase/seed-products.sql` — Adds sample products
3. `supabase/migrate-order-statuses.sql` — Expands order statuses
4. `supabase/migrate-orders-rls.sql` — Updates RLS policies
5. `supabase/migrate-customer-auth.sql` — Customer auth tables
6. `supabase/migrate-atomic-stock.sql` — Atomic stock function

### Supabase Auth Config

1. Go to **Authentication → URL Configuration**
2. Set Site URL to `https://vip-raiments.vercel.app`
3. Add `https://vip-raiments.vercel.app` to Redirect URLs
4. Go to **Project Settings → Email** → change Sender name to `VIP Raiments`

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables

| Variable | Public | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Supabase service role key |
| `NEXT_PUBLIC_MERCHANT_UPI_ID` | Yes | UPI ID for payments |

See `ENV_VARIABLES.md` for detailed setup instructions.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` and `npm run type-check`
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## License

Private — VIP Raiments
