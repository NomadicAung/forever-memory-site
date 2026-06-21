import { NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/supabase/auth";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Supabase has not been configured yet." }, { status: 503 });
  }

  const { email, password } = await request.json();
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: supabaseAnonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store"
  });
  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: result.error_description || result.msg || "Login failed." }, { status: 401 });
  }

  const output = NextResponse.json({ ok: true });
  const secure = process.env.NODE_ENV === "production";
  output.cookies.set(accessTokenCookie, result.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: result.expires_in
  });
  output.cookies.set(refreshTokenCookie, result.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return output;
}

