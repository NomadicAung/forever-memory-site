import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Affiliate Disclosure", description: "Forever Memory affiliate disclosure.", path: "/affiliate-disclosure" });

export default function AffiliateDisclosurePage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-black">Affiliate Disclosure</h1>
      <p className="mt-5 leading-8 text-ink/70">
        Forever Memory participates in affiliate programs. This means we may earn a commission when you click a link and
        make a purchase. Affiliate links use rel="sponsored nofollow" and do not change your purchase price.
      </p>
      <p className="mt-4 leading-8 text-ink/70">
        Product availability, price, shipping, and return policies are controlled by each store. Always review store
        details before buying.
      </p>
    </main>
  );
}
