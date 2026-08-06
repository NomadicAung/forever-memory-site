import type { RoomGlowUpAnalysis, RoomGlowUpRecommendation } from "@/lib/types";

type MockInput = {
  spaceType: string;
  aesthetic: string;
  budget: string;
  region: string;
};

type RecommendationDraft = Omit<RoomGlowUpRecommendation, "priority" | "estimatedBudgetMin" | "estimatedBudgetMax"> & {
  budgetBand: [number, number];
};

const roomIdeas: Record<string, RecommendationDraft> = {
  "Bedroom": {
    category: "bedside styling",
    title: "Cozy bedside memory corner",
    reason: "A small bedside refresh makes the room feel softer without needing to change big furniture.",
    suggestedColors: ["blush pink", "cream", "warm white"],
    placementSuggestion: "Style one bedside surface with a small lamp, tray, and one cute personal item.",
    budgetBand: [12, 45],
    searchTags: ["bedroom decor", "bedside lamp", "kawaii tray", "cozy room"],
    safetyNote: "Keep cords away from blankets and leave enough surface space for daily essentials."
  },
  "Desk setup": {
    category: "desk organization",
    title: "Cute focus desk setup",
    reason: "A tidy desk with one clear color theme feels more intentional and makes work or study time nicer.",
    suggestedColors: ["pastel pink", "white", "clear"],
    placementSuggestion: "Add one organizer near your writing area and keep the center of the desk open.",
    budgetBand: [8, 35],
    searchTags: ["desk organizer", "kawaii desk", "stationery storage", "desk lamp"],
    safetyNote: "Keep drinks and loose decor away from chargers, outlets, and electronics."
  },
  "Gaming corner": {
    category: "gaming display",
    title: "Retro display zone",
    reason: "A focused shelf or wall moment can turn controllers, games, and collectibles into the main feature.",
    suggestedColors: ["neon pink", "purple", "cyan"],
    placementSuggestion: "Use the wall or shelf behind the setup for display pieces and keep the play area clear.",
    budgetBand: [15, 60],
    searchTags: ["retro gaming decor", "pixel art", "controller stand", "gaming shelf"],
    safetyNote: "Leave console vents open and avoid stacking decor on warm electronics."
  },
  "Reading nook": {
    category: "cozy reading",
    title: "Soft reading nook layer",
    reason: "A small light and textile layer can make the corner feel like a calm mini escape.",
    suggestedColors: ["cream", "warm yellow", "soft pink"],
    placementSuggestion: "Place a warm light near the seat and add one soft textile within reach.",
    budgetBand: [15, 55],
    searchTags: ["reading lamp", "cozy blanket", "book nook", "soft decor"],
    safetyNote: "Keep fabric away from hot bulbs and make sure the walking path stays clear."
  },
  "Plushie display": {
    category: "plushie storage",
    title: "Plushie display upgrade",
    reason: "Visible storage keeps favorite plushies cute and organized instead of scattered.",
    suggestedColors: ["strawberry pink", "cream", "lavender"],
    placementSuggestion: "Use vertical wall space, a shelf, or a soft basket where plushies can be seen.",
    budgetBand: [10, 45],
    searchTags: ["plushie storage", "plush shelf", "kawaii basket", "toy hammock"],
    safetyNote: "Mount wall storage securely and avoid placing heavy items above sleeping areas."
  },
  "Dorm room": {
    category: "small-space storage",
    title: "Dorm-friendly cute storage",
    reason: "Portable storage and removable decor make a dorm feel personal without permanent changes.",
    suggestedColors: ["pink", "white", "soft neutral"],
    placementSuggestion: "Use a compact organizer, removable wall accent, or bedside caddy.",
    budgetBand: [8, 40],
    searchTags: ["dorm decor", "small space organizer", "removable wall decor", "bedside caddy"],
    safetyNote: "Follow dorm rules and do not cover sprinklers, vents, outlets, or exits."
  },
  "Small apartment corner": {
    category: "corner styling",
    title: "Tiny corner glow up",
    reason: "One corner can become a cute photo-ready zone with lighting, storage, and a small accent.",
    suggestedColors: ["cream", "blush", "warm neutral"],
    placementSuggestion: "Choose one corner and repeat the same two colors across decor pieces.",
    budgetBand: [15, 65],
    searchTags: ["apartment decor", "corner shelf", "small space lamp", "cute storage"],
    safetyNote: "Keep doors, windows, heaters, and walkways fully clear."
  },
  "Other indoor space": {
    category: "decor refresh",
    title: "Simple room refresh starter",
    reason: "A small matching set of decor pieces can make almost any indoor space feel more complete.",
    suggestedColors: ["soft pink", "cream", "warm white"],
    placementSuggestion: "Pick one surface or wall area and style it as the main focal point.",
    budgetBand: [10, 50],
    searchTags: ["room decor", "cute storage", "ambient lamp", "wall accent"],
    safetyNote: "Avoid blocking vents, outlets, switches, doors, windows, or walkways."
  }
};

