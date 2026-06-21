import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="overflow-hidden rounded-lg border border-pink-100 bg-white shadow-soft">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-lilac/20">
          <Image src={article.featuredImage} alt={article.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
      </Link>
      <div className="grid gap-3 p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-berry">{article.type.replace("-", " ")}</p>
        <Link href={`/articles/${article.slug}`} className="font-bold text-xl leading-tight hover:text-berry">
          {article.title}
        </Link>
        <p className="text-sm leading-6 text-ink/70">{article.excerpt}</p>
      </div>
    </article>
  );
}
