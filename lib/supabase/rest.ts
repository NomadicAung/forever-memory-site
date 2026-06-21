import { supabaseAnonKey, supabaseUrl } from "./config";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  accessToken?: string;
  body?: unknown;
  prefer?: string;
};

export async function supabaseRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Supabase is not configured.");

  const response = await fetch(`${supabaseUrl}${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: supabaseAnonKey,
      ...(options.accessToken
        ? { Authorization: `Bearer ${options.accessToken}` }
        : supabaseAnonKey.startsWith("eyJ")
          ? { Authorization: `Bearer ${supabaseAnonKey}` }
          : {}),
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {})
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed (${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function getSupabaseUser(accessToken: string) {
  return supabaseRequest<{ id: string; email?: string }>("/auth/v1/user", { accessToken });
}