const aestheticIdeas: Record<string, RecommendationDraft> = {
  "Kawaii Pastel": {
    category: "kawaii decor",
    title: "Pastel kawaii focal piece",
    reason: "A single adorable focal piece gives the space personality without making it feel busy.",
    suggestedColors: ["strawberry milk", "cream", "lavender"],
    placementSuggestion: "Place it where the eye naturally lands first, like above a desk, shelf, or bedside area.",
    budgetBand: [12, 50],
    searchTags: ["kawaii decor", "pastel room", "cute wall decor", "pink lamp"],
    safetyNote: "Use lightweight wall decor and secure anything placed above a bed or seat."
  },
  "Cozy Pink": {
    category: "soft lighting",
    title: "Warm pink lighting layer",
    reason: "Pink-toned ambient light creates an instant cozy mood and works with many existing rooms.",
    suggestedColors: ["rose pink", "warm white", "cream"],
    placementSuggestion: "Use one lamp or soft light strip away from direct eye glare.",
    budgetBand: [10, 45],
    searchTags: ["pink lamp", "ambient lighting", "cozy room", "cute night light"],
    safetyNote: "Do not cover bulbs or run cords under rugs."
  },
  "Soft Minimal": {
    category: "minimal storage",
    title: "Clean cute organizer set",
    reason: "Soft minimal rooms look best when the useful pieces also match the room palette.",
    suggestedColors: ["white", "clear", "soft beige"],
    placementSuggestion: "Group small daily items into one organizer so empty space stays visible.",
    budgetBand: [8, 35],
    searchTags: ["minimal organizer", "white storage", "desk tray", "small room storage"],
    safetyNote: "Keep frequently used items reachable so the setup stays practical."
  },
  "Cute Retro": {
    category: "nostalgia accent",
    title: "Retro memory accent",
    reason: "One nostalgic object or print can add charm without making the room look cluttered.",
    suggestedColors: ["coral pink", "cream", "muted yellow"],
    placementSuggestion: "Style it beside books, a lamp, or a framed photo area.",
    budgetBand: [10, 45],
    searchTags: ["nostalgia decor", "retro wall art", "vintage style decor", "cute clock"],
    safetyNote: "Avoid old electronics unless they are tested and safe for use."
  },
  "Nostalgic Gaming": {
    category: "retro gaming",
    title: "Old-school gaming accent",
    reason: "A small gaming accent makes the setup feel intentional even before adding bigger collectibles.",
    suggestedColors: ["purple", "hot pink", "screen blue"],
    placementSuggestion: "Place the accent near the gaming area, controller stand, or media shelf.",
    budgetBand: [12, 55],
    searchTags: ["retro gaming", "pixel decor", "game room decor", "controller stand"],
    safetyNote: "Keep airflow around consoles and do not overload power strips."
  },
  "Sweet Cottage": {
    category: "soft textile",
    title: "Sweet cottage texture layer",
    reason: "A gentle fabric texture adds warmth and makes modern furniture feel softer.",
    suggestedColors: ["cream", "dusty pink", "soft green"],
    placementSuggestion: "Use one cushion, mat, or small textile near the main seating or bed area.",
    budgetBand: [12, 50],
    searchTags: ["cottage decor", "floral cushion", "soft rug", "cozy textile"],
    safetyNote: "Use non-slip backing for rugs and keep fabric away from heaters."
  },
  "Cozy Neutral": {
    category: "warm accent",
    title: "Warm neutral comfort layer",
    reason: "A neutral comfort piece helps the space feel calmer while still matching cute decor later.",
    suggestedColors: ["cream", "taupe", "warm white"],
    placementSuggestion: "Add it to the largest empty surface or seating area for a soft visual anchor.",
    budgetBand: [15, 60],
    searchTags: ["cozy neutral decor", "cream lamp", "soft basket", "warm room"],
    safetyNote: "Choose stable pieces that do not crowd narrow walking areas."
  },
  "Pastel Gamer": {
    category: "pastel gaming",
    title: "Pastel gamer setup piece",
    reason: "Pastel gaming decor balances playful color with a cleaner setup look.",
    suggestedColors: ["lavender", "pink", "cyan"],
    placementSuggestion: "Use one pastel organizer, controller holder, or light near the gaming setup.",
    budgetBand: [12, 55],
    searchTags: ["pastel gamer", "pink gaming setup", "controller holder", "gaming light"],
    safetyNote: "Keep cables tidy and avoid covering console or PC vents."
  },
  "Plushie Paradise": {
    category: "plushie styling",
    title: "Plushie family display",
    reason: "A dedicated plushie zone makes the collection feel styled instead of messy.",
    suggestedColors: ["pink", "cream", "baby blue"],
    placementSuggestion: "Group plushies by color or size on one shelf, basket, or corner.",
    budgetBand: [10, 45],
    searchTags: ["plushie display", "kawaii plush", "toy storage", "cute shelf"],
    safetyNote: "Avoid placing plushies near candles, heaters, or hot electronics."
  },
  "Surprise Me": {
    category: "surprise accent",
    title: "Cute surprise statement",
    reason: "A playful accent can refresh the room quickly while keeping the overall setup flexible.",
    suggestedColors: ["pink", "cream", "lavender"],
    placementSuggestion: "Choose one item that feels fun and repeat one of its colors elsewhere in the room.",
    budgetBand: [10, 45],
    searchTags: ["cute decor", "kawaii room", "nostalgia decor", "room accent"],
    safetyNote: "Make sure the accent is lightweight, stable, and easy to clean around."
  }
};

