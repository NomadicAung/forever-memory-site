import { ArchivePage } from "@/components/ArchivePage";
import { getArticlesFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Comparison Articles", description: "Side-by-side comparisons for stores, handhelds, gifts, and collector gear.", path: "/comparison-articles" });

export default async function ComparisonArticlesPage() {
  const articles = await getArticlesFromContent();
  return <ArchivePage title="Comparison Articles" description="Comparison templates with tables, product cards, FAQs, and affiliate disclosure blocks." articles={articles.filter((article) => article.type === "comparison")} />;
}
