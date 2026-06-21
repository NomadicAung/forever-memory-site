import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group overflow-hidden rounded-lg border border-pink-100 bg-white shadow-soft">
      <div className="relative aspect-[5/3]">
        <Image src={category.image} alt={category.name} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover transition duration-300 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold">{category.name}</h3>
        <p className="mt-2 text-sm leading-6 text-ink/70">{category.description}</p>
      </div>
    </Link>
  );
}
