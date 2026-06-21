import { ArchivePage } from "@/components/ArchivePage";
import { getArticlesFromContent } from "@/lib/content";
import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Blog and Memory Articles", description: "Nostalgia articles, memory lists, and collectible discovery stories.", path: "/blog" });

export default async function BlogPage() {
  const articles = await getArticlesFromContent();
  return <ArchivePage title="Blog and Memory Articles" description="Pinterest-friendly nostalgic stories and evergreen articles for internal linking." articles={articles} />;
}