const budgetIdeas: Record<string, RecommendationDraft> = {
  "Under 25 USD": {
    category: "budget starter",
    title: "Under-$25 mini refresh",
    reason: "Small swaps like a tray, poster, light, or organizer can make the room feel new without a big spend.",
    suggestedColors: ["pink", "white", "cream"],
    placementSuggestion: "Buy one piece first and place it in the most visible daily-use area.",
    budgetBand: [5, 25],
    searchTags: ["cheap room decor", "under 25 decor", "cute organizer", "small gift"],
    safetyNote: "Choose practical pieces that will not add clutter or block daily movement."
  },
  "25 to 50 USD": {
    category: "value upgrade",
    title: "$25-$50 high-impact upgrade",
    reason: "This budget is perfect for one visible piece, such as lighting, display storage, or wall decor.",
    suggestedColors: ["soft pink", "cream", "lavender"],
    placementSuggestion: "Choose the item that improves the largest visible area first.",
    budgetBand: [25, 50],
    searchTags: ["room upgrade", "cute lamp", "display shelf", "kawaii wall decor"],
    safetyNote: "Check measurements and placement before buying."
  },
  "50 to 100 USD": {
    category: "room bundle",
    title: "$50-$100 matching mini bundle",
    reason: "A small bundle with matching colors feels more polished than several random pieces.",
    suggestedColors: ["pink", "cream", "warm white"],
    placementSuggestion: "Pair one useful item with one decorative accent in the same color family.",
    budgetBand: [50, 100],
    searchTags: ["room decor bundle", "lamp and organizer", "cute room set", "matching decor"],
    safetyNote: "Avoid overbuying; leave empty space so the room still feels calm."
  },
  "100 to 200 USD": {
    category: "bigger glow up",
    title: "$100-$200 full corner makeover",
    reason: "This range can refresh a whole corner with lighting, storage, and one signature decor piece.",
    suggestedColors: ["statement pink", "cream", "accent purple"],
    placementSuggestion: "Plan one corner first, then buy pieces that support the same theme.",
    budgetBand: [100, 200],
    searchTags: ["room makeover", "corner shelf", "ambient lighting", "kawaii decor set"],
    safetyNote: "Anchor furniture or shelves correctly and keep exits and windows clear."
  },
  "Flexible": {
    category: "best value plan",
    title: "Flexible staged glow up",
    reason: "A staged plan lets you start with the most useful item, then add decor without wasting money.",
    suggestedColors: ["pink", "cream", "signature accent"],
    placementSuggestion: "Start with lighting or storage, then add wall decor after the room feels organized.",
    budgetBand: [20, 120],
    searchTags: ["room glow up", "cute storage", "ambient lamp", "decor plan"],
    safetyNote: "Buy slowly and test placement before adding more pieces."
  }
};

