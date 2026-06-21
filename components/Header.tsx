import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

const nav = [
  ["Home", "/"],
  ["Kawaii", "/categories/kawaii"],
  ["Nostalgia", "/categories/nostalgia"],
  ["Retro Gaming", "/categories/retro-gaming"],
  ["Gift Guides", "/gift-guides"],
  ["Blog", "/blog"]
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-pink-100 bg-cream/95 backdrop-blur">
      <div className="container flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" aria-label="Forever Memory home" className="shrink-0">
          <Image src="/images/forever-memory-logo.jpg" alt="Forever Memory" width={250} height={250} priority className="h-12 w-12 rounded-lg object-cover sm:h-14 sm:w-14" />
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-ink/75 lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-berry">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/blog"
          aria-label="Search articles"
          className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white text-ink shadow-sm"
        >
          <Search size={18} />
        </Link>
      </div>
    </header>
  );
}
