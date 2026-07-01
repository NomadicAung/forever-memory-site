"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const nav = [
  ["Home", "/"],
  ["Kawaii", "/categories/kawaii"],
  ["Nostalgia", "/categories/nostalgia"],
  ["Retro Gaming", "/categories/retro-gaming"],
  ["Gift Guides", "/gift-guides"],
  ["Blog", "/blog"]
];

export function Header() {
  const [open, setOpen] = useState(false);

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
        <div className="flex items-center gap-2">
          <Link
            href="/blog"
            aria-label="Search articles"
            className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white text-ink shadow-sm"
          >
            <Search size={18} />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white text-ink shadow-sm lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-pink-100 bg-white px-5 py-4 shadow-soft lg:hidden">
          <div className="mx-auto grid max-w-6xl gap-2 text-sm font-bold text-ink/80">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-pink-50 hover:text-berry">
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
