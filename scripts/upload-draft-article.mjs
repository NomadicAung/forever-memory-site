import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const articleImageBucket = "article-images";

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
  if (Array.isArray(value)) return value.filter(Boolean);
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

function normalizeArticle(input) {
  const title = String(input.title || "").trim();
  if (!title) throw new Error("Article title is required.");

  const sections = Array.isArray(input.sections) ? input.sections : [];
  const normalizedSections = sections
    .map((section) => ({
      heading: String(section.heading || "").trim(),
      body: String(section.body || "").trim()
    }))
    .filter((section) => section.heading && section.body);

  if (normalizedSections.length === 0) throw new Error("At least one article section is required.");

  const category = input.category === "gift-guides" ? "gift-guides" : input.category;
  const allowedCategories = new Set(["kawaii", "nostalgia", "retro-gaming", "gift-guides"]);
  if (!allowedCategories.has(category)) throw new Error("Category must be kawaii, nostalgia, retro-gaming, or gift-guides.");

  const type = input.type || "memory";
  const allowedTypes = new Set(["best-of", "review", "comparison", "memory"]);
  if (!allowedTypes.has(type)) throw new Error("Type must be best-of, review, comparison, or memory.");

  const fallbackImage =
    category === "retro-gaming"
      ? "/images/retro-gaming-finds.webp"
      : category === "nostalgia"
        ? "/images/nostalgia-finds.webp"
        : "/images/kawaii-finds.webp";

  return {
    title,
    slug: slugify(input.slug || title),
    type,
    category,
    excerpt: String(input.excerpt || "").trim(),
    featured_image: String(input.featuredImage || input.featured_image || fallbackImage).trim(),
    pinterest_image: String(input.pinterestImage || input.pinterest_image || input.featuredImage || input.featured_image || fallbackImage).trim(),
    author: String(input.author || "Forever Memory Editors").trim(),
    published_at: null,
    sections: normalizedSections,
    comparison_rows: Array.isArray(input.comparisonRows || input.comparison_rows) ? input.comparisonRows || input.comparison_rows : null,
    pros: toArray(input.pros),
    cons: toArray(input.cons),
    faqs: Array.isArray(input.faqs) ? input.faqs : [],
    tags: toArray(input.tags),
    related_products: toArray(input.products || input.relatedProducts || input.related_products),
    seo_title: String(input.seoTitle || input.seo_title || title).trim(),
    meta_description: String(input.metaDescription || input.meta_description || input.excerpt || "").trim(),
    status: "draft"
  };
}

async function ensureImageBucket(supabaseUrl, serviceRoleKey) {
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };

  const check = await fetch(`${supabaseUrl}/storage/v1/bucket/${articleImageBucket}`, { headers });
  if (check.ok) return;
  if (check.status !== 404) {
    const detail = await check.text();
    throw new Error(detail || `Could not check article image bucket (${check.status}).`);
  }

  const create = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers,
    body: JSON.stringify({ id: articleImageBucket, name: articleImageBucket, public: true })
  });

  if (!create.ok && create.status !== 409) {
    const detail = await create.text();
    throw new Error(detail || `Could not create article image bucket (${create.status}).`);
  }
}

async function uploadImageFile(supabaseUrl, serviceRoleKey, articleSlug, filePath, kind) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) throw new Error(`${kind} image file not found: ${filePath}`);

  const extension = extname(absolutePath).toLowerCase() || ".png";
  const storagePath = `${articleSlug}/${kind}${extension}`;
  const image = await readFile(absolutePath);
  const response = await fetch(`${supabaseUrl}/storage/v1/object/${articleImageBucket}/${storagePath}`, {
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
    throw new Error(detail || `Could not upload ${kind} image (${response.status}).`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${articleImageBucket}/${storagePath}`;
}

async function main() {
  loadLocalEnv();

  const articlePath = process.argv[2];
  if (!articlePath) throw new Error("Usage: npm run upload:article-draft -- path/to/article.json");

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const raw = await readFile(resolve(process.cwd(), articlePath), "utf8");
  const input = JSON.parse(raw);
  const article = normalizeArticle(input);

  if (input.featuredImageFile || input.featured_image_file || input.pinterestImageFile || input.pinterest_image_file) {
    await ensureImageBucket(supabaseUrl, serviceRoleKey);

    const featuredImageFile = input.featuredImageFile || input.featured_image_file;
    const pinterestImageFile = input.pinterestImageFile || input.pinterest_image_file;

    if (featuredImageFile) {
      article.featured_image = await uploadImageFile(supabaseUrl, serviceRoleKey, article.slug, featuredImageFile, "featured");
    }

    if (pinterestImageFile) {
      article.pinterest_image = await uploadImageFile(supabaseUrl, serviceRoleKey, article.slug, pinterestImageFile, "pinterest");
    } else if (featuredImageFile) {
      article.pinterest_image = article.featured_image;
    }
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/articles`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(article)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase upload failed (${response.status}).`);
  }

  const [saved] = await response.json();
  console.log(`Draft uploaded: ${saved.title}`);
  console.log(`Slug: ${saved.slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
