# VIP Raiments Deployment Checklist

Complete setup guide for deploying VIP Raiments to production.

## ✅ Prerequisites

- [ ] GitHub account with repository cloned
- [ ] Vercel account connected to GitHub
- [ ] Supabase account created
- [ ] Razorpay account created (for payments)
- [ ] Domain name (optional, Vercel provides default)

---

## 🚀 Phase 1: Supabase Setup (15 minutes)

Follow **SUPABASE_SETUP.md** for detailed steps:

- [ ] Step 1: Create Supabase project
- [ ] Step 2: Get and save API credentials
- [ ] Step 3: Create database tables (run schema.sql)
- [ ] Step 4: Seed sample products (run seed-products.sql)
- [ ] Step 5: Create storage bucket (`product-images`)
- [ ] Step 6: Create admin user
- [ ] Step 7: Configure environment variables in Vercel
- [ ] Step 8: Add Razorpay credentials (optional)

**Test:** Visit https://vip-raiments.vercel.app/admin → Should redirect to login

---

## 🔐 Phase 2: Environment Variables (10 minutes)

Follow **ENV_VARIABLES.md** for complete guide:

### Supabase Keys (Required)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Razorpay Keys (Optional for testing)
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`

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
- [ ] Search functionality works (if implemented)

**Shopping Flow:**
- [ ] Add product to cart (verify quantity controls)
- [ ] View cart (/cart)
- [ ] Update quantities in cart
- [ ] Remove items from cart
- [ ] Clear entire cart

**Checkout:**
- [ ] Fill shipping form with valid data
- [ ] Submit form with "Pay with mock gateway"
- [ ] Mock payment creates order successfully
- [ ] Redirected to order confirmation page
- [ ] Order details display correctly

**Admin Dashboard:**
- [ ] Navigate to /admin
- [ ] Redirected to login (if not authenticated)
- [ ] Login with admin user
- [ ] View product inventory table
- [ ] Edit product details
- [ ] Upload product images (if Storage bucket set up)
- [ ] View recent orders

**Performance:**
- [ ] Page load time under 3 seconds
- [ ] Images optimize and load quickly
- [ ] No console errors (Check browser DevTools)

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

### "Could not find table 'public-products'"
**Solution:** Run `supabase/schema.sql` in Supabase SQL Editor

### Checkout button disabled
**Solution:** Add SUPABASE_SERVICE_ROLE_KEY to Vercel env vars

### Admin login not working
**Solution:** Ensure admin user exists in `admin_users` table

### Images not displaying
**Solution:** Check `NEXT_PUBLIC_SUPABASE_URL` is correct

### Payment failing
**Solution:** Add RAZORPAY_KEY_SECRET to Vercel (make sure it's NOT public)

See **SUPABASE_SETUP.md** and **ENV_VARIABLES.md** for more details.

---

## 📚 Documentation Files

- **SUPABASE_SETUP.md** - Step-by-step Supabase configuration
- **ENV_VARIABLES.md** - Environment variables guide
- **ADMIN_GUIDE.md** - Admin dashboard usage
- **DEPLOYMENT_GUIDE.md** - Original deployment notes
- **README.md** - Project overview

---

## 🎯 Next Steps

### Immediate (Before Public Launch)
1. Test all checkout flows with real Razorpay sandbox
2. Configure email notifications (Supabase Edge Functions)
3. Set up analytics tracking (Google Analytics/Mixpanel)
4. Create support documentation for customers

### Short-term (Week 1-2)
1. Implement customer login/account page
2. Add order history viewing for customers
3. Set up abandoned cart recovery emails
4. Configure domain name with custom SSL

### Medium-term (Month 1-2)
1. Add inventory alerts for low stock
2. Implement multi-currency support
3. Add product filters by category
4. Create admin analytics dashboard

### Long-term (Quarter 1+)
1. Implement wishlist feature
2. Add product reviews and ratings
3. Integrate with shipping providers (EasyPost, ShipStation)
4. Set up subscription/membership program

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
- ✅ Images loading from Storage/CDN
- ✅ No errors in logs
- ✅ Performance under 3 seconds for LCP
- ✅ SEO metadata tags implemented
- ✅ Analytics tracking installed

---

## 📝 Version History

- **v1.0** (Jun 6, 2026) - Initial setup guide
- **v1.1** (TBD) - Payment integration updates
- **v2.0** (TBD) - Multi-vendor marketplace

---

**Last Updated:** June 6, 2026  
**Maintained by:** VIP Raiments Team  
**Contact:** support@vip-raiments.com
