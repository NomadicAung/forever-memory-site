"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || "Login failed.");
      setLoading(false);
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="container grid min-h-[70vh] place-items-center py-12">
      <section className="w-full max-w-md rounded-lg bg-white p-8 shadow-soft">
        <Image src="/images/forever-memory-logo.jpg" alt="Forever Memory" width={250} height={250} className="mx-auto h-28 w-28 rounded-lg" />
        <h1 className="mt-5 text-center text-3xl font-black">Admin login</h1>
        <p className="mt-2 text-center text-sm text-ink/70">Sign in with the admin user created in Supabase.</p>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <label className="grid gap-1 text-sm font-bold">Email
            <input type="email" required className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="grid gap-1 text-sm font-bold">Password
            <input type="password" required className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
          <button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-berry px-5 py-3 font-bold text-white disabled:opacity-60">
            <LogIn size={18} /> {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

