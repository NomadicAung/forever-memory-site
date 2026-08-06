alter table public.products
  add column if not exists room_glow_up_enabled boolean not null default true;
