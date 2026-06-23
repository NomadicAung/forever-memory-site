import { ArchivePage } from "@/components/ArchivePage";
import { getArticlesFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  metadata({ title: "Gift Guides", description: "Nostalgic gift guides for kawaii fans, 90s kids, retro gamers, and collectors.", path: "/gift-guides" });

export default async function GiftGuidesPage() {
  const articles = await getArticlesFromContent();
  return <ArchivePage title="Gift Guides" description="Product-led buying guides built around memory, cuteness, and collectible joy." articles={articles.filter((article) => article.category === "gift-guides" || article.type === "best-of")} />;
}
