import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const productImageBucket = "product-images";

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
  if (!value) throw new Error(`${name} is missing. Add it to .env.local or the automation environment.`);
  return value;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function toArray(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function contentTypeFor(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "application/octet-stream";
}

function normalizeProduct(input) {
  const name = String(input.name || "").trim();
  if (!name) throw new Error("Product name is required.");

  const category = String(input.category || "kawaii").trim();
  const allowedCategories = new Set(["kawaii", "nostalgia", "retro-gaming"]);
  if (!allowedCategories.has(category)) throw new Error("Category must be kawaii, nostalgia, or retro-gaming.");

  const affiliateUrl = String(input.affiliateUrl || input.affiliate_url || "").trim();
  if (!affiliateUrl) throw new Error("Affiliate URL is required.");

  const slug = slugify(input.slug || name);
  return {
    name,
    slug,
    category,
    brand: String(input.brand || "Curated Find").trim(),
    image: String(input.image || input.imageUrl || "").trim(),
    short_description: String(input.shortDescription || input.short_description || "").trim(),
    long_description: String(input.longDescription || input.long_description || "").trim(),
    price_range: String(input.priceRange || input.price_range || "Check latest price").trim(),
    affiliate_links: [
      {
        store: input.store || "Amazon",
        label: input.linkLabel || input.link_label || "View on Amazon",
        url: affiliateUrl
      }
    ],
    rating: typeof input.rating === "number" ? input.rating : null,
    pros: toArray(input.pros),
    cons: toArray(input.cons),
    best_for: String(input.bestFor || input.best_for || "").trim(),
    tags: toArray(input.tags),
    related_products: toArray(input.relatedProducts || input.related_products),
    seo_title: String(input.seoTitle || input.seo_title || `${name} Review`).trim(),
    meta_description: String(input.metaDescription || input.meta_description || "").trim(),
    featured: Boolean(input.featured),
    status: "draft",
    created_by: null
  };
}

async function ensureImageBucket(supabaseUrl, serviceRoleKey) {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };

  const check = await fetch(`${supabaseUrl}/storage/v1/bucket/${productImageBucket}`, { headers });
  if (check.ok) return;
  if (check.status !== 404) {
    const detail = await check.text();
    throw new Error(detail || `Could not check product image bucket (${check.status}).`);
  }

  const create = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id: productImageBucket, name: productImageBucket, public: true })
  });

  if (!create.ok && create.status !== 409) {
    const detail = await create.text();
    throw new Error(detail || `Could not create product image bucket (${create.status}).`);
  }
}

async function uploadImageFile(supabaseUrl, serviceRoleKey, productSlug, filePath) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) throw new Error(`Product image file not found: ${filePath}`);

  const extension = extname(absolutePath).toLowerCase() || ".png";
  const storagePath = `${productSlug}/cover${extension}`;
  const image = await readFile(absolutePath);
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${productImageBucket}/${storagePath}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": contentTypeFor(absolutePath),
      "Cache-Control": "31536000",
      "x-upsert": "true"
    },
    body: image
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Could not upload product image (${response.status}).`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${productImageBucket}/${storagePath}`;
}

async function main() {
  loadLocalEnv();

  const productPath = process.argv[2];
  if (!productPath) throw new Error("Usage: npm run upload:product-draft -- path/to/product.json");

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const raw = await readFile(resolve(process.cwd(), productPath), "utf8");
  const input = JSON.parse(raw);
  const product = normalizeProduct(input);

  const imageFile = input.imageFile || input.image_file;
  if (imageFile) {
    await ensureImageBucket(supabaseUrl, serviceRoleKey);
    product.image = await uploadImageFile(supabaseUrl, serviceRoleKey, product.slug, imageFile);
  }

  if (!product.image) {
    product.image =
      product.category === "retro-gaming"
        ? "/images/retro-gaming-finds.webp"
        : product.category === "nostalgia"
          ? "/images/nostalgia-finds.webp"
          : "/images/kawaii-finds.webp";
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/products?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(product)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase upload failed (${response.status}).`);
  }

  const [saved] = await response.json();
  console.log(`Draft uploaded: ${saved.name}`);
  console.log(`Slug: ${saved.slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