const palettes = {
  kawaii: [{ name: "Strawberry milk", hex: "#f8a7bd" }, { name: "Cream plush", hex: "#fff4e8" }, { name: "Lavender bow", hex: "#c7a7e8" }],
  gaming: [{ name: "Arcade pink", hex: "#ff4fa3" }, { name: "Pixel purple", hex: "#8d5cf6" }, { name: "Screen cyan", hex: "#35d7ff" }],
  retro: [{ name: "Carnival blush", hex: "#ec8f9d" }, { name: "Old photo cream", hex: "#f7eadb" }, { name: "Memory gold", hex: "#d6a84f" }],
  neutral: [{ name: "Warm cream", hex: "#f7eadb" }, { name: "Soft blush", hex: "#eeb6c4" }, { name: "Calm taupe", hex: "#b8a99a" }]
};

const themeDetails = {
  kawaii: {
    accent: "kawaii",
    colors: ["soft pink", "cream", "lavender"],
    tags: ["kawaii room", "pastel decor", "cute storage", "pink room"]
  },
  gaming: {
    accent: "retro gaming",
    colors: ["purple", "hot pink", "cyan"],
    tags: ["retro gaming", "gaming setup", "pixel decor", "controller storage"]
  },
  retro: {
    accent: "nostalgic",
    colors: ["cream", "coral pink", "memory gold"],
    tags: ["nostalgia decor", "retro room", "vintage style decor", "memory display"]
  },
  neutral: {
    accent: "cozy",
    colors: ["warm cream", "soft blush", "taupe"],
    tags: ["cozy decor", "neutral room", "small room storage", "warm lighting"]
  }
};

function withPriority(item: RecommendationDraft, priority: number): RoomGlowUpRecommendation {
  return {
    ...item,
    priority,
    estimatedBudgetMin: item.budgetBand[0],
    estimatedBudgetMax: item.budgetBand[1]
  };
}

function theme(input: MockInput) {
  const label = `${input.spaceType} ${input.aesthetic}`.toLowerCase();
  if (label.includes("gaming") || label.includes("gamer")) return "gaming";
  if (label.includes("retro") || label.includes("nostalg")) return "retro";
  if (label.includes("kawaii") || label.includes("pink") || label.includes("plushie")) return "kawaii";
  return "neutral";
}

function budgetScale(input: MockInput): [number, number] {
  if (input.budget.includes("Under 25")) return [5, 25];
  if (input.budget.includes("25 to 50")) return [15, 50];
  if (input.budget.includes("50 to 100")) return [25, 100];
  if (input.budget.includes("100 to 200")) return [40, 200];
  return [15, 120];
}

