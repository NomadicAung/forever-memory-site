"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Link as LinkIcon, LogOut, Plus } from "lucide-react";
import type { Article, Product } from "@/lib/types";

const emptyDraft = {
  name: "",
  category: "kawaii",
  brand: "",
  imageUrl: "",
  affiliateUrl: "",
  store: "Amazon",
  featured: false,
  publishNow: false,
  priceRange: "Check latest price",
  shortDescription: "",
  longDescription: "",
  pros: "",
  cons: "",
  bestFor: ""
};

const emptyArticleDraft = {
  title: "",
  type: "memory",
  category: "kawaii",
  excerpt: "",
  sectionHeading: "Introduction",
  body: "",
  author: "Forever Memory Editors",
  featuredImage: "",
  relatedProducts: "",
  seoTitle: "",
  metaDescription: "",
  publishNow: false
};

export function AdminDashboard({ initialProducts, initialArticles, connected }: { initialProducts: Product[]; initialArticles: Article[]; connected: boolean }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [draft, setDraft] = useState(emptyDraft);
  const [articleDraft, setArticleDraft] = useState(emptyArticleDraft);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);

  const json = useMemo(() => JSON.stringify({ products, articles }, null, 2), [products, articles]);

  async function uploadImage(file?: File) {
    if (!file || !connected) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/admin/images", { method: "POST", body: formData });
    const result = await response.json();
    setUploading(false);
    if (!response.ok) return setNotice(result.error || "Image upload failed.");
    setDraft((current) => ({ ...current, imageUrl: result.url }));
    setNotice("Product image uploaded to Supabase Storage.");
  }

  async function addProduct() {
    if (!draft.name || !draft.affiliateUrl) return;
    const slug = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const product: Product = {
      featured: draft.featured,
      name: draft.name,
      slug,
      category: draft.category as Product["category"],
      brand: draft.brand || "Custom",
      image: draft.imageUrl || "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1000&q=80",
      shortDescription: draft.shortDescription || "Product description coming soon.",
      longDescription: draft.longDescription || "Product notes coming soon.",
      priceRange: draft.priceRange,
      affiliateLinks: [{ store: draft.store as Product["affiliateLinks"][number]["store"], label: `View on ${draft.store}`, url: draft.affiliateUrl }],
      pros: draft.pros.split("\n").map((item) => item.trim()).filter(Boolean),
      cons: draft.cons.split("\n").map((item) => item.trim()).filter(Boolean),
      bestFor: draft.bestFor || "Product discovery",
      tags: ["new"],
      relatedProducts: [],
      seoTitle: `${draft.name} Review`,
      metaDescription: `Review and buying notes for ${draft.name}.`
    };
    if (connected) {
      const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product, status: draft.publishNow ? "published" : "draft" }) });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not save product.");
    }
    setProducts((current) => [product, ...current]);
    setDraft(emptyDraft);
    setNotice(`${draft.name} was ${connected ? "saved to Supabase" : "added to this export"}.`);
  }

  async function addArticle() {
    if (!articleDraft.title || !articleDraft.excerpt || !articleDraft.body) return;
    const slug = articleDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const today = new Date().toISOString().slice(0, 10);
    const fallbackImage = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80";
    const article: Article = {
        title: articleDraft.title,
        slug,
        type: articleDraft.type as Article["type"],
        category: articleDraft.category as Article["category"],
        excerpt: articleDraft.excerpt,
        featuredImage: articleDraft.featuredImage || fallbackImage,
        pinterestImage: articleDraft.featuredImage || fallbackImage,
        author: articleDraft.author,
        publishedAt: today,
        updatedAt: today,
        products: articleDraft.relatedProducts.split(",").map((item) => item.trim()).filter(Boolean),
        sections: [{ heading: articleDraft.sectionHeading, body: articleDraft.body }],
        faqs: [],
        tags: [],
        seoTitle: articleDraft.seoTitle || articleDraft.title,
        metaDescription: articleDraft.metaDescription || articleDraft.excerpt
      };
    if (connected) {
      const response = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ article, status: articleDraft.publishNow ? "published" : "draft" }) });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not save article.");
    }
    setArticles((current) => [article, ...current]);
    setNotice(`${articleDraft.title} was ${connected ? "saved to Supabase" : "added to this export"}.`);
    setArticleDraft(emptyArticleDraft);
  }

  return (
    <main className="container py-10">
      <section className="rounded-lg bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold uppercase tracking-wide text-berry">{connected ? "Supabase connected" : "Setup mode"}</p>
          {connected && <form action="/api/auth/logout" method="post"><button className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-4 py-2 text-sm font-bold"><LogOut size={16} /> Sign out</button></form>}
        </div>
        <h1 className="mt-2 text-4xl font-black">Forever Memory admin</h1>
        <p className="mt-3 max-w-2xl leading-7 text-ink/70">
          {connected ? "Products and articles are saved securely to Supabase. Choose draft while editing or publish when the content is ready." : "Add your Supabase project URL and anon key to enable secure login and permanent database saves. JSON export remains available while setup is incomplete."}
        </p>
        {notice && <p className="mt-4 rounded-lg bg-pink-50 px-4 py-3 text-sm font-bold text-berry">{notice}</p>}
      </section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-bold"><Plus size={20} /> Add product</h2>
          <div className="mt-5 grid gap-3">
            <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Product name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <select className="rounded-lg border border-pink-100 px-4 py-3" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
              <option value="kawaii">Kawaii</option>
              <option value="nostalgia">Nostalgia</option>
              <option value="retro-gaming">Retro Gaming</option>
            </select>
            <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Brand" value={draft.brand} onChange={(event) => setDraft({ ...draft, brand: event.target.value })} />
            <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Price range" value={draft.priceRange} onChange={(event) => setDraft({ ...draft, priceRange: event.target.value })} />
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Product image URL
              <input type="url" className="rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="https://your-site.com/product-image.jpg" value={draft.imageUrl} onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })} />
            </label>
            {connected && <label className="grid gap-1 text-sm font-bold text-ink/80">
              Or upload product image
              <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={(event) => uploadImage(event.target.files?.[0])} className="rounded-lg border border-pink-100 px-4 py-3 font-normal file:mr-3 file:rounded-full file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:font-bold file:text-berry" />
              <span className="font-normal text-ink/60">{uploading ? "Uploading..." : "JPG, PNG, or WebP up to 5 MB"}</span>
            </label>}
            {draft.imageUrl && (
              <div
                role="img"
                aria-label="Product image preview"
                className="aspect-[4/3] rounded-lg border border-pink-100 bg-pink-50 bg-cover bg-center"
                style={{ backgroundImage: `url(${draft.imageUrl})` }}
              />
            )}
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-pink-100 px-4 py-3 font-bold text-ink/80">
              <input type="checkbox" checked={draft.featured} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} className="h-5 w-5 accent-pink-600" />
              Feature this product on the homepage
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-pink-100 px-4 py-3 font-bold text-ink/80">
              <input type="checkbox" checked={draft.publishNow} onChange={(event) => setDraft({ ...draft, publishNow: event.target.checked })} className="h-5 w-5 accent-pink-600" />
              Publish immediately
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Short product description
              <textarea className="min-h-24 rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="Shown on product cards and near the product title" value={draft.shortDescription} onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Product notes
              <textarea className="min-h-32 rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="Write the full product description, buying advice, dimensions, materials, or other useful details" value={draft.longDescription} onChange={(event) => setDraft({ ...draft, longDescription: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Pros (one per line)
              <textarea className="min-h-24 rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder={"Cute room accent\nEasy decor update"} value={draft.pros} onChange={(event) => setDraft({ ...draft, pros: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Cons (one per line)
              <textarea className="min-h-24 rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder={"Check dimensions\nColors may vary"} value={draft.cons} onChange={(event) => setDraft({ ...draft, cons: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm font-bold text-ink/80">
              Best for
              <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="Kawaii bedrooms and creative spaces" value={draft.bestFor} onChange={(event) => setDraft({ ...draft, bestFor: event.target.value })} />
            </label>
            <select className="rounded-lg border border-pink-100 px-4 py-3" value={draft.store} onChange={(event) => setDraft({ ...draft, store: event.target.value })}>
              <option>Amazon</option>
              <option>eBay</option>
              <option>Etsy</option>
              <option>AliExpress</option>
              <option>Other</option>
            </select>
            <input className="rounded-lg border border-pink-100 px-4 py-3" placeholder="Affiliate URL" value={draft.affiliateUrl} onChange={(event) => setDraft({ ...draft, affiliateUrl: event.target.value })} />
            <button onClick={addProduct} className="rounded-full bg-berry px-5 py-3 font-bold text-white">Add product</button>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 text-xl font-bold"><LinkIcon size={20} /> Export content</h2>
          <p className="mt-2 text-sm text-ink/70">Includes products, featured selections, and submitted article drafts.</p>
          <textarea className="mt-5 h-[480px] w-full rounded-lg border border-pink-100 p-4 font-mono text-xs" readOnly value={json} />
          <a
            href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`}
            download="forever-memory-content.json"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200 px-5 py-3 font-bold"
          >
            <Download size={18} /> Download JSON
          </a>
        </div>
      </section>
      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-bold"><FileText size={20} /> Submit blog article</h2>
        <p className="mt-2 text-sm text-ink/70">Create an article draft for the content export. Title, summary, and article body are required.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm font-bold text-ink/80">Article title
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.title} onChange={(event) => setArticleDraft({ ...articleDraft, title: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Author
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.author} onChange={(event) => setArticleDraft({ ...articleDraft, author: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Article type
            <select className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.type} onChange={(event) => setArticleDraft({ ...articleDraft, type: event.target.value })}>
              <option value="memory">Memory article</option><option value="best-of">Best-of guide</option><option value="review">Review</option><option value="comparison">Comparison</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Category
            <select className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.category} onChange={(event) => setArticleDraft({ ...articleDraft, category: event.target.value })}>
              <option value="kawaii">Kawaii</option><option value="nostalgia">Nostalgia</option><option value="retro-gaming">Retro Gaming</option><option value="gift-guides">Gift Guides</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80 md:col-span-2">Article summary
            <textarea className="min-h-24 rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.excerpt} onChange={(event) => setArticleDraft({ ...articleDraft, excerpt: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Section heading
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.sectionHeading} onChange={(event) => setArticleDraft({ ...articleDraft, sectionHeading: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Related product slugs (comma separated)
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="kawaii-wall-decor" value={articleDraft.relatedProducts} onChange={(event) => setArticleDraft({ ...articleDraft, relatedProducts: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80 md:col-span-2">Article body
            <textarea className="min-h-64 rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="Write the main article content here..." value={articleDraft.body} onChange={(event) => setArticleDraft({ ...articleDraft, body: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80 md:col-span-2">Featured image URL
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" placeholder="https://..." value={articleDraft.featuredImage} onChange={(event) => setArticleDraft({ ...articleDraft, featuredImage: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">SEO title
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.seoTitle} onChange={(event) => setArticleDraft({ ...articleDraft, seoTitle: event.target.value })} />
          </label>
          <label className="grid gap-1 text-sm font-bold text-ink/80">Meta description
            <input className="rounded-lg border border-pink-100 px-4 py-3 font-normal" value={articleDraft.metaDescription} onChange={(event) => setArticleDraft({ ...articleDraft, metaDescription: event.target.value })} />
          </label>
        </div>
        <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-lg border border-pink-100 px-4 py-3 font-bold text-ink/80">
          <input type="checkbox" checked={articleDraft.publishNow} onChange={(event) => setArticleDraft({ ...articleDraft, publishNow: event.target.checked })} className="h-5 w-5 accent-pink-600" />
          Publish immediately
        </label>
        <button onClick={addArticle} className="mt-5 rounded-full bg-berry px-5 py-3 font-bold text-white">Submit article draft</button>
      </section>
    </main>
  );
}
