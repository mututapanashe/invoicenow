# Panatech Invoice

Panatech Invoice is a Next.js + Supabase invoicing app with:

- Auth (register/login/logout)
- Invoice CRUD
- Account settings persistence
- Per-invoice PDF export
- Gold/black/orange themed dashboard UI

## 1. Environment Setup

Keep `.env.example` in git and copy values into `.env.local`:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 2. Database Setup (Supabase)

Run [`supabase/schema.sql`](supabase/schema.sql) in your Supabase SQL editor.

This creates:

- `account_settings` table
- `invoices` table
- indexes
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