function extraIdeas(input: MockInput, selectedTheme: keyof typeof themeDetails): RecommendationDraft[] {
  const details = themeDetails[selectedTheme];
  const [min, max] = budgetScale(input);
  const room = input.spaceType.toLowerCase();
  const aesthetic = input.aesthetic.toLowerCase();

  return [
    {
      category: "ambient mood",
      title: `${details.accent} mood lighting pass`,
      reason: `Lighting is usually the fastest way to make a ${room} feel closer to a ${aesthetic} style without moving furniture.`,
      suggestedColors: details.colors,
      placementSuggestion: "Add one soft light source near the main focal area, then keep the brightest work light separate.",
      budgetBand: [min, Math.min(max, 60)],
      searchTags: ["ambient lighting", "cute lamp", ...details.tags].slice(0, 8),
      safetyNote: "Keep lamps and light strips away from fabric, water, vents, and overloaded outlets."
    },
    {
      category: "display styling",
      title: `${details.accent} display shelf moment`,
      reason: `A small display area helps the ${room} show personality while keeping favorite items easy to see.`,
      suggestedColors: details.colors,
      placementSuggestion: "Group three to five small items together instead of spreading them across the whole room.",
      budgetBand: [min, Math.min(max, 75)],
      searchTags: ["display shelf", "wall decor", ...details.tags].slice(0, 8),
      safetyNote: "Secure shelves properly and avoid placing heavy items above beds, seats, or desks."
    },
    {
      category: "daily storage",
      title: `${details.accent} clutter-control piece`,
      reason: `One cute storage piece keeps daily items contained so the ${aesthetic} theme feels calm instead of crowded.`,
      suggestedColors: details.colors,
      placementSuggestion: "Place it where clutter naturally gathers, like beside the bed, desk, console, or reading seat.",
      budgetBand: [min, Math.min(max, 55)],
      searchTags: ["cute organizer", "storage basket", ...details.tags].slice(0, 8),
      safetyNote: "Keep storage low and stable in narrow spaces so it does not become a trip hazard."
    },
    {
      category: "wall accent",
      title: `${details.accent} wall detail`,
      reason: `A wall detail can make the ${room} feel styled even when the furniture stays the same.`,
      suggestedColors: details.colors,
      placementSuggestion: "Use the most visible blank wall or the area above the main surface as the accent zone.",
      budgetBand: [min, Math.min(max, 65)],
      searchTags: ["wall decor", "poster", "room accent", ...details.tags].slice(0, 8),
      safetyNote: "Use renter-safe hanging options when needed and avoid covering switches, vents, or electrical panels."
    },
    {
      category: "comfort layer",
      title: `${details.accent} comfort finisher`,
      reason: `A soft finishing piece makes the ${room} feel more inviting and helps the whole ${aesthetic} look feel complete.`,
      suggestedColors: details.colors,
      placementSuggestion: "Add one textile or comfort item where you sit, sleep, study, or play most often.",
      budgetBand: [min, max],
      searchTags: ["cozy textile", "cute cushion", "soft rug", ...details.tags].slice(0, 8),
      safetyNote: "Use non-slip backing for rugs and keep textiles away from heaters, candles, and hot electronics."
    }
  ];
}

export async function analyzeRoomWithMock(input: MockInput): Promise<RoomGlowUpAnalysis> {
  const selectedRoom = roomIdeas[input.spaceType] || roomIdeas["Other indoor space"];
  const selectedAesthetic = aestheticIdeas[input.aesthetic] || aestheticIdeas["Surprise Me"];
  const selectedBudget = budgetIdeas[input.budget] || budgetIdeas["Flexible"];
  const selectedTheme = theme(input);
  const recommendations = [selectedRoom, selectedAesthetic, selectedBudget, ...extraIdeas(input, selectedTheme)].map(withPriority);

  return {
    spaceType: input.spaceType,
    aesthetic: input.aesthetic,
    budget: input.budget,
    region: input.region,
    analysisConfidence: "medium",
    summary: `Here is a curated ${input.aesthetic.toLowerCase()} glow-up plan for your ${input.spaceType.toLowerCase()}. Since this is mock mode, it uses your selections instead of reading the uploaded photo, then gives you eight practical product directions to try first.`,
    positiveFeatures: [
      "The plan is simple enough to test with one or two items first.",
      "Each idea is matched to your selected room type, style, and budget.",
      `Product matching will prioritize items available for ${input.region}.`
    ],
    detectedColors: selectedTheme === "gaming" ? ["purple", "hot pink", "cyan"] : selectedTheme === "retro" ? ["cream", "coral pink", "memory gold"] : selectedTheme === "kawaii" ? ["soft pink", "cream", "lavender"] : ["warm neutral", "cream", "soft blush"],
    detectedObjects: [selectedRoom.category, selectedAesthetic.category, "main styling area"],
    constraints: [
      "Mock mode does not inspect the uploaded image, so check fit and measurements yourself.",
      "Keep walkways, ventilation, doors, windows, heaters, outlets, and switches clear."
    ],
    recommendations,
    suggestedPalette: palettes[selectedTheme],
    overallTips: [
      "Start with the first recommendation before buying a full room set.",
      "Repeat two or three colors so the room feels intentional.",
      "Use product notes and tags in the admin panel to improve matching over time."
    ]
  };
}
