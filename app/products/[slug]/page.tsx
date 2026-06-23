import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { ProsCons } from "@/components/ProsCons";
import { getCategory, products as demoProducts, site } from "@/lib/data";
import { getProductFromContent, getProductsFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";
import { breadcrumbSchema, productSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductFromContent(slug);
  if (!product) return {};
  return metadata({
    title: product.seoTitle,
    description: product.metaDescription,
    path: `/products/${product.slug}`,
    image: product.image
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductFromContent(slug);
  if (!product) notFound();
  const category = getCategory(product.category);
  const products = await getProductsFromContent();
  const related = products.filter((item) => product.relatedProducts.includes(item.slug));

  return (
    <main className="container py-10">
      <JsonLd data={productSchema(product)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: site.url }, { name: product.name, url: `${site.url}/products/${product.slug}` }])} />
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-pink-50 shadow-soft">
          <Image src={product.image} alt={product.name} fill priority className="object-cover" />
        </div>
        <section>
          <p className="text-sm font-bold uppercase tracking-wide text-berry">{category?.name}</p>
          <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-ink/70">{product.shortDescription}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">{product.priceRange}</span>
            {product.rating !== undefined && (
              <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">{product.rating} / 5 rating</span>
            )}
            <span className="rounded-full bg-white px-4 py-2 font-bold shadow-sm">Best for: {product.bestFor}</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {product.affiliateLinks.map((link) => (
              <a
                key={`${link.store}-${link.url}`}
                href={link.url}
                rel="sponsored nofollow"
                target="_blank"
                className="rounded-full bg-berry px-5 py-3 text-center font-bold text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-6">
            <AffiliateDisclosure />
          </div>
        </section>
      </div>
      <section className="grid gap-7 py-12">
        <h2 className="text-2xl font-bold">Product notes</h2>
        <p className="max-w-3xl text-ink/70 leading-7">{product.longDescription}</p>
        <ProsCons pros={product.pros} cons={product.cons} />
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => <Link key={tag} href={`/blog?tag=${tag}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">{tag}</Link>)}
        </div>
      </section>
      <section>
        <h2 className="mb-5 text-2xl font-bold">Related products</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <ProductCard key={item.slug} product={item} compact />)}
        </div>
      </section>
    </main>
  );
}
