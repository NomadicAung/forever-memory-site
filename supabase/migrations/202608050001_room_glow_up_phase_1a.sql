alter table public.products
add column if not exists aesthetic_tags text[] not null default '{}',
add column if not exists room_type_tags text[] not null default '{}',
add column if not exists color_tags text[] not null default '{}',
add column if not exists shipping_regions text[] not null default '{}',
add column if not exists availability text not null default 'active',
add column if not exists affiliate_network text not null default 'Other',
add column if not exists editorial_priority integer not null default 0,
add column if not exists last_verified_at date;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_availability_check'
  ) then
    alter table public.products
    add constraint products_availability_check check (availability in ('active', 'limited', 'unavailable'));
  end if;
end $$;

create table if not exists public.room_glow_up_analyses (
  id uuid primary key default gen_random_uuid(),
  image_path text,
  space_type text not null,
  aesthetic text not null,
  budget text not null,
  region text not null,
  analysis jsonb not null default '{}'::jsonb,
  matched_products jsonb not null default '[]'::jsonb,
  consent_confirmed boolean not null default true,
  expires_at timestamptz not null default (now() + interval '1 day'),
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.room_glow_up_analyses enable row level security;

create policy "Admins read room glow up analyses" on public.room_glow_up_analyses
  for select using (public.is_content_admin());
create policy "Admins delete room glow up analyses" on public.room_glow_up_analyses
  for delete using (public.is_content_admin());

create index if not exists room_glow_up_analyses_created_at_idx on public.room_glow_up_analyses (created_at desc);
create index if not exists room_glow_up_analyses_expires_at_idx on public.room_glow_up_analyses (expires_at);

insert into storage.buckets (id, name, public)
values ('room-glow-up-images', 'room-glow-up-images', false)
on conflict (id) do update set public = false;

do $$
begin
  if exists (
    select 1 from pg_constraint where conname = 'analytics_events_event_type_check'
  ) then
    alter table public.analytics_events drop constraint analytics_events_event_type_check;
  end if;
  alter table public.analytics_events
  add constraint analytics_events_event_type_check
  check (event_type in ('affiliate_click', 'outbound_click', 'room_glow_up_analysis', 'room_glow_up_delete'));
end $$;

drop policy if exists "Anyone can add analytics events" on public.analytics_events;
create policy "Anyone can add analytics events" on public.analytics_events
  for insert with check (event_type in ('affiliate_click', 'outbound_click', 'room_glow_up_analysis', 'room_glow_up_delete'));
