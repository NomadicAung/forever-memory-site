import { metadata } from "@/lib/seo";

export const generateMetadata = () =>
  metadata({ title: "Contact", description: "Contact Forever Memory for product suggestions, corrections, and partnerships.", path: "/contact" });

export default function ContactPage() {
  return (
    <main className="container max-w-3xl py-12">
      <h1 className="text-4xl font-black">Contact</h1>
      <p className="mt-5 leading-8 text-ink/70">
        For product suggestions, corrections, partnership questions, or affiliate updates, email hello@forevermemory.xyz.
      </p>
      <form className="mt-8 grid gap-4 rounded-lg bg-white p-6 shadow-soft">
        <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Name" />
        <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Email" type="email" />
        <textarea className="min-h-36 rounded-lg border border-pink-100 px-4 py-3" placeholder="Message" />
        <button className="rounded-full bg-berry px-6 py-3 font-bold text-white">Send message</button>
      </form>
    </main>
  );
}
