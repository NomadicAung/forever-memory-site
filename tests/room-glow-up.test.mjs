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
