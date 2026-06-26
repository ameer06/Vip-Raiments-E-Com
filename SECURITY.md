# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

- **Email:** vipraiments@gmail.com
- **Do NOT** open a public GitHub issue for security vulnerabilities

## Security Measures

### Authentication
- Admin routes protected by middleware + RLS + requireAdmin (3 layers)
- Customer auth via Supabase Auth with email/password
- Session management via HTTP-only cookies

### Payment Security
- UPI payments processed server-side only
- No card data stored (UPI-only platform)
- Rate limiting on payment endpoints (10 requests/minute per IP)
- Server-side input validation on all API routes
- Atomic stock deduction via database RPC function

### Data Protection
- Row Level Security (RLS) on all database tables
- Customers can only view their own orders
- Service role key never exposed to client bundle
- Environment variables encrypted in Vercel

### Infrastructure
- HTTPS enforced via Vercel
- Admin routes blocked at edge (middleware)
- Input sanitization on all user inputs

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
| Older   | No        |

Always run the latest version for security patches.
