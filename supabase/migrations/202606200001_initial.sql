create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published');
create type public.app_role as enum ('admin', 'editor');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role public.app_role not null default 'editor',
  created_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key,
  name text not null,
  description text not null default '',
  image text,
  accent text not null default 'bg-pink-100',
  sort_order integer not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text not null references public.categories(slug),
  brand text not null default '',
  image text not null default '',
  short_description text not null default '',
  long_description text not null default '',
  price_range text not null default 'Check latest price',
  affiliate_links jsonb not null default '[]'::jsonb,
  rating numeric check (rating is null or (rating >= 0 and rating <= 5)),
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  best_for text not null default '',
  tags text[] not null default '{}',
  related_products text[] not null default '{}',
  seo_title text not null default '',
  meta_description text not null default '',
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  type text not null check (type in ('best-of', 'review', 'comparison', 'memory')),
  category text not null,
  excerpt text not null default '',
  featured_image text not null default '',
  pinterest_image text not null default '',
  author text not null default 'Forever Memory Editors',
  published_at date,
  sections jsonb not null default '[]'::jsonb,
  comparison_rows jsonb,
  pros text[],
  cons text[],
  faqs jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  related_products text[] not null default '{}',
  seo_title text not null default '',
  meta_description text not null default '',
  status public.content_status not null default 'draft',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_content_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;

create policy "Users can read their profile" on public.profiles
  for select using (id = auth.uid());
create policy "Admins manage profiles" on public.profiles
  for all using (public.is_content_admin()) with check (public.is_content_admin());

create policy "Categories are public" on public.categories
  for select using (true);
create policy "Admins manage categories" on public.categories
  for all using (public.is_content_admin()) with check (public.is_content_admin());

create policy "Published products are public" on public.products
  for select using (status = 'published' or public.is_content_admin());
create policy "Admins create products" on public.products
  for insert with check (public.is_content_admin() and created_by = auth.uid());
create policy "Admins update products" on public.products
  for update using (public.is_content_admin()) with check (public.is_content_admin());
create policy "Admins delete products" on public.products
  for delete using (public.is_content_admin());

create policy "Published articles are public" on public.articles
  for select using (status = 'published' or public.is_content_admin());
create policy "Admins create articles" on public.articles
  for insert with check (public.is_content_admin() and created_by = auth.uid());
create policy "Admins update articles" on public.articles
  for update using (public.is_content_admin()) with check (public.is_content_admin());
create policy "Admins delete articles" on public.articles
  for delete using (public.is_content_admin());

insert into public.categories (slug, name, description, image, accent, sort_order) values
  ('kawaii', 'Kawaii', 'Cute gifts, cozy accessories, stationery, and character-inspired finds.', '/images/kawaii-finds.webp', 'bg-pink-100', 1),
  ('nostalgia', 'Nostalgia', 'Toys, keepsakes, displays, and memory-soaked finds from happier times.', '/images/nostalgia-finds.webp', 'bg-yellow-100', 2),
  ('retro-gaming', 'Retro Gaming', 'Handhelds, games, cases, and accessories for retro gaming fans.', '/images/retro-gaming-finds.webp', 'bg-cyan-100', 3)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  accent = excluded.accent,
  sort_order = excluded.sort_order;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

create policy "Product images are public" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_content_admin());
create policy "Admins update product images" on storage.objects
  for update using (bucket_id = 'product-images' and public.is_content_admin());
create policy "Admins delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_content_admin());
