alter table public.articles
  drop constraint if exists articles_type_check;

alter table public.articles
  add constraint articles_type_check
  check (type in ('best-of', 'review', 'comparison', 'memory', 'news'));
