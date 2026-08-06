import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is missing. Add it to .env.local first.`);
  return value;
}

function unique(values, limit = 10) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const clean = String(value || "").trim();
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(clean);
    if (output.length >= limit) break;
  }
  return output;
}

function hasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function productText(product) {
  return [
    product.name,
    product.category,
    product.brand,
    product.short_description,
    product.long_description,
    product.best_for,
    ...(product.tags || []),
    ...(product.pros || []),
    ...(product.affiliate_links || []).map((link) => `${link.store} ${link.label} ${link.url}`)
  ]
    .join(" ")
    .toLowerCase();
}

function inferAestheticTags(product, text) {
  const tags = [];

  if (product.category === "kawaii") tags.push("Kawaii Pastel", "Cozy Pink");
  if (product.category === "nostalgia") tags.push("Cute Retro", "Cozy Neutral");
  if (product.category === "retro-gaming") tags.push("Nostalgic Gaming", "Pastel Gamer");

  if (hasAny(text, ["plush", "plushie", "stuffed", "sanrio", "hello kitty", "my melody", "kuromi"])) tags.push("Plushie Paradise", "Kawaii Pastel");
  if (hasAny(text, ["pink", "heart", "bow", "cute", "kawaii", "pastel"])) tags.push("Kawaii Pastel", "Cozy Pink");
  if (hasAny(text, ["lamp", "light", "night light", "warm", "cozy"])) tags.push("Cozy Pink", "Cozy Neutral");
  if (hasAny(text, ["retro", "vintage", "nostalgia", "cassette", "walkman", "camera", "telephone", "90s", "80s"])) tags.push("Cute Retro");
  if (hasAny(text, ["game", "gaming", "console", "controller", "pixel", "arcade", "nintendo", "sega", "gameboy"])) tags.push("Nostalgic Gaming", "Pastel Gamer");
  if (hasAny(text, ["cottage", "floral", "flower", "soft", "lace"])) tags.push("Sweet Cottage");
  if (hasAny(text, ["minimal", "neutral", "white", "simple", "clean"])) tags.push("Soft Minimal", "Cozy Neutral");

  return unique(tags, 6);
}

function inferRoomTypeTags(product, text) {
  const tags = [];

  if (product.category === "kawaii") tags.push("Bedroom", "Dorm room", "Desk setup");
  if (product.category === "nostalgia") tags.push("Bedroom", "Reading nook", "Small apartment corner");
  if (product.category === "retro-gaming") tags.push("Gaming corner", "Desk setup");

  if (hasAny(text, ["desk", "stationery", "pen", "organizer", "keyboard", "mouse", "monitor"])) tags.push("Desk setup", "Dorm room");
  if (hasAny(text, ["game", "gaming", "console", "controller", "arcade", "nintendo", "sega", "gameboy"])) tags.push("Gaming corner", "Desk setup");
  if (hasAny(text, ["plush", "plushie", "stuffed", "doll", "toy"])) tags.push("Plushie display", "Bedroom", "Dorm room");
  if (hasAny(text, ["book", "reading", "lamp", "light", "blanket", "cushion", "pillow"])) tags.push("Reading nook", "Bedroom");
  if (hasAny(text, ["wall", "poster", "print", "decor", "shelf", "display"])) tags.push("Bedroom", "Dorm room", "Small apartment corner");
  if (hasAny(text, ["storage", "basket", "organizer", "tray", "holder", "rack"])) tags.push("Desk setup", "Dorm room", "Small apartment corner");
  if (hasAny(text, ["bed", "bedside", "nightstand", "room"])) tags.push("Bedroom");

  return unique(tags, 6);
}

function inferColorTags(product, text) {
  const colors = [];
  const colorWords = [
    "pink",
    "purple",
    "lavender",
    "blue",
    "cyan",
    "white",
    "cream",
    "yellow",
    "gold",
    "black",
    "green",
    "red",
    "brown",
    "clear",
    "pastel",
    "neutral"
  ];

  for (const color of colorWords) {
    if (text.includes(color)) colors.push(color);
  }

  if (product.category === "kawaii") colors.push("pink", "cream", "pastel");
  if (product.category === "nostalgia") colors.push("cream", "pink", "gold");
  if (product.category === "retro-gaming") colors.push("purple", "pink", "cyan", "black");

  return unique(colors, 8);
}

function inferShippingRegions(product, text) {
  const current = product.shipping_regions || [];
  if (current.length) return current;
  if (text.includes("amazon") || text.includes("amzn.to")) return ["United States", "Worldwide"];
  return ["Worldwide"];
}

function inferAffiliateNetwork(product) {
  const firstLink = product.affiliate_links?.[0];
  const text = `${firstLink?.store || ""} ${firstLink?.url || ""}`.toLowerCase();
  if (text.includes("amazon") || text.includes("amzn.to")) return "Amazon";
  if (text.includes("etsy")) return "Etsy";
  if (text.includes("ebay")) return "eBay";
  if (text.includes("aliexpress")) return "AliExpress";
  return firstLink?.store || product.affiliate_network || "Other";
}

function inferPriority(product, text) {
  let score = product.featured ? 10 : 5;
  if (hasAny(text, ["lamp", "light", "storage", "organizer", "shelf", "wall", "plush", "gaming", "controller"])) score += 2;
  if (product.status === "published") score += 1;
  return Math.min(score, 10);
}

function choose(existing, inferred, overwrite) {
  if (overwrite) return inferred;
  return Array.isArray(existing) && existing.length ? existing : inferred;
}

function matchingPatch(product, overwrite) {
  const text = productText(product);
  return {
    aesthetic_tags: choose(product.aesthetic_tags, inferAestheticTags(product, text), overwrite),
    room_type_tags: choose(product.room_type_tags, inferRoomTypeTags(product, text), overwrite),
    color_tags: choose(product.color_tags, inferColorTags(product, text), overwrite),
    shipping_regions: choose(product.shipping_regions, inferShippingRegions(product, text), overwrite),
    room_glow_up_enabled: overwrite || product.room_glow_up_enabled === null || product.room_glow_up_enabled === undefined ? true : product.room_glow_up_enabled,
    availability: overwrite || !product.availability ? "active" : product.availability,
    affiliate_network: overwrite || !product.affiliate_network ? inferAffiliateNetwork(product) : product.affiliate_network,
    editorial_priority: overwrite || !product.editorial_priority ? inferPriority(product, text) : product.editorial_priority,
    last_verified_at: new Date().toISOString()
  };
}

function changed(product, patch) {
  return Object.entries(patch).some(([key, value]) => JSON.stringify(product[key] ?? null) !== JSON.stringify(value ?? null));
}

async function supabaseFetch(supabaseUrl, serviceRoleKey, path, options = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed (${response.status}).`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}

