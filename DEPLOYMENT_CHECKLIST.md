# VIP Raiments Deployment Checklist

Complete setup guide for deploying VIP Raiments to production.

## ✅ Prerequisites

- [ ] GitHub account with repository cloned
- [ ] Vercel account connected to GitHub
- [ ] Supabase account created
- [ ] Domain name (optional, Vercel provides default)

---

## 🚀 Phase 1: Supabase Setup (15 minutes)

Follow **SUPABASE_SETUP.md** for detailed steps:

- [ ] Step 1: Create Supabase project
- [ ] Step 2: Get and save API credentials
- [ ] Step 3: Create database tables (run schema.sql)
- [ ] Step 4: Run customer auth migration (migrate-customer-auth.sql)
- [ ] Step 5: Run atomic stock migration (migrate-atomic-stock.sql)
- [ ] Step 6: Run order statuses migration (migrate-order-statuses.sql)
- [ ] Step 7: Create storage bucket (`product-images`)
- [ ] Step 8: Create admin user
- [ ] Step 9: Configure environment variables in Vercel

**Test:** Visit https://vip-raiments.vercel.app/admin → Should redirect to login

---

## 🔐 Phase 2: Environment Variables (10 minutes)

Follow **ENV_VARIABLES.md** for complete guide:

### Supabase Keys (Required)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### UPI Payment (Required)
- [ ] `NEXT_PUBLIC_MERCHANT_UPI_ID`

### Supabase Auth Config
- [ ] Set Site URL to `https://vip-raiments.vercel.app`
- [ ] Add redirect URL `https://vip-raiments.vercel.app`
- [ ] Change sender name to `VIP Raiments`

**Location:** Vercel → Project Settings → Environment Variables

**Test:** Vercel should auto-redeploy after adding variables

---

## 🧪 Phase 3: Testing (20 minutes)

### Test Checklist

**Homepage & Navigation:**
- [ ] Homepage loads (/)
- [ ] Products display (/products)
- [ ] Product detail page loads (/products/[slug])
- [ ] Navigation menu works
- [ ] Search functionality works (/products?q=keyword)
- [ ] Sort functionality works (/products?sort=price-low)

**Shopping Flow:**
- [ ] Add product to cart (verify quantity controls)
- [ ] View cart (/cart)
- [ ] Update quantities in cart
- [ ] Remove items from cart
- [ ] Clear entire cart

**Checkout:**
- [ ] Fill shipping form with valid data
- [ ] Submit form with UPI payment
- [ ] QR code displays correctly
- [ ] UPI app chooser works on mobile
- [ ] Payment confirmation creates order
- [ ] Redirected to order confirmation page

**Customer Account:**
- [ ] Create new account (/account/signup)
- [ ] Confirm email link works
- [ ] Sign in (/account/login)
- [ ] View order history (/account)
- [ ] Update profile (/account)
- [ ] Sign out works

**Order Tracking:**
- [ ] Track by order ID (/track)
- [ ] Track by email (/track)
- [ ] Order status displays correctly
- [ ] Status timeline shows history

**Admin Dashboard:**
- [ ] Navigate to /admin
- [ ] Redirected to login (if not authenticated)
- [ ] Login with admin user
- [ ] View product inventory (Products tab)
- [ ] Edit product details
- [ ] Upload product images
- [ ] View orders (Orders tab)
- [ ] Search/filter orders
- [ ] Update order status
- [ ] Add tracking number
- [ ] Export orders to CSV

**Performance:**
- [ ] Page load time under 3 seconds
- [ ] Images optimize and load quickly
- [ ] No console errors (Check browser DevTools)
- [ ] Skeleton loading states display

**Error Handling:**
- [ ] 404 page displays (/nonexistent-page)
- [ ] 500 error page displays
- [ ] Form validation errors display

---

## 📊 Phase 4: Monitoring (Ongoing)

