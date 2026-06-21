import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseUser, supabaseRequest } from "./rest";

export const accessTokenCookie = "fm-supabase-access-token";
export const refreshTokenCookie = "fm-supabase-refresh-token";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(accessTokenCookie)?.value;
  if (!accessToken) return null;

  try {
    const user = await getSupabaseUser(accessToken);
    const profiles = await supabaseRequest<Array<{ role: "admin" | "editor" }>>(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
      { accessToken }
    );
    if (!profiles[0]) return null;
    return { accessToken, user, role: profiles[0].role };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

