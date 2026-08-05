import { NextResponse } from "next/server";
import { analyzeRoom } from "@/lib/ai/provider";
import { getProductsFromContent } from "@/lib/content";
import { isSupabaseServiceConfigured, supabaseUrl } from "@/lib/supabase/config";
import { uploadPrivateObject } from "@/lib/supabase/service";
import { matchProductsToRecommendations } from "@/lib/room-glow-up/matching";
import { validateRoomImage, validateRoomRequest } from "@/lib/room-glow-up/validation";
import { saveRoomGlowUpAnalysis } from "@/lib/room-glow-up/store";
import { rateLimit, requestIp } from "@/lib/rate-limit";
import { supabaseRequest } from "@/lib/supabase/rest";

export const runtime = "nodejs";

async function analytics(eventType: string, pagePath: string) {
  try {
    await supabaseRequest("/rest/v1/analytics_events", {
      method: "POST",
      prefer: "return=minimal",
      body: { event_type: eventType, page_path: pagePath }
    });
  } catch {
    // Analytics should never block the room analysis flow.
  }
}

export async function POST(request: Request) {
  const hourlyLimit = Number(process.env.ROOM_GLOW_UP_RATE_LIMIT_PER_HOUR || 8);
  const limited = rateLimit(`room-glow-up:${requestIp(request)}`, hourlyLimit, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many room analyses. Please try again later." }, { status: 429 });
  }

  const formData = await request.formData();
  const file = formData.get("photo");
  const spaceType = String(formData.get("spaceType") || "");
  const aesthetic = String(formData.get("aesthetic") || "");
  const budget = String(formData.get("budget") || "");
  const region = String(formData.get("region") || "");
  const consent = String(formData.get("consent") || "");

  const formError = validateRoomRequest({ spaceType, aesthetic, budget, region, consent });
  if (formError) return NextResponse.json({ error: formError }, { status: 400 });

  const maxMb = Number(process.env.ROOM_GLOW_UP_MAX_IMAGE_MB || 5);
  if (!(file instanceof File)) return NextResponse.json({ error: "Upload a room photo." }, { status: 400 });
  const imageError = validateRoomImage(file, maxMb);
  if (imageError) return NextResponse.json({ error: imageError }, { status: 400 });

  let imagePath: string | null = null;
  if (isSupabaseServiceConfigured) {
    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    imagePath = `anonymous/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
    await uploadPrivateObject("room-glow-up-images", imagePath, file);
  }

  const imageUrl = imagePath ? `${supabaseUrl}/storage/v1/object/sign/room-glow-up-images/${imagePath}` : undefined;
  const analysis = await analyzeRoom({ imageUrl, spaceType, aesthetic, budget, region });
  const products = await getProductsFromContent();
  const matches = matchProductsToRecommendations(products, analysis);
  const id = await saveRoomGlowUpAnalysis({ imagePath, analysis, matches });

  await analytics("room_glow_up_analysis", "/room-glow-up");
  return NextResponse.json({ id, url: `/room-glow-up/${id}` });
}
