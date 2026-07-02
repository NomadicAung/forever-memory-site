import type { AnalyticsEvent, AnalyticsSummary } from "./types";
import { isSupabaseConfigured } from "./supabase/config";
import { supabaseRequest } from "./supabase/rest";

type AnalyticsRow = {
  event_type: AnalyticsEvent["eventType"];
  product_slug: string | null;
  product_name: string | null;
  store: string | null;
  target_url: string | null;
  page_path: string | null;
  referrer: string | null;
  created_at: string;
};

const analyticsSelect = "event_type,product_slug,product_name,store,target_url,page_path,referrer,created_at";

function mapEvent(row: AnalyticsRow): AnalyticsEvent {
  return {
    eventType: row.event_type,
    productSlug: row.product_slug || undefined,
    productName: row.product_name || undefined,
    store: row.store || undefined,
    targetUrl: row.target_url || undefined,
    pagePath: row.page_path || undefined,
    referrer: row.referrer || undefined,
    createdAt: row.created_at
  };
}

function topCounts(events: AnalyticsEvent[], key: "productName" | "store") {
  const counts = new Map<string, number>();
  for (const event of events) {
    const label = event[key] || "Unknown";
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, clicks]) => ({ label, clicks }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);
}

export async function getAnalyticsSummary(accessToken?: string): Promise<AnalyticsSummary> {
  const empty: AnalyticsSummary = { totalClicks: 0, todayClicks: 0, topProducts: [], topStores: [], recentClicks: [] };
  if (!isSupabaseConfigured || !accessToken) return empty;

  try {
    const rows = await supabaseRequest<AnalyticsRow[]>(
      `/rest/v1/analytics_events?select=${analyticsSelect}&event_type=eq.affiliate_click&order=created_at.desc&limit=500`,
      { accessToken }
    );
    const events = rows.map(mapEvent);
    const today = new Date().toISOString().slice(0, 10);
    return {
      totalClicks: events.length,
      todayClicks: events.filter((event) => event.createdAt.slice(0, 10) === today).length,
      topProducts: topCounts(events, "productName"),
      topStores: topCounts(events, "store"),
      recentClicks: events.slice(0, 10)
    };
  } catch {
    return empty;
  }
}
