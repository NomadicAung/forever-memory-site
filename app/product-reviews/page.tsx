import { ArchivePage } from "@/components/ArchivePage";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  metadata({ title: "Product Reviews", description: "Hands-on style review templates and product discovery pages.", path: "/product-reviews" });

export default async function ProductReviewsPage() {
  const [articles, products] = await Promise.all([getArticlesFromContent(), getProductsFromContent()]);
  return <ArchivePage title="Product Reviews" description="Review pages for collectible accessories, retro gaming gear, kawaii gifts, and nostalgia products." articles={articles.filter((article) => article.type === "review")} products={products} />;
}
