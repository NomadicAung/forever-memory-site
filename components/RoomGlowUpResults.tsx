import Link from "next/link";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { DeleteRoomGlowUpButton } from "@/components/DeleteRoomGlowUpButton";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import type { RoomGlowUpAnalysis, RoomGlowUpProductMatch } from "@/lib/types";

export function RoomGlowUpResults({ analysis, matches }: { analysis: RoomGlowUpAnalysis; matches: RoomGlowUpProductMatch[] }) {
  const matchMap = new Map(matches.map((match) => [match.recommendationTitle, match.products]));

  return (
    <main className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/room-glow-up" className="rounded-full border border-pink-200 px-4 py-2 text-sm font-bold">New glow up</Link>
        {analysis.id && <DeleteRoomGlowUpButton id={analysis.id} />}
      </div>
      <section className="mt-6 rounded-lg bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-berry">{analysis.spaceType} - {analysis.aesthetic}</p>
        <h1 className="mt-2 text-4xl font-black">Your Room Glow Up Plan</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/70">{analysis.summary}</p>
        <div className="mt-5"><AffiliateDisclosure /></div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Positive features</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.positiveFeatures.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Visible details</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.detectedObjects.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Suggested palette</h2>
          <div className="mt-3 grid gap-2">
            {analysis.suggestedPalette.map((color) => (
              <div key={`${color.name}-${color.hex}`} className="flex items-center gap-3 text-sm font-semibold">
                <span className="h-8 w-8 rounded-full border border-pink-100" style={{ backgroundColor: color.hex }} />
                {color.name} <span className="text-ink/50">{color.hex}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-5">
        {analysis.recommendations.map((recommendation) => {
          const products = matchMap.get(recommendation.title) || [];
          return (
            <article key={recommendation.title} className="rounded-lg bg-white p-6 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-berry">Priority {recommendation.priority} - {recommendation.category}</p>
                  <h2 className="mt-1 text-2xl font-black">{recommendation.title}</h2>
                </div>
                <span className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold">{recommendation.estimatedBudgetMin}-{recommendation.estimatedBudgetMax} USD</span>
              </div>
              <p className="mt-3 leading-7 text-ink/70">{recommendation.reason}</p>
              <p className="mt-3 text-sm font-semibold text-ink/70">{recommendation.placementSuggestion}</p>
              <p className="mt-2 text-sm text-ink/60">{recommendation.safetyNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {recommendation.searchTags.map((tag) => <span key={tag} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-berry">{tag}</span>)}
              </div>
              {products.length > 0 && (
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {products.map((product) => {
                    const primary = product.affiliateLinks[0];
                    return (
                      <div key={product.slug} className="rounded-lg border border-pink-100 p-4">
                        <Link href={`/products/${product.slug}`} className="font-bold hover:text-berry">{product.name}</Link>
                        <p className="mt-2 text-sm text-ink/60">View current price at retailer.</p>
                        {primary && (
                          <TrackedAffiliateLink href={primary.url} store={primary.store} productSlug={product.slug} productName={product.name} className="mt-3 inline-block rounded-full bg-berry px-4 py-2 text-sm font-bold text-white">
                            {primary.label}
                          </TrackedAffiliateLink>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </article>
          );
        })}
      </section>
      <section className="mt-8 rounded-lg bg-white p-5 shadow-soft">
        <h2 className="font-bold">Overall tips</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.overallTips.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </main>
  );
}
