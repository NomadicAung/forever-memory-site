import Image from "next/image";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { ComparisonTable } from "@/components/ComparisonTable";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProsCons } from "@/components/ProsCons";
import { ArticleCard } from "@/components/ArticleCard";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { articles as demoArticles, site } from "@/lib/data";
import { getArticleFromContent, getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export function generateStaticParams() {
  return demoArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleFromContent(slug);
  if (!article) return {};
  return metadata({
    title: article.seoTitle,
    description: article.metaDescription,
    path: `/articles/${article.slug}`,
    image: article.featuredImage
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleFromContent(slug);
  if (!article) notFound();
  const [products, articles] = await Promise.all([getProductsFromContent(), getArticlesFromContent()]);
  const articleProducts = products.filter((product) => article.products.includes(product.slug));
  const related = articles.filter((item) => item.slug !== article.slug && item.category === article.category).slice(0, 3);

  return (
    <main className="container py-10">
      <JsonLd data={articleSchema(article)} />
      <JsonLd data={faqSchema(article)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: article.title, url: `${site.url}/articles/${article.slug}` }])} />
      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-berry">{article.type.replace("-", " ")}</p>
          <h1 className="mt-2 text-4xl font-black md:text-6xl">{article.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/70">{article.excerpt}</p>
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-pink-50 shadow-soft">
            <Image src={article.featuredImage} alt={article.title} fill priority className="object-cover" />
          </div>
          <div className="mt-6">
            <AffiliateDisclosure />
          </div>
          <section className="mt-8 rounded-lg border border-pink-100 bg-white p-5">
            <h2 className="font-bold">Table of contents</h2>
            <ol className="mt-3 grid gap-2 text-sm text-ink/70">
              {article.sections.map((section) => <li key={section.heading}>{section.heading}</li>)}
              {articleProducts.length > 0 && <li>Recommended products</li>}
              {article.faqs.length > 0 && <li>FAQ</li>}
            </ol>
          </section>
          <div className="mt-10 grid gap-8">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold">{section.heading}</h2>
                <p className="mt-3 leading-8 text-ink/70">{section.body}</p>
              </section>
            ))}
            {article.comparisonRows && <ComparisonTable rows={article.comparisonRows} />}
            <ProsCons pros={article.pros} cons={article.cons} />
            <section>
              <h2 className="mb-5 text-2xl font-bold">Recommended products</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {articleProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
              </div>
            </section>
            <Faq items={article.faqs} />
          </div>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-pink-100 bg-white p-5">
            <p className="text-sm font-bold uppercase tracking-wide text-berry">Pinterest image</p>
            <div className="relative mt-3 aspect-[2/3] overflow-hidden rounded-lg">
              <Image src={article.pinterestImage} alt={`${article.title} Pinterest image`} fill className="object-cover" />
            </div>
          </div>
        </aside>
      </article>
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-5 text-2xl font-bold">Related posts</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((item) => <ArticleCard key={item.slug} article={item} />)}
          </div>
        </section>
      )}
    </main>
  );
}
