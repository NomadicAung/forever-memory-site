import { ArticleCard } from "@/components/ArticleCard";
import { ProductCard } from "@/components/ProductCard";
import type { Article, Product } from "@/lib/types";

export function ArchivePage({
  title,
  description,
  articles = [],
  products = []
}: {
  title: string;
  description: string;
  articles?: Article[];
  products?: Product[];
}) {
  return (
    <main className="container py-10">
      <section className="rounded-lg bg-white p-8 shadow-soft md:p-10">
        <p className="text-sm font-bold uppercase tracking-wide text-berry">Forever Memory</p>
        <h1 className="mt-2 text-4xl font-black">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-ink/70">{description}</p>
      </section>
      {articles.length > 0 && (
        <section className="py-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        </section>
      )}
      {products.length > 0 && (
        <section className="py-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </section>
      )}
    </main>
  );
}
