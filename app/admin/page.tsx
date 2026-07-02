import { AdminDashboard } from "@/components/AdminDashboard";
import { getAnalyticsSummary } from "@/lib/analytics";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAdminSession } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return <AdminDashboard initialProducts={await getProductsFromContent()} initialArticles={await getArticlesFromContent()} analytics={await getAnalyticsSummary()} connected={false} />;
  }

  const session = await requireAdminSession();
  const [products, articles, analytics] = await Promise.all([
    getProductsFromContent(session.accessToken),
    getArticlesFromContent(session.accessToken),
    getAnalyticsSummary(session.accessToken)
  ]);
  return <AdminDashboard initialProducts={products} initialArticles={articles} analytics={analytics} connected />;
}
