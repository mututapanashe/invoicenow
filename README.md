# Panatech Invoice

Panatech Invoice is a Next.js + Supabase invoicing app with:

- Auth (email/password + Google OAuth)
- Invoice CRUD with responsive views
- Account settings persistence
- Collection-focused dashboard analytics
- Per-invoice PDF export
- Modern light-mode UI (Poppins + mobile-first layouts)

## 1. Environment Setup

Keep `.env.example` in git and copy values into `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Database Setup (Supabase)

Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor.

This creates:

- `profiles` table + signup trigger
- `account_settings` table
- `invoices` table
- migration-safe compatibility updates for older invoice schemas
- indexes and constraints
- updated_at triggers
- RLS policies for tenant isolation

## 3. Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 4. SaaS Notes

- The app is multi-tenant by `auth.uid()` with RLS enforced in SQL.
- All invoice/settings writes are server actions.
- PDF downloads are protected and scoped to the authenticated user.
- Google OAuth requires enabling the Google provider in Supabase Auth and adding redirect URL:
  `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
