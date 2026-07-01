alter table public.products
add column if not exists gallery_images text[] not null default '{}';

update public.products
set gallery_images = array[image]
where image <> '' and coalesce(array_length(gallery_images, 1), 0) = 0;
