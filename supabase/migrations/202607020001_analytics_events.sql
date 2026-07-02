create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('affiliate_click', 'outbound_click')),
  product_slug text,
  product_name text,
  store text,
  target_url text,
  page_path text,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "Anyone can add analytics events" on public.analytics_events;
create policy "Anyone can add analytics events" on public.analytics_events
  for insert with check (event_type in ('affiliate_click', 'outbound_click'));

drop policy if exists "Admins read analytics events" on public.analytics_events;
create policy "Admins read analytics events" on public.analytics_events
  for select using (public.is_content_admin());

drop policy if exists "Admins delete analytics events" on public.analytics_events;
create policy "Admins delete analytics events" on public.analytics_events
  for delete using (public.is_content_admin());

create index if not exists analytics_events_event_type_created_at_idx on public.analytics_events (event_type, created_at desc);
create index if not exists analytics_events_product_slug_idx on public.analytics_events (product_slug);
