import { AdminDashboard } from "@/components/AdminDashboard";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireAdminSession } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isSupabaseConfigured) {
    return <AdminDashboard initialProducts={await getProductsFromContent()} initialArticles={await getArticlesFromContent()} connected={false} />;
  }

  const session = await requireAdminSession();
  const [products, articles] = await Promise.all([
    getProductsFromContent(session.accessToken),
    getArticlesFromContent(session.accessToken)
  ]);
  return <AdminDashboard initialProducts={products} initialArticles={articles} connected />;
}

