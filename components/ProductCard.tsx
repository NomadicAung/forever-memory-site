import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const primary = product.affiliateLinks[0];

  return (
    <article className="overflow-hidden rounded-lg border border-pink-100 bg-white shadow-soft">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-pink-50">
          <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
        </div>
      </Link>
      <div className="grid gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wide text-berry">{product.priceRange}</p>
          {product.rating !== undefined && (
            <span className="flex items-center gap-1 text-sm font-semibold text-ink/75">
              <Star size={16} className="fill-sunny text-sunny" /> {product.rating}
            </span>
          )}
        </div>
        <Link href={`/products/${product.slug}`} className="font-bold text-lg leading-tight hover:text-berry">
          {product.name}
        </Link>
        {!compact && <p className="text-sm leading-6 text-ink/70">{product.shortDescription}</p>}
        <div className="flex flex-wrap gap-2">
          <a
            href={primary.url}
            rel="sponsored nofollow"
            target="_blank"
            className="rounded-full bg-berry px-4 py-2 text-sm font-bold text-white"
          >
            {primary.label}
          </a>
          <Link href={`/products/${product.slug}`} className="rounded-full border border-pink-200 px-4 py-2 text-sm font-bold text-ink">
            Review
          </Link>
        </div>
      </div>
    </article>
  );
}
