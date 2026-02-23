-- Panatech Invoice schema for Supabase
-- Run in the Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.account_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  company_name text not null default 'Panatech Invoice',
  company_email text,
  company_phone text,
  company_address text,
  company_website text,
  default_currency text not null default 'USD' check (default_currency ~ '^[A-Z]{3}$'),
  payment_terms_days integer not null default 14 check (payment_terms_days between 1 and 180),
  invoice_prefix text not null default 'INV' check (invoice_prefix ~ '^[A-Z0-9-]{2,8}$'),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  amount numeric(12, 2) not null check (amount > 0),
  due_date date not null,
  status text not null default 'draft' check (status in ('draft', 'sent', 'paid')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists invoices_user_created_idx on public.invoices (user_id, created_at desc);
create index if not exists invoices_user_status_idx on public.invoices (user_id, status);

drop trigger if exists trg_account_settings_touch_updated_at on public.account_settings;
create trigger trg_account_settings_touch_updated_at
before update on public.account_settings
for each row
execute function public.touch_updated_at();

drop trigger if exists trg_invoices_touch_updated_at on public.invoices;
create trigger trg_invoices_touch_updated_at
before update on public.invoices
for each row
execute function public.touch_updated_at();

alter table public.account_settings enable row level security;
alter table public.invoices enable row level security;

drop policy if exists "Users can manage own account settings" on public.account_settings;
create policy "Users can manage own account settings"
on public.account_settings
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own invoices" on public.invoices;
create policy "Users can manage own invoices"
on public.invoices
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.account_settings to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
