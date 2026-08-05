import type { RoomGlowUpAnalysis, RoomGlowUpRecommendation } from "@/lib/types";
import { aestheticOptions, budgetOptions, regionOptions, spaceTypes } from "./options";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const confidenceValues = new Set(["low", "medium", "high"]);
const hexPattern = /^#[0-9a-f]{6}$/i;

export function validateRoomImage(file: File, maxMb = 5) {
  if (!allowedTypes.has(file.type)) return "Use a JPG, PNG, or WebP image.";
  if (file.size > maxMb * 1024 * 1024) return `Use an image up to ${maxMb} MB.`;
  if (file.size < 1024) return "The uploaded image looks too small.";
  return "";
}

export function validateRoomRequest(input: { spaceType: string; aesthetic: string; budget: string; region: string; consent: string }) {
  if (!spaceTypes.includes(input.spaceType as never)) return "Choose a valid space type.";
  if (!aestheticOptions.includes(input.aesthetic as never)) return "Choose a valid aesthetic.";
  if (!budgetOptions.includes(input.budget as never)) return "Choose a valid budget.";
  if (!regionOptions.includes(input.region as never)) return "Choose a valid shopping region.";
  if (input.consent !== "yes") return "Please confirm the privacy notice before uploading.";
  return "";
}

function stringList(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
}

function cleanRecommendation(value: unknown, index: number): RoomGlowUpRecommendation {
  const item = typeof value === "object" && value ? value as Record<string, unknown> : {};
  return {
    category: String(item.category || "decor").slice(0, 80),
    title: String(item.title || `Room idea ${index + 1}`).slice(0, 120),
    reason: String(item.reason || "This can make the space feel more intentional and cozy.").slice(0, 500),
    priority: Math.max(1, Math.min(8, Number(item.priority || index + 1))),
    suggestedColors: stringList(item.suggestedColors, []),
    placementSuggestion: String(item.placementSuggestion || "Place where it improves comfort without blocking walkways.").slice(0, 400),
    estimatedBudgetMin: Math.max(0, Number(item.estimatedBudgetMin || 0)),
    estimatedBudgetMax: Math.max(0, Number(item.estimatedBudgetMax || 50)),
    searchTags: stringList(item.searchTags, ["decor"]),
    safetyNote: String(item.safetyNote || "Keep walkways, outlets, vents, doors, and windows clear.").slice(0, 300)
  };
}

export function validateAnalysis(raw: unknown, defaults: { spaceType: string; aesthetic: string; budget: string; region: string }): RoomGlowUpAnalysis {
  const input = typeof raw === "object" && raw ? raw as Record<string, unknown> : {};
  const recommendations = stringList(input.recommendations).length
    ? []
    : (Array.isArray(input.recommendations) ? input.recommendations : []).slice(0, 8).map(cleanRecommendation);
  const cleanedRecommendations = recommendations.length
    ? recommendations
    : (Array.isArray(input.recommendations) ? input.recommendations : []).slice(0, 8).map(cleanRecommendation);

  return {
    spaceType: String(input.spaceType || defaults.spaceType),
    aesthetic: defaults.aesthetic,
    budget: defaults.budget,
    region: defaults.region,
    analysisConfidence: confidenceValues.has(String(input.analysisConfidence)) ? input.analysisConfidence as RoomGlowUpAnalysis["analysisConfidence"] : "medium",
    summary: String(input.summary || "Your room has a cozy foundation and a few easy opportunities for a cute refresh.").slice(0, 700),
    positiveFeatures: stringList(input.positiveFeatures, ["The space already has a personal feel."]),
    detectedColors: stringList(input.detectedColors, ["soft neutral", "warm pink"]),
    detectedObjects: stringList(input.detectedObjects, ["desk or shelf area", "decor surface"]),
    constraints: stringList(input.constraints, ["Keep walkways and ventilation clear."]),
    recommendations: cleanedRecommendations.slice(0, 8),
    suggestedPalette: (Array.isArray(input.suggestedPalette) ? input.suggestedPalette : [])
      .map((item) => {
        const color = typeof item === "object" && item ? item as Record<string, unknown> : {};
        return { name: String(color.name || "Soft accent").slice(0, 60), hex: hexPattern.test(String(color.hex)) ? String(color.hex) : "#f8a7bd" };
      })
      .slice(0, 6),
    overallTips: stringList(input.overallTips, ["Start with one small lighting or storage upgrade, then add decorative details."])
  };
}
