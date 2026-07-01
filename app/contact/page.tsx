import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Contact", description: "Contact Forever Memory for product suggestions, corrections, and partnerships.", path: "/contact" });

export default function ContactPage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-black">Contact</h1>
      <p className="mt-5 leading-8 text-ink/70">
        For product suggestions, corrections, partnership questions, or affiliate updates, email{" "}
        <a href="mailto:forevermemory2025@gmail.com" className="font-bold text-berry">forevermemory2025@gmail.com</a>.
      </p>
      <section className="mt-6 rounded-lg bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold">Follow Forever Memory</h2>
        <div className="mt-4 grid gap-3 text-sm font-semibold text-berry sm:grid-cols-2">
          <a href="https://www.facebook.com/formemo/" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-3 text-center">Facebook</a>
          <a href="https://www.pinterest.com/forevermemory0051/" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-3 text-center">Pinterest</a>
          <a href="https://www.tiktok.com/@forever.memory4" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-3 text-center">TikTok</a>
          <a href="https://www.youtube.com/@ForeverMemorychannel" target="_blank" rel="noreferrer" className="rounded-full border border-pink-200 px-4 py-3 text-center">YouTube</a>
        </div>
      </section>
      <form className="mt-8 grid gap-4 rounded-lg bg-white p-6 shadow-soft">
        <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Name" />
        <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Email" type="email" />
        <textarea className="min-h-36 rounded-lg border border-pink-100 px-4 py-3" placeholder="Message" />
        <button className="rounded-full bg-berry px-6 py-3 font-bold text-white">Send message</button>
      </form>
    </main>
  );
}
