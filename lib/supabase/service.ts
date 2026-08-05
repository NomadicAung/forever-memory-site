import { isSupabaseServiceConfigured, supabaseServiceRoleKey, supabaseUrl } from "./config";

type ServiceOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
};

export async function supabaseServiceRequest<T>(path: string, options: ServiceOptions = {}): Promise<T> {
  if (!isSupabaseServiceConfigured) throw new Error("Supabase service role is not configured.");

  const response = await fetch(`${supabaseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase service request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function uploadPrivateObject(bucket: string, path: string, file: File) {
  if (!isSupabaseServiceConfigured) throw new Error("Supabase service role is not configured.");

  const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": file.type,
      "x-upsert": "false"
    },
    body: file,
    cache: "no-store"
  });

  if (!response.ok) throw new Error(await response.text() || "Private image upload failed.");
}

export async function deletePrivateObject(bucket: string, paths: string[]) {
  if (!isSupabaseServiceConfigured || paths.length === 0) return;
  await fetch(`${supabaseUrl}/storage/v1/object/${bucket}`, {
    method: "DELETE",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prefixes: paths }),
    cache: "no-store"
  });
}
