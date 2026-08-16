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

function contentTypeFor(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  return "application/octet-stream";
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

async function uploadImageFile(supabaseUrl, serviceRoleKey, articleSlug, filePath) {
  const absolutePath = resolve(process.cwd(), filePath);
  if (!existsSync(absolutePath)) throw new Error(`Image file not found: ${filePath}`);

  const extension = extname(absolutePath).toLowerCase() || ".png";
  const storagePath = `${articleSlug}/featured${extension}`;
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
    throw new Error(detail || `Could not upload image (${response.status}).`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${articleImageBucket}/${storagePath}`;
}

async function main() {
  loadLocalEnv();

  const [slug, imagePath] = process.argv.slice(2);
  if (!slug || !imagePath) {
    throw new Error("Usage: npm run update:article-image -- article-slug path/to/image.png");
  }

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  await ensureImageBucket(supabaseUrl, serviceRoleKey);
  const imageUrl = await uploadImageFile(supabaseUrl, serviceRoleKey, slug, imagePath);

  const response = await fetch(`${supabaseUrl}/rest/v1/articles?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify({ featured_image: imageUrl, pinterest_image: imageUrl })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Article image update failed (${response.status}).`);
  }

  const saved = await response.json();
  if (saved.length === 0) throw new Error(`No article found for slug: ${slug}`);

  console.log(`Article image updated: ${saved[0].title}`);
  console.log(`Slug: ${saved[0].slug}`);
  console.log(`Image: ${imageUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
