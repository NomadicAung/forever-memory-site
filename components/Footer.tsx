import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-pink-100 bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/images/forever-memory-logo.jpg" alt="Forever Memory" width={250} height={250} className="h-24 w-24 rounded-lg object-cover" />
          <p className="mt-3 max-w-md text-sm leading-6 text-ink/70">
            Nostalgic product discovery for kawaii fans, memory lovers, retro gamers, and gift buyers.
          </p>
          <a href="mailto:forevermemory2025@gmail.com" className="mt-3 inline-block text-sm font-semibold text-berry">
            forevermemory2025@gmail.com
          </a>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/70">
            <Link href="/gift-guides">Gift Guides</Link>
            <Link href="/product-reviews">Product Reviews</Link>
            <Link href="/comparison-articles">Comparison Articles</Link>
            <Link href="/blog">Memory Articles</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Site</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/70">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Social</p>
          <div className="mt-3 grid gap-2 text-sm text-ink/70">
            <a href="https://www.facebook.com/formemo/" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.pinterest.com/forevermemory0051/" target="_blank" rel="noreferrer">Pinterest</a>
            <a href="https://www.tiktok.com/@forever.memory4" target="_blank" rel="noreferrer">TikTok</a>
            <a href="https://www.youtube.com/@ForeverMemorychannel" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
