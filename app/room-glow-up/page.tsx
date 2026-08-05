import { RoomGlowUpForm } from "@/components/RoomGlowUpForm";
import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({
    title: "Room Glow Up",
    description: "Upload a room photo and get kawaii, cozy, nostalgic, or retro gaming room inspiration matched with curated Forever Memory products.",
    path: "/room-glow-up"
  });

export default function RoomGlowUpPage() {
  return (
    <main className="container py-10">
      <RoomGlowUpForm />
      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Private by default</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">Photos are handled only for your analysis and can be deleted from the result page.</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Original suggestions</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">The AI suggests categories and styling ideas, then Forever Memory matches real catalogue products.</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-soft">
          <h2 className="font-bold">Affiliate-friendly</h2>
          <p className="mt-2 text-sm leading-6 text-ink/70">Recommendations use clear disclosure and never invent prices, retailers, or product availability.</p>
        </div>
      </section>
    </main>
  );
}
