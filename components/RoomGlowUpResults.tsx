import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Lightbulb, Palette, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { AffiliateDisclosure } from "@/components/AffiliateDisclosure";
import { DeleteRoomGlowUpButton } from "@/components/DeleteRoomGlowUpButton";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import type { RoomGlowUpAnalysis, RoomGlowUpProductMatch } from "@/lib/types";

export function RoomGlowUpResults({ analysis, matches }: { analysis: RoomGlowUpAnalysis; matches: RoomGlowUpProductMatch[] }) {
  const matchMap = new Map(matches.map((match) => [match.recommendationTitle, match.products]));
  const matchedCount = matches.reduce((total, match) => total + match.products.length, 0);
  const topRecommendations = analysis.recommendations.slice(0, 3);

  return (
    <main className="container py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/room-glow-up" className="rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-bold shadow-sm">New glow up</Link>
        {analysis.id && <DeleteRoomGlowUpButton id={analysis.id} />}
      </div>
      <section className="mt-6 overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px] lg:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-berry">
              <Sparkles size={16} /> {analysis.spaceType} - {analysis.aesthetic}
            </p>
            <h1 className="mt-4 text-4xl font-black md:text-6xl">Your Room Glow Up Plan</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/70">{analysis.summary}</p>
            <div className="mt-5"><AffiliateDisclosure /></div>
          </div>
          <div className="grid content-start gap-3 rounded-lg border border-pink-100 bg-pink-50 p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-white p-3">
                <p className="text-2xl font-black">{analysis.recommendations.length}</p>
                <p className="text-xs font-bold uppercase text-ink/50">Ideas</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-2xl font-black">{matchedCount}</p>
                <p className="text-xs font-bold uppercase text-ink/50">Matches</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <p className="text-2xl font-black capitalize">{analysis.analysisConfidence}</p>
                <p className="text-xs font-bold uppercase text-ink/50">Confidence</p>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <h2 className="flex items-center gap-2 font-bold"><Lightbulb size={18} className="text-berry" /> Start here</h2>
              <ol className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">
                {topRecommendations.map((item) => <li key={item.title}>{item.priority}. {item.title}</li>)}
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} className="text-berry" /> Positive features</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.positiveFeatures.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 font-bold"><ShoppingBag size={18} className="text-berry" /> Visible details</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.detectedObjects.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 font-bold"><Palette size={18} className="text-berry" /> Suggested palette</h2>
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
      {analysis.constraints.length > 0 && (
        <section className="mt-8 rounded-lg border border-yellow-100 bg-white p-5 shadow-soft">
          <h2 className="flex items-center gap-2 font-bold"><ShieldCheck size={18} className="text-berry" /> Room-safe constraints</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.constraints.map((item) => <span key={item} className="rounded-full bg-yellow-50 px-3 py-2 text-sm font-semibold text-ink/70">{item}</span>)}
          </div>
        </section>
      )}
      <section className="mt-8 grid gap-6">
        {analysis.recommendations.map((recommendation) => {
          const products = matchMap.get(recommendation.title) || [];
          return (
            <article key={recommendation.title} className="overflow-hidden rounded-lg bg-white shadow-soft">
              <div className="border-b border-pink-100 p-5 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-berry">Priority {recommendation.priority} - {recommendation.category}</p>
                    <h2 className="mt-1 text-2xl font-black">{recommendation.title}</h2>
                  </div>
                  <span className="rounded-full bg-pink-50 px-4 py-2 text-sm font-bold">{recommendation.estimatedBudgetMin}-{recommendation.estimatedBudgetMax} USD</span>
                </div>
                <p className="mt-3 leading-7 text-ink/70">{recommendation.reason}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-pink-50 p-4">
                    <p className="text-sm font-bold text-ink">Placement</p>
                    <p className="mt-1 text-sm leading-6 text-ink/70">{recommendation.placementSuggestion}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-bold text-ink"><AlertTriangle size={16} /> Safety note</p>
                    <p className="mt-1 text-sm leading-6 text-ink/70">{recommendation.safetyNote}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {recommendation.searchTags.map((tag) => <span key={tag} className="rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-berry">{tag}</span>)}
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <h3 className="flex items-center gap-2 font-bold"><ShoppingBag size={18} className="text-berry" /> Curated product matches</h3>
                {products.length === 0 && <p className="mt-3 text-sm leading-6 text-ink/60">No strong product match yet. Add matching tags in admin to connect this idea with catalogue items.</p>}
                {products.length > 0 && (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {products.map((product) => {
                    const primary = product.affiliateLinks[0];
                    return (
                      <div key={product.slug} className="overflow-hidden rounded-lg border border-pink-100">
                        <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] bg-pink-50">
                          <Image src={product.image} alt={product.name} fill sizes="(min-width: 768px) 25vw, 100vw" className="object-cover" />
                        </Link>
                        <div className="p-4">
                          <Link href={`/products/${product.slug}`} className="font-bold leading-tight hover:text-berry">{product.name}</Link>
                          <p className="mt-2 text-sm text-ink/60">View current price at retailer.</p>
                          {primary && (
                            <TrackedAffiliateLink href={primary.url} store={primary.store} productSlug={product.slug} productName={product.name} className="mt-3 inline-block rounded-full bg-berry px-4 py-2 text-sm font-bold text-white">
                              {primary.label}
                            </TrackedAffiliateLink>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </section>
      <section className="mt-8 rounded-lg bg-white p-5 shadow-soft">
        <h2 className="flex items-center gap-2 font-bold"><Sparkles size={18} className="text-berry" /> Overall tips</h2>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-ink/70">{analysis.overallTips.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
    </main>
  );
}
