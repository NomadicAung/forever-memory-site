import type { Product, RoomGlowUpAnalysis, RoomGlowUpProductMatch } from "@/lib/types";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";
import { deletePrivateObject, supabaseServiceRequest } from "@/lib/supabase/service";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

type AnalysisRecord = {
  id: string;
  image_path: string | null;
  space_type: string;
  aesthetic: string;
  budget: string;
  region: string;
  analysis: RoomGlowUpAnalysis;
  matched_products: RoomGlowUpProductMatch[];
  expires_at: string;
  created_at: string;
};

const localStoreDir = join(process.cwd(), "tmp", "room-glow-up");

function localPath(id: string) {
  return join(localStoreDir, `${id.replace(/[^a-z0-9-]/gi, "")}.json`);
}

async function writeLocalRecord(record: AnalysisRecord) {
  await mkdir(localStoreDir, { recursive: true });
  await writeFile(localPath(record.id), JSON.stringify(record, null, 2), "utf8");
}

async function readLocalRecord(id: string) {
  try {
    return JSON.parse(await readFile(localPath(id), "utf8")) as AnalysisRecord;
  } catch {
    return null;
  }
}

export async function saveRoomGlowUpAnalysis(input: {
  imagePath: string | null;
  analysis: RoomGlowUpAnalysis;
  matches: RoomGlowUpProductMatch[];
}) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  if (!isSupabaseServiceConfigured) {
    const id = crypto.randomUUID();
    await writeLocalRecord({
      id,
      image_path: input.imagePath,
      space_type: input.analysis.spaceType,
      aesthetic: input.analysis.aesthetic,
      budget: input.analysis.budget,
      region: input.analysis.region,
      analysis: { ...input.analysis, id },
      matched_products: input.matches,
      expires_at: expiresAt,
      created_at: new Date().toISOString()
    });
    return id;
  }

  const [row] = await supabaseServiceRequest<Array<{ id: string }>>("/rest/v1/room_glow_up_analyses", {
    method: "POST",
    prefer: "return=representation",
    body: {
      image_path: input.imagePath,
      space_type: input.analysis.spaceType,
      aesthetic: input.analysis.aesthetic,
      budget: input.analysis.budget,
      region: input.analysis.region,
      analysis: input.analysis,
      matched_products: input.matches,
      expires_at: expiresAt
    }
  });
  return row.id;
}

export async function getRoomGlowUpAnalysis(id: string) {
  if (!isSupabaseServiceConfigured) {
    const row = await readLocalRecord(id);
    if (!row) return null;
    return { ...row, analysis: { ...row.analysis, id: row.id, createdAt: row.created_at } };
  }

  const rows = await supabaseServiceRequest<AnalysisRecord[]>(
    `/rest/v1/room_glow_up_analyses?id=eq.${encodeURIComponent(id)}&deleted_at=is.null&select=*`
  );
  const row = rows[0];
  if (!row) return null;
  return { ...row, analysis: { ...row.analysis, id: row.id, createdAt: row.created_at } };
}

export async function deleteRoomGlowUpAnalysis(id: string) {
  const existing = await getRoomGlowUpAnalysis(id);
  if (!existing) return;

  if (!isSupabaseServiceConfigured) {
    await rm(localPath(id), { force: true });
    return;
  }

  await supabaseServiceRequest(`/rest/v1/room_glow_up_analyses?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    prefer: "return=minimal",
    body: { deleted_at: new Date().toISOString() }
  });

  if (existing.image_path) await deletePrivateObject("room-glow-up-images", [existing.image_path]);
}

export function flattenMatchedProducts(matches: RoomGlowUpProductMatch[]): Product[] {
  const bySlug = new Map<string, Product>();
  for (const match of matches) {
    for (const product of match.products) bySlug.set(product.slug, product);
  }
  return Array.from(bySlug.values());
}
