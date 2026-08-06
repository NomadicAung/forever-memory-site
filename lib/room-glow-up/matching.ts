import type { Product, RoomGlowUpAnalysis, RoomGlowUpProductMatch, RoomGlowUpRecommendation } from "@/lib/types";
import { budgetMax } from "./options";

function words(values: Array<string | undefined>) {
  return values
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2);
}

function productText(product: Product) {
  return words([
    product.name,
    product.category,
    product.shortDescription,
    product.longDescription,
    product.bestFor,
    ...(product.tags || []),
    ...(product.aestheticTags || []),
    ...(product.roomTypeTags || []),
    ...(product.colorTags || [])
  ]);
}

function priceMax(product: Product) {
  const numbers = product.priceRange.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  return numbers.length ? Math.max(...numbers) : Number.POSITIVE_INFINITY;
}

function regionScore(product: Product, region: string) {
  const regions = product.shippingRegions || [];
  if (regions.length === 0) return 1;
  const lower = regions.map((item) => item.toLowerCase());
  if (lower.includes("worldwide")) return 3;
  return lower.includes(region.toLowerCase()) ? 4 : -4;
}

function scoreProduct(product: Product, recommendation: RoomGlowUpRecommendation, analysis: RoomGlowUpAnalysis) {
  if (product.status && product.status !== "published") return -1000;
  if (product.roomGlowUpEnabled === false) return -1000;
  if (product.availability === "unavailable") return -1000;

  const productWords = new Set(productText(product));
  const queryWords = words([
    recommendation.category,
    recommendation.title,
    recommendation.reason,
    analysis.aesthetic,
    analysis.spaceType,
    ...recommendation.searchTags,
    ...recommendation.suggestedColors,
    ...analysis.detectedColors
  ]);

  let score = 0;
  for (const word of queryWords) {
    if (productWords.has(word)) score += 2;
  }

  const aesthetic = analysis.aesthetic.toLowerCase();
  if ((product.aestheticTags || []).some((tag) => aesthetic.includes(tag.toLowerCase()) || tag.toLowerCase().includes(aesthetic.split(" ")[0]))) score += 8;
  if ((product.roomTypeTags || []).some((tag) => analysis.spaceType.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(analysis.spaceType.toLowerCase().split(" ")[0]))) score += 6;
  if ((product.colorTags || []).some((tag) => recommendation.suggestedColors.join(" ").toLowerCase().includes(tag.toLowerCase()))) score += 3;

  score += regionScore(product, analysis.region);
  score += Math.min(10, Math.max(0, product.editorialPriority || 0));
  if (product.availability === "active" || !product.availability) score += 2;
  if (product.lastVerifiedAt) score += 1;

  const maxBudget = budgetMax(analysis.budget);
  if (Number.isFinite(maxBudget) && priceMax(product) > maxBudget * 1.25) score -= 5;

  return score;
}

export function matchProductsToRecommendations(products: Product[], analysis: RoomGlowUpAnalysis): RoomGlowUpProductMatch[] {
  return analysis.recommendations.map((recommendation) => ({
    recommendationTitle: recommendation.title,
    products: products
      .map((product) => ({ product, score: scoreProduct(product, recommendation, analysis) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.product)
  }));
}