async function main() {
  loadLocalEnv();

  const apply = process.argv.includes("--apply");
  const overwrite = process.argv.includes("--overwrite");
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const select = [
    "status",
    "name",
    "slug",
    "category",
    "brand",
    "short_description",
    "long_description",
    "affiliate_links",
    "featured",
    "tags",
    "pros",
    "best_for",
    "aesthetic_tags",
    "room_type_tags",
    "color_tags",
    "shipping_regions",
    "room_glow_up_enabled",
    "availability",
    "affiliate_network",
    "editorial_priority"
  ].join(",");

  const products = await supabaseFetch(supabaseUrl, serviceRoleKey, `/rest/v1/products?select=${select}&order=created_at.desc`);
  const updates = products
    .map((product) => ({ product, patch: matchingPatch(product, overwrite) }))
    .filter(({ product, patch }) => changed(product, patch));

  console.log(`Checked ${products.length} products. ${updates.length} need matching updates.`);

  for (const { product, patch } of updates) {
    console.log(`\n${apply ? "Updating" : "Preview"}: ${product.name}`);
    console.log(`  aesthetic: ${patch.aesthetic_tags.join(", ")}`);
    console.log(`  rooms: ${patch.room_type_tags.join(", ")}`);
    console.log(`  colors: ${patch.color_tags.join(", ")}`);
    console.log(`  regions: ${patch.shipping_regions.join(", ")}`);
    console.log(`  network: ${patch.affiliate_network}; priority: ${patch.editorial_priority}`);

    if (apply) {
      await supabaseFetch(supabaseUrl, serviceRoleKey, `/rest/v1/products?slug=eq.${encodeURIComponent(product.slug)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify(patch)
      });
    }
  }

  if (!apply) {
    console.log("\nDry run only. Run again with --apply to update Supabase.");
    console.log("Use --overwrite too if you want to replace existing matching fields.");
  } else {
    console.log("\nRoom Glow Up matching fields updated.");
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
