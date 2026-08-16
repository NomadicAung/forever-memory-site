import { ArchivePage } from "@/components/ArchivePage";
import { getArticlesFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const generateMetadata = () =>
  metadata({
    title: "Kawaii and Collector News",
    description: "Daily-style updates about cute character goods, comic collectibles, trending items, and collector culture.",
    path: "/news"
  });

export default async function NewsPage() {
  const articles = await getArticlesFromContent();
  const news = articles.filter((article) => article.type === "news");
  return (
    <ArchivePage
      title="Kawaii and Collector News"
      description="Fresh updates on Sanrio-style character news, comic character collectibles, trending items, launches, restocks, and collector culture."
      articles={news}
    />
  );
}
