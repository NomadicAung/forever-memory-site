import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Stars } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { categories, site } from "@/lib/data";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  metadata({
    title: "Discover Products That Bring Back Memories",
    description: site.description,
    image: categories[0].image
  });

export default async function HomePage() {
  const [articles, products] = await Promise.all([getArticlesFromContent(), getProductsFromContent()]);
  const guides = articles.filter((article) => article.type === "best-of" || article.category === "gift-guides");
  const selectedProducts = products.filter((product) => product.featured);
  const featuredProducts = selectedProducts.length > 0 ? selectedProducts : products.slice(0, 6);

  return (
    <main>
      <section className="relative overflow-hidden bg-white">
        <div className="container grid min-h-[78vh] gap-10 py-10 md:grid-cols-[1fr_0.9fr] md:items-center">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold text-berry">
              <Heart size={16} /> Kawaii, retro, collectible
            </p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.02] md:text-7xl">
              Discover Products That Bring Back Memories
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink/70">
              Kawaii finds, retro gaming gear, 90s nostalgia, and collectible treasures for people who love happy
              throwback moments.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/gift-guides" className="inline-flex items-center gap-2 rounded-full bg-berry px-6 py-3 font-bold text-white">
                Browse guides <ArrowRight size={18} />
              </Link>
              <Link href="/categories/retro-gaming" className="rounded-full border border-pink-200 px-6 py-3 font-bold text-ink">
                Retro gaming
              </Link>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
              alt="Retro gaming and nostalgic collectibles"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-berry">
              <Stars size={16} /> Featured categories
            </p>
            <h2 className="mt-2 text-3xl font-bold">Start with a memory lane</h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => <CategoryCard key={category.slug} category={category} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-7">
          <h2 className="text-3xl font-bold">Popular buying guides</h2>
          <p className="mt-2 text-ink/70">Search-friendly guides built for product cards, FAQs, comparisons, and Pinterest images.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {guides.slice(0, 4).map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-7">
          <h2 className="text-3xl font-bold">Featured affiliate products</h2>
          <p className="mt-2 text-ink/70">Demo products include editable price ranges, stores, ratings, tags, and affiliate buttons.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-7">
          <h2 className="text-3xl font-bold">Latest nostalgia articles</h2>
        </div>
        <div className="pinterest-grid">
          {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
