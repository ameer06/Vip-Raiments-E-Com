# VIP Raiments Environment Variables Setup

Complete guide for setting up environment variables in Vercel and locally.

## Local Development (.env.local)

Create `.env.local` file in project root with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# UPI Payment
NEXT_PUBLIC_MERCHANT_UPI_ID=yourname@okaxis
```

⚠️ **Never commit .env.local to Git!** It's in .gitignore automatically.

## Vercel Production Environment

### Step 1: Get Credentials from Supabase

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Click **Settings** → **API**
3. Copy these:
   - **Project URL** (e.g., `https://abcdefg.supabase.co`)
   - **anon public** (starts with `eyJhbGciOiJ...`)
   - **service_role secret** (starts with `eyJhbGciOiJ...`)

### Step 2: Add to Vercel

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Click **Settings** → **Environment Variables**
3. Add each variable:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL
- **Name:** `NEXT_PUBLIC_SUPABASE_URL`
- **Value:** `https://your-project-id.supabase.co`
- **Environments:** Production, Preview, Development
- **Click:** Save

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJ...` (paste from Supabase)
- **Environments:** Production, Preview, Development
- **Click:** Save

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY
- **Name:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJ...` (paste from Supabase)
- **Environments:** Production, Preview, Development
- **⚠️ Important:** This is a secret! Never expose to frontend
- **Click:** Save

#### Variable 4: NEXT_PUBLIC_MERCHANT_UPI_ID
- **Name:** `NEXT_PUBLIC_MERCHANT_UPI_ID`
- **Value:** `yourname@okaxis`
- **Environments:** Production, Preview, Development
- **Click:** Save

### Step 3: Supabase Auth Configuration

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL** to: `https://vip-raiments.vercel.app`
3. Under **Redirect URLs**, add: `https://vip-raiments.vercel.app`
4. Go to **Project Settings → Email** → change **Sender name** to `VIP Raiments`
5. Click **Save**

### Step 4: Trigger Redeploy

After adding all environment variables:

1. Click the **Redeploy** button in Vercel
2. Wait for deployment to complete (usually 2-3 minutes)
3. Check deployment logs for errors
4. Visit your site and test

## Checking Environment Variables

### Locally
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $SUPABASE_SERVICE_ROLE_KEY
```

### In Browser Console (safe, public keys only)
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### In Server/API Routes (all keys available)
```typescript
console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)
```

⚠️ Never log secrets to browser console or logs!

## Environment Variable Security

| Variable | Public? | Where to Use | Example |
|----------|---------|--------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Browser, API | https://abc.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Browser, API | eyJ... (starts with ey) |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ Secret | API only | eyJ... (starts with ey) |
| `NEXT_PUBLIC_MERCHANT_UPI_ID` | ✅ Yes | Browser, API | yourname@okaxis |

**Rule:** Never prefix secrets with `NEXT_PUBLIC_`!

## Troubleshooting

### Error: "SUPABASE_SERVICE_ROLE_KEY is undefined"
- **Fix:** Add to Vercel environment variables
- **Check:** Make sure it's NOT prefixed with `NEXT_PUBLIC_`

### Error: "NEXT_PUBLIC_SUPABASE_URL is invalid"
- **Fix:** Make sure URL format is: `https://xxxxx.supabase.co`
- **Remove trailing slash!**

### Production works but Preview doesn't
- **Fix:** Make sure variables are set for Preview environment
- Check: Vercel Settings → Environment Variables → Environments dropdown

### Confirmation email shows "Supabase" as sender
- **Fix:** Go to Supabase → Project Settings → Email → change Sender name to `VIP Raiments`

### Confirmation link shows "This site can't be reached"
- **Fix:** Go to Supabase → Authentication → URL Configuration → set Site URL to `https://vip-raiments.vercel.app`

### Customer account creation fails
- **Fix:** Run `migrate-customer-auth.sql` in Supabase SQL Editor

### Stock goes negative on concurrent orders
- **Fix:** Run `migrate-atomic-stock.sql` in Supabase SQL Editor

## Testing Variables

After deployment, test endpoints:

```bash
curl https://vip-raiments.vercel.app/api/admin/products
```