### Daily Checks
- [ ] Check Vercel deployment status
- [ ] Monitor error logs in Supabase
- [ ] Check cart abandonment rate

### Weekly Tasks
- [ ] Review new orders
- [ ] Update inventory
- [ ] Backup database
- [ ] Check payment reconciliation

### Monthly Reviews
- [ ] Analyze sales data
- [ ] Update product catalog
- [ ] Review performance metrics
- [ ] Plan promotions

---

## 🛠️ Common Issues & Fixes

### "Could not find table 'public.products'"
**Solution:** Run `supabase/schema.sql` in Supabase SQL Editor

### Checkout button disabled
**Solution:** Add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars

### Admin login not working
**Solution:** Ensure admin user exists in `admin_users` table

### Images not displaying
**Solution:** Check `NEXT_PUBLIC_SUPABASE_URL` is correct

### Customer signup fails
**Solution:** Run `migrate-customer-auth.sql` in Supabase SQL Editor

### Stock goes negative
**Solution:** Run `migrate-atomic-stock.sql` in Supabase SQL Editor

### Order status update fails
**Solution:** Run `migrate-order-statuses.sql` in Supabase SQL Editor

### Confirmation email shows "Supabase"
**Solution:** Go to Supabase → Project Settings → Email → change Sender name

### Confirmation link broken
**Solution:** Go to Supabase → Authentication → URL Configuration → set Site URL

---

## 📚 Documentation Files

- **SUPABASE_SETUP.md** - Step-by-step Supabase configuration
- **ENV_VARIABLES.md** - Environment variables guide
- **ADMIN_GUIDE.md** - Admin dashboard usage
- **README.md** - Project overview

---

## 🎯 Roadmap

### Completed ✅
- [x] Product catalog with search and sort
- [x] Shopping cart with quantity controls
- [x] UPI payment with QR code
- [x] Customer authentication (signup/login)
- [x] Customer order history
- [x] Order tracking by ID/email
- [x] Admin product management
- [x] Admin order management with status updates
- [x] Atomic stock deduction
- [x] Server-side input validation
- [x] Rate limiting on payment endpoints
- [x] Skeleton loading states
- [x] Custom error pages (404, 500)

### Phase 2 (Next)
- [ ] Wishlist / Save for later
- [ ] Product reviews & ratings
- [ ] Shipping cost display
- [ ] Admin analytics dashboard
- [ ] Discount codes / coupons
- [ ] Related products

### Phase 3 (Future)
- [ ] GST invoice generation
- [ ] Multi-admin roles
- [ ] Bulk product import
- [ ] Abandoned cart recovery
- [ ] Email notifications
- [ ] Size guide

---

## 💾 Backup Strategy

Weekly backups are critical:

1. **Supabase Backups**
   - Automatic daily backups (Enterprise)
   - Manual exports: Supabase → Database → Backups

2. **GitHub Backups**
   - Code automatically backed up with every commit
   - No action needed

3. **Storage Backups**
   - Download product images monthly
   - Back up to external storage (Google Drive, AWS S3)

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **UPI Apps:** Google Pay, PhonePe, Paytm
- **Vercel Docs:** https://vercel.com/docs

---

## ✨ Success Criteria

Project is ready for production when:

- ✅ All tests pass (see Phase 3)
- ✅ Supabase tables created and populated
- ✅ Environment variables configured
- ✅ Admin account created and tested
- ✅ UPI payment integration working with QR code
- ✅ Customer authentication working
- ✅ Images loading from Storage/CDN
- ✅ No errors in logs
- ✅ Performance under 3 seconds for LCP
- ✅ SEO metadata tags implemented

---

## 📝 Version History

- **v1.0** (Jun 6, 2026) - Initial setup guide
- **v2.0** (Jun 22, 2026) - Updated with customer auth, search, security features

---

**Last Updated:** June 22, 2026  
**Maintained by:** VIP Raiments Team  
**Contact:** support@vip-raiments.com
