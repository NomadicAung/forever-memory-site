import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "About", description: "Learn about Forever Memory and its nostalgic product discovery mission.", path: "/about" });

export default function AboutPage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-black">About Forever Memory</h1>
      <p className="mt-5 leading-8 text-ink/70">
        Forever Memory helps people rediscover the products, characters, toys, games, and collectibles that bring back
        happy memories. The site is designed for kawaii fans, 90s kids, retro gaming collectors, toy and figure
        collectors, and gift buyers.
      </p>
      <p className="mt-4 leading-8 text-ink/70">
        The editorial approach is simple: useful buying help, clear affiliate disclosure, nostalgic context, and product
        pages that are easy to update as stores and prices change.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-berry">
        <a href="https://www.facebook.com/formemo/" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-2">Facebook</a>
        <a href="https://www.pinterest.com/forevermemory0051/" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-2">Pinterest</a>
        <a href="https://www.tiktok.com/@forever.memory4" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-2">TikTok</a>
        <a href="https://www.youtube.com/@ForeverMemorychannel" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-2">YouTube</a>
      </div>
    </main>
  );
}
