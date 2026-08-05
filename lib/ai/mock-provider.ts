import type { RoomGlowUpAnalysis } from "@/lib/types";

export async function analyzeRoomWithMock(input: { spaceType: string; aesthetic: string; budget: string; region: string }): Promise<RoomGlowUpAnalysis> {
  const gamer = input.aesthetic.toLowerCase().includes("gaming") || input.spaceType.toLowerCase().includes("gaming");
  const cozy = input.aesthetic.toLowerCase().includes("cozy") || input.aesthetic.toLowerCase().includes("cottage");
  const kawaii = input.aesthetic.toLowerCase().includes("kawaii") || input.aesthetic.toLowerCase().includes("plushie") || input.aesthetic.toLowerCase().includes("pink");

  const recommendations = [
    {
      category: "lighting",
      title: cozy ? "Warm ambient lighting" : "Soft pink desk lamp",
      reason: "A small lighting upgrade can make the space feel calmer, cuter, and more intentional without changing the whole room.",
      priority: 1,
      suggestedColors: kawaii ? ["soft pink", "cream"] : ["warm white", "blush"],
      placementSuggestion: "Place it on a desk, shelf, or bedside surface where the light will not glare into your eyes.",
      estimatedBudgetMin: 15,
      estimatedBudgetMax: 45,
      searchTags: ["lamp", "ambient lighting", "desk light", "pink decor"],
      safetyNote: "Keep cords tidy and do not cover bulbs, vents, outlets, or heaters."
    },
    {
      category: "storage",
      title: kawaii ? "Plushie shelf or storage hammock" : "Cute storage basket",
      reason: "Vertical or soft storage keeps favorite items visible while reducing surface clutter.",
      priority: 2,
      suggestedColors: ["cream", "pastel pink", "lavender"],
      placementSuggestion: "Use open wall space or a corner that does not block windows, doors, or walkways.",
      estimatedBudgetMin: 10,
      estimatedBudgetMax: 40,
      searchTags: ["storage", "plushie storage", "basket", "shelf", "organizer"],
      safetyNote: "Mount shelves securely and avoid placing heavy items above beds or seating."
    },
    {
      category: "wall decor",
      title: gamer ? "Retro wall decor moment" : "Soft wall decor accent",
      reason: "A small wall accent creates a focal point and makes the room feel styled instead of randomly filled.",
      priority: 3,
      suggestedColors: gamer ? ["neon pink", "purple", "cyan"] : ["pink", "cream", "soft yellow"],
      placementSuggestion: "Place above a desk, shelf, or reading corner with enough empty space around it.",
      estimatedBudgetMin: 12,
      estimatedBudgetMax: 50,
      searchTags: gamer ? ["retro gaming", "pixel art", "wall decor", "gaming decor"] : ["wall decor", "kawaii decor", "poster", "room decor"],
      safetyNote: "Avoid covering vents, switches, electrical panels, or emergency access."
    },
    {
      category: "desk organization",
      title: "Cute desk organizer",
      reason: "A small organizer can make stationery, cables, and daily items easier to reach while keeping the setup photogenic.",
      priority: 4,
      suggestedColors: ["pink", "white", "clear"],
      placementSuggestion: "Put it near the main work zone while leaving enough open surface for writing or gaming.",
      estimatedBudgetMin: 8,
      estimatedBudgetMax: 35,
      searchTags: ["desk organizer", "stationery", "cable storage", "kawaii desk"],
      safetyNote: "Keep drinks and small items away from power strips and electronics."
    },
    {
      category: "cozy textile",
      title: "Cozy rug or soft mat",
      reason: "A soft textile can visually anchor the space and make a desk, bed, or gaming corner feel more complete.",
      priority: 5,
      suggestedColors: ["cream", "blush", "soft neutral"],
      placementSuggestion: "Use it in a clear floor area where it will not become a trip hazard.",
      estimatedBudgetMin: 20,
      estimatedBudgetMax: 80,
      searchTags: ["rug", "mat", "cozy decor", "room accent"],
      safetyNote: "Use a non-slip rug pad and keep doorways and walkways clear."
    }
  ];

  return {
    spaceType: input.spaceType,
    aesthetic: input.aesthetic,
    budget: input.budget,
    region: input.region,
    analysisConfidence: "medium",
    summary: `Your ${input.spaceType.toLowerCase()} already has a personal base. For a ${input.aesthetic.toLowerCase()} glow up, the best first moves are soft lighting, tidier display storage, and one clear decorative focal point.`,
    positiveFeatures: ["The space can be upgraded with small, budget-friendly pieces.", "There is room to build a cute focal area without changing everything.", "Functional items can double as decor."],
    detectedColors: kawaii ? ["soft pink", "cream", "white"] : gamer ? ["black", "purple", "cyan"] : ["neutral", "warm white", "blush"],
    detectedObjects: ["flat surfaces for decor", "storage opportunity", "wall or shelf area"],
    constraints: ["Do not block walkways, ventilation, doors, windows, outlets, or heaters.", "Avoid placing heavy decor where it could fall onto sleeping or sitting areas."],
    recommendations,
    suggestedPalette: kawaii
      ? [{ name: "Strawberry milk", hex: "#f8a7bd" }, { name: "Cream plush", hex: "#fff4e8" }, { name: "Lavender bow", hex: "#c7a7e8" }]
      : gamer
        ? [{ name: "Arcade pink", hex: "#ff4fa3" }, { name: "Pixel purple", hex: "#8d5cf6" }, { name: "Screen cyan", hex: "#35d7ff" }]
        : [{ name: "Warm cream", hex: "#f7eadb" }, { name: "Soft blush", hex: "#eeb6c4" }, { name: "Calm taupe", hex: "#b8a99a" }],
    overallTips: ["Start with lighting before buying lots of decor.", "Repeat two or three colors so the room feels intentional.", "Choose storage pieces that look cute enough to stay visible."]
  };
}
