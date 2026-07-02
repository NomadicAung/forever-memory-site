import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { supabaseRequest } from "@/lib/supabase/rest";

const allowedEvents = new Set(["affiliate_click", "outbound_click"]);

function clean(value: unknown, max = 500) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ ok: true });

  try {
    const body = await request.json();
    const eventType = clean(body.eventType, 40);
    if (!eventType || !allowedEvents.has(eventType)) {
      return NextResponse.json({ error: "Invalid analytics event." }, { status: 400 });
    }

    await supabaseRequest("/rest/v1/analytics_events", {
      method: "POST",
      prefer: "return=minimal",
      body: {
        event_type: eventType,
        product_slug: clean(body.productSlug, 140),
        product_name: clean(body.productName, 240),
        store: clean(body.store, 80),
        target_url: clean(body.targetUrl, 1000),
        page_path: clean(body.pagePath, 500),
        referrer: clean(body.referrer, 500)
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
