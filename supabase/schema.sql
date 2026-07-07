-- ============================================================
-- LMAJHOL — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Enable UUID
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- PRODUCTS
-- ------------------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text unique not null,
  price_mad    integer not null check (price_mad >= 0),
  color        text not null check (color in ('black','white')),
  description  text default '',
  image_url    text not null,
  gallery_urls text[] default '{}',
  sizes        text[] not null default array['S','M','L','XL','XXL'],
  stock        integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone (including anonymous) can READ active products
drop policy if exists "products_read_public" on public.products;
create policy "products_read_public"
  on public.products for select
  using ( active = true or auth.role() = 'authenticated' );

-- Only authenticated users (the admin) can insert / update / delete
drop policy if exists "products_write_admin" on public.products;
create policy "products_write_admin"
  on public.products for all
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );

-- ------------------------------------------------------------
-- ORDERS
-- ------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  customer       jsonb not null,
  items          jsonb not null,
  subtotal_mad   integer not null,
  shipping_mad   integer not null default 0,
  total_mad      integer not null,
  payment_method text not null default 'cash_on_delivery',
  status         text not null default 'new',
  created_at     timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Anonymous customers can INSERT their own orders (no read)
drop policy if exists "orders_insert_anon" on public.orders;
create policy "orders_insert_anon"
  on public.orders for insert
  with check ( true );

-- Only authenticated (admin) can READ / UPDATE orders
drop policy if exists "orders_read_admin" on public.orders;
create policy "orders_read_admin"
  on public.orders for select
  using ( auth.role() = 'authenticated' );

drop policy if exists "orders_update_admin" on public.orders;
create policy "orders_update_admin"
  on public.orders for update
  using ( auth.role() = 'authenticated' );

-- ------------------------------------------------------------
-- STORAGE BUCKET for product images
-- (Run this in SQL editor too, OR create manually in Storage UI as PUBLIC)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('lmajhol-products', 'lmajhol-products', true)
on conflict (id) do update set public = true;

-- Public read of images
drop policy if exists "public_read_products_bucket" on storage.objects;
create policy "public_read_products_bucket"
  on storage.objects for select
  using ( bucket_id = 'lmajhol-products' );

-- Authenticated (admin) upload / update / delete
drop policy if exists "admin_write_products_bucket" on storage.objects;
create policy "admin_write_products_bucket"
  on storage.objects for all
  using ( bucket_id = 'lmajhol-products' and auth.role() = 'authenticated' )
  with check ( bucket_id = 'lmajhol-products' and auth.role() = 'authenticated' );

-- ------------------------------------------------------------
-- SEED — starter products (edit or delete in /admin later)
-- ------------------------------------------------------------
insert into public.products (name, slug, price_mad, color, description, image_url, sizes, stock)
values
('The Oversized — Black', 'oversized-black', 199, 'black',
 '240gsm heavyweight cotton. Boxy fit, dropped shoulder, ribbed collar. Cut in Casablanca. Meant to be worn loose.',
 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop',
 array['S','M','L','XL','XXL'], 40),
('The Oversized — White', 'oversized-white', 199, 'white',
 '240gsm heavyweight cotton. Boxy fit, dropped shoulder, ribbed collar. Cut in Casablanca. Meant to be worn loose.',
 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1200&q=80&auto=format&fit=crop',
 array['S','M','L','XL','XXL'], 40)
on conflict (slug) do nothing;
