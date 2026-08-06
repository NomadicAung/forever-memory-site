import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const root = new URL("../", import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Room Glow Up route and API files exist", async () => {
  const page = await text("app/room-glow-up/page.tsx");
  const api = await text("app/api/room-glow-up/route.ts");
  assert.match(page, /Room Glow Up/);
  assert.match(api, /validateRoomImage/);
  assert.match(api, /rateLimit/);
});

test("Supabase migration creates private Room Glow Up storage and analysis table", async () => {
  const migration = await text("supabase/migrations/202608050001_room_glow_up_phase_1a.sql");
  assert.match(migration, /room_glow_up_analyses/);
  assert.match(migration, /room-glow-up-images/);
  assert.match(migration, /values \('room-glow-up-images', 'room-glow-up-images', false\)/i);
});

test("AI output validator includes safety fields", async () => {
  const validator = await text("lib/room-glow-up/validation.ts");
  assert.match(validator, /safetyNote/);
  assert.match(validator, /analysisConfidence/);
  assert.match(validator, /suggestedPalette/);
});

test("OpenAI room provider uses vision, structured output, and safety guardrails", async () => {
  const provider = await text("lib/ai/openai-provider.ts");
  assert.match(provider, /https:\/\/api\.openai\.com\/v1\/responses/);
  assert.match(provider, /input_image/);
  assert.match(provider, /json_schema/);
  assert.match(provider, /Do not identify people/);
  assert.match(provider, /Do not invent product names/);
});

test("mock room provider builds curated recommendations from room, aesthetic, and budget choices", async () => {
  const provider = await text("lib/ai/mock-provider.ts");
  assert.match(provider, /selectedRoom/);
  assert.match(provider, /selectedAesthetic/);
  assert.match(provider, /selectedBudget/);
  assert.match(provider, /extraIdeas\(input, selectedTheme\)/);
  assert.match(provider, /eight practical product directions/);
  assert.match(provider, /Mock mode does not inspect the uploaded image/);
});

test("Room Glow Up matching script can infer and apply product matching fields", async () => {
  const script = await text("scripts/fill-room-glow-matching.mjs");
  const packageJson = await text("package.json");
  assert.match(script, /inferAestheticTags/);
  assert.match(script, /inferRoomTypeTags/);
  assert.match(script, /inferColorTags/);
  assert.match(script, /--apply/);
  assert.match(packageJson, /fill:room-matching/);
});

test("Room Glow Up products can be manually excluded from matching", async () => {
  const types = await text("lib/types.ts");
  const content = await text("lib/content.ts");
  const matching = await text("lib/room-glow-up/matching.ts");
  const admin = await text("components/AdminDashboard.tsx");
  const migration = await text("supabase/migrations/202608060001_product_room_glow_up_enabled.sql");
  assert.match(types, /roomGlowUpEnabled/);
  assert.match(content, /room_glow_up_enabled/);
  assert.match(matching, /roomGlowUpEnabled === false/);
  assert.match(admin, /Include this product in Room Glow Up results/);
  assert.match(admin, /toggleRoomGlowUpProduct/);
  assert.match(admin, /checked={product.roomGlowUpEnabled !== false}/);
  assert.match(migration, /room_glow_up_enabled boolean not null default true/);
});
