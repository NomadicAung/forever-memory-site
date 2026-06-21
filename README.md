# Forever Memory Affiliate Website

This is a scalable Next.js affiliate content site for `forevermemory.xyz`.

## Recommendation

Use a Next.js rebuild for the affiliate site.

Reason: the requested site depends on structured products, multiple affiliate links per product, article templates, schema markup, fast static/server-rendered pages, archive pages, and a future admin dashboard. WordPress can do this with custom post types and custom fields, but the implementation becomes plugin-dependent and harder to keep fast as the content library grows.

Best path:

1. Keep the current WordPress site live while building and reviewing this Next.js version.
2. Move the domain to the new build when ready.
3. If you want to preserve old WordPress URLs, add redirects in `next.config.mjs`.
4. Later, connect the content model to Supabase, Postgres, Sanity, Payload, or another CMS.

WordPress fallback: use custom post types for Products, Reviews, Buying Guides, and Nostalgia Articles, plus Advanced Custom Fields for affiliate links, pros/cons, product images, schema fields, and SEO metadata.

## Website Structure

- `/` Homepage
- `/categories/kawaii`
- `/categories/nostalgia`
- `/categories/retro-gaming`
- `/gift-guides`
- `/product-reviews`
- `/comparison-articles`
- `/blog`
- `/products/[slug]`
- `/articles/[slug]`
- `/about`
- `/contact`
- `/affiliate-disclosure`
- `/privacy-policy`
- `/admin`
- `/sitemap.xml`
- `/robots.txt`

## Content Model

Products support:

- Product name
- Category
- Brand
- Product image
- Short description
- Long description
- Price range
- Multiple affiliate links
- Store name
- Rating
- Pros
- Cons
- Best for
- Tags
- Related products
- SEO title
- Meta description
- Slug

Articles support:

- Best-of list articles
- Product reviews
- Comparison articles
- Nostalgia memory articles
- Featured image
- Pinterest image
- Table of contents
- Product cards
- Comparison table
- Pros and cons box
- FAQ section
- Related posts
- SEO metadata
- Affiliate disclosure

Current demo content lives in:

- `lib/data.ts`
- `lib/types.ts`

## Supabase

The site now supports Supabase-backed products, articles, admin authentication, draft/published status, row-level security, and product-image uploads. When Supabase environment variables are absent, the existing demo content remains available.

Follow [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the one-time project setup.

## Database Model

Production tables can follow this shape:

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  image text,
  accent text
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_slug text references categories(slug),
  name text not null,
  brand text,
  image text,
  short_description text,
  long_description text,
  price_range text,
  rating numeric,
  best_for text,
  tags text[] default '{}',
  related_product_slugs text[] default '{}',
  seo_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table affiliate_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  store text not null,
  label text not null,
  url text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  type text not null,
  category_slug text,
  title text not null,
  excerpt text,
  featured_image text,
  pinterest_image text,
  author text,
  published_at date,
  updated_at date,
  sections jsonb default '[]',
  comparison_rows jsonb default '[]',
  pros text[] default '{}',
  cons text[] default '{}',
  faqs jsonb default '[]',
  tags text[] default '{}',
  seo_title text,
  meta_description text
);

create table article_products (
  article_id uuid references articles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  primary key (article_id, product_id)
);
```

## SEO Setup

Included:

- Per-page metadata
- Canonical URLs
- Open Graph metadata
- Twitter Card metadata
- Product schema
- Article schema
- FAQ schema
- Breadcrumb schema
- Sitemap route
- Robots route
- Category archives
- Product and article slugs
- Affiliate disclosure blocks
- Sponsored nofollow affiliate links

## Environment Variables

Copy `.env.example` to `.env.local`.

```bash
NEXT_PUBLIC_SITE_URL=https://forevermemory.xyz
NEXT_PUBLIC_SITE_NAME=Forever Memory
NEXT_PUBLIC_NEWSLETTER_ACTION=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Deployment

Supported hosts include DigitalOcean App Platform and Vercel. For DigitalOcean, follow [DIGITALOCEAN_SETUP.md](./DIGITALOCEAN_SETUP.md).

### Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL=https://forevermemory.xyz`.
4. Add the domain `forevermemory.xyz`.
5. Update DNS at your domain registrar using Vercel's instructions.
6. Run a production build.
7. Submit `/sitemap.xml` in Google Search Console.

Other hosts: Netlify, Cloudflare Pages, Render, or a VPS that supports Next.js.

## Updating Products

Fastest starter workflow:

1. Open `/admin`.
2. Add a product with store and affiliate URL.
3. Download the exported JSON.
4. Use the JSON to update a database seed or replace entries in `lib/data.ts`.

Manual workflow:

1. Open `lib/data.ts`.
2. Add a product object to `products`.
3. Add one or more `affiliateLinks`.
4. Use real affiliate URLs.
5. Keep `rel="sponsored nofollow"` behavior in `ProductCard.tsx` and product pages.
6. Add related product slugs.
7. Add SEO title and meta description.

## Updating Articles

1. Add an article object to `articles` in `lib/data.ts`.
2. Choose `type`: `best-of`, `review`, `comparison`, or `memory`.
3. Add section headings and body text.
4. Add product slugs in `products`.
5. Add `comparisonRows` for comparison posts.
6. Add `faqs` for FAQ schema.
7. Add a Pinterest-friendly image.
8. Add SEO title and meta description.

## Next Production Improvements

- Replace demo URLs with approved affiliate links.
- Connect `/admin` to Supabase or another protected CMS.
- Add image uploads.
- Add search and filtering.
- Add email provider integration.
- Add analytics and cookie consent if required.
- Have a legal professional review the privacy policy and affiliate disclosure.
