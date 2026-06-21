import { NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/supabase/auth";

export async function POST(request: Request) {
  const output = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  output.cookies.delete(accessTokenCookie);
  output.cookies.delete(refreshTokenCookie);
  return output;
}

