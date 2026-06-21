import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="container rounded-lg bg-ink p-8 text-white shadow-soft md:p-10">
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-sunny">
            <Mail size={18} /> Weekly memory picks
          </p>
          <h2 className="mt-3 text-3xl font-bold">Get weekly memory picks and nostalgic finds.</h2>
        </div>
        <form action={process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || "#"} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="min-h-12 flex-1 rounded-full border border-white/20 px-5 text-ink outline-none"
          />
          <button className="min-h-12 rounded-full bg-berry px-6 font-bold text-white">Join</button>
        </form>
      </div>
    </section>
  );
}
