import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, site } from "@/lib/data";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return metadata({
    title: category.name,
    description: category.description,
    path: `/categories/${category.slug}`,
    image: category.image
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const [products, articles] = await Promise.all([getProductsFromContent(), getArticlesFromContent()]);
  const productList = products.filter((product) => product.category === category.slug);
  const articleList = articles.filter((article) => article.category === category.slug);

  return (
    <main className="container py-10">
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: category.name, url: `${site.url}/categories/${category.slug}` }])} />
      <section className={`rounded-lg ${category.accent} p-8 md:p-10`}>
        <p className="text-sm font-bold uppercase tracking-wide text-berry">Category archive</p>
        <h1 className="mt-2 text-4xl font-black">{category.name}</h1>
        <p className="mt-3 max-w-2xl text-ink/70">{category.description}</p>
      </section>
      <section className="py-10">
        <h2 className="mb-5 text-2xl font-bold">Featured products</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productList.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      </section>
      <section className="py-6">
        <h2 className="mb-5 text-2xl font-bold">Articles and guides</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articleList.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      </section>
    </main>
  );
}
