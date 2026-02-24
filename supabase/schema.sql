-- Panatech Invoice schema (migration-safe)
-- Run in Supabase SQL editor. Safe for fresh installs and upgrades.

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.assign_invoice_number()
returns trigger
language plpgsql
as $$
declare
  selected_prefix text;
begin
  if new.invoice_number is not null and btrim(new.invoice_number) <> '' then
    return new;
  end if;

  select nullif(invoice_prefix, '')
  into selected_prefix
  from public.account_settings
  where user_id = new.user_id;

  selected_prefix := coalesce(upper(selected_prefix), 'INV');
  new.invoice_number :=
    selected_prefix
    || '-'
    || to_char(timezone('utc', now()), 'YYYYMMDD')
    || '-'
    || upper(substring(encode(gen_random_bytes(3), 'hex') from 1 for 6));

  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    updated_at = timezone('utc', now());

  insert into public.account_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

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
  invoice_number text,
  customer_name text,
  customer_email text,
  amount numeric(12, 2),
  due_date date,
  status text not null default 'draft',
  issued_at date default current_date,
  paid_at date,
  currency_code text not null default 'USD' check (currency_code ~ '^[A-Z]{3}$'),
  description text,
  line_items jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Upgrade older schemas that used client_name/client_email and pending status.
alter table public.invoices add column if not exists customer_name text;
alter table public.invoices add column if not exists customer_email text;
alter table public.invoices add column if not exists due_date date;
alter table public.invoices add column if not exists amount numeric(12, 2);
alter table public.invoices add column if not exists status text not null default 'draft';
alter table public.invoices add column if not exists invoice_number text;
alter table public.invoices add column if not exists issued_at date default current_date;
alter table public.invoices add column if not exists paid_at date;
alter table public.invoices add column if not exists currency_code text not null default 'USD';
alter table public.invoices add column if not exists description text;
alter table public.invoices add column if not exists line_items jsonb not null default '[]'::jsonb;
alter table public.invoices add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'invoices'
      and column_name = 'client_name'
  ) then
    execute 'update public.invoices set customer_name = coalesce(customer_name, client_name) where customer_name is null';
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'invoices'
      and column_name = 'client_email'
  ) then
    execute 'update public.invoices set customer_email = coalesce(customer_email, client_email) where customer_email is null';
  end if;
end;
$$;

alter table public.invoices drop constraint if exists invoices_status_check;

update public.invoices
set
  status = case lower(coalesce(status, 'draft'))
    when 'pending' then 'sent'
    when 'paid' then 'paid'
    when 'sent' then 'sent'
    else 'draft'
  end,
  due_date = coalesce(due_date, current_date + 14),
  customer_name = coalesce(nullif(trim(customer_name), ''), 'Unknown Customer'),
  customer_email = coalesce(nullif(trim(customer_email), ''), 'unknown@example.com'),
  amount = coalesce(amount, 1),
  issued_at = coalesce(issued_at, current_date),
  paid_at = case
    when lower(coalesce(status, '')) = 'paid' then coalesce(paid_at, current_date)
    else paid_at
  end;

alter table public.invoices
  alter column customer_name set not null,
  alter column customer_email set not null,
  alter column due_date set not null,
  alter column amount set not null;

alter table public.invoices add constraint invoices_status_check
  check (status in ('draft', 'sent', 'paid'));

alter table public.invoices drop constraint if exists invoices_amount_check;
alter table public.invoices add constraint invoices_amount_check
  check (amount > 0);

alter table public.invoices drop constraint if exists invoices_invoice_number_key;
create unique index if not exists invoices_user_invoice_number_idx
  on public.invoices (user_id, invoice_number)
  where invoice_number is not null;

create index if not exists invoices_user_created_idx on public.invoices (user_id, created_at desc);
create index if not exists invoices_user_status_idx on public.invoices (user_id, status);
create index if not exists invoices_user_due_date_idx on public.invoices (user_id, due_date asc);
create index if not exists invoices_metadata_gin_idx on public.invoices using gin (metadata);

drop trigger if exists trg_profiles_touch_updated_at on public.profiles;
create trigger trg_profiles_touch_updated_at
before update on public.profiles
for each row
execute function public.touch_updated_at();

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

drop trigger if exists trg_invoices_assign_number on public.invoices;
create trigger trg_invoices_assign_number
before insert on public.invoices
for each row
execute function public.assign_invoice_number();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.account_settings enable row level security;
alter table public.invoices enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

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

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.account_settings to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
