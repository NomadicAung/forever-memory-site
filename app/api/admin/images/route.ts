import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/supabase/auth";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Use a JPG, PNG, or WebP image up to 5 MB." }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": file.type,
      "x-upsert": "false"
    },
    body: file,
    cache: "no-store"
  });

  if (!response.ok) {
    return NextResponse.json({ error: await response.text() || "Image upload failed." }, { status: 400 });
  }

  return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/product-images/${path}` });
}

