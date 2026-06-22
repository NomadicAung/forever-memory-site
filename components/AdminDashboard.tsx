"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Link as LinkIcon, LogOut, Pencil, Plus, Trash2, X } from "lucide-react";
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
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null);
  const [editingArticleSlug, setEditingArticleSlug] = useState<string | null>(null);

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
    const existing = editingProductSlug ? products.find((item) => item.slug === editingProductSlug) : undefined;
    const product: Product = {
      ...existing,
      status: draft.publishNow ? "published" : "draft",
      featured: draft.featured,
      name: draft.name,
      slug,
      category: draft.category as Product["category"],
      brand: draft.brand || "Custom",
      image: draft.imageUrl || "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1000&q=80",
      shortDescription: draft.shortDescription || "Product description coming soon.",
      longDescription: draft.longDescription || "Product notes coming soon.",
      priceRange: draft.priceRange,
      affiliateLinks: [
        { store: draft.store as Product["affiliateLinks"][number]["store"], label: `View on ${draft.store}`, url: draft.affiliateUrl },
        ...(existing?.affiliateLinks.slice(1) || [])
      ],
      pros: draft.pros.split("\n").map((item) => item.trim()).filter(Boolean),
      cons: draft.cons.split("\n").map((item) => item.trim()).filter(Boolean),
      bestFor: draft.bestFor || "Product discovery",
      tags: existing?.tags || ["new"],
      relatedProducts: existing?.relatedProducts || [],
      seoTitle: existing?.seoTitle || `${draft.name} Review`,
      metaDescription: existing?.metaDescription || `Review and buying notes for ${draft.name}.`
    };
    if (connected) {
      const response = await fetch(editingProductSlug ? `/api/admin/products/${encodeURIComponent(editingProductSlug)}` : "/api/admin/products", { method: editingProductSlug ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product, status: product.status }) });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not save product.");
    }
    setProducts((current) => editingProductSlug ? current.map((item) => item.slug === editingProductSlug ? product : item) : [product, ...current]);
    setDraft(emptyDraft);
    setEditingProductSlug(null);
    setNotice(`${draft.name} was ${editingProductSlug ? "updated" : connected ? "saved to Supabase" : "added to this export"}.`);
  }

  function editProduct(product: Product) {
    const primaryLink = product.affiliateLinks[0];
    setEditingProductSlug(product.slug);
    setDraft({
      name: product.name,
      category: product.category,
      brand: product.brand,
      imageUrl: product.image,
      affiliateUrl: primaryLink?.url || "",
      store: primaryLink?.store || "Amazon",
      featured: Boolean(product.featured),
      publishNow: product.status === "published",
      priceRange: product.priceRange,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      pros: product.pros.join("\n"),
      cons: product.cons.join("\n"),
      bestFor: product.bestFor
    });
    window.scrollTo({ top: 300, behavior: "smooth" });
  }

  async function deleteProduct(product: Product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    if (connected) {
      const response = await fetch(`/api/admin/products/${encodeURIComponent(product.slug)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not delete product.");
    }
    setProducts((current) => current.filter((item) => item.slug !== product.slug));
    if (editingProductSlug === product.slug) {
      setEditingProductSlug(null);
      setDraft(emptyDraft);
    }
    setNotice(`${product.name} was deleted.`);
  }

  async function addArticle() {
    if (!articleDraft.title || !articleDraft.excerpt || !articleDraft.body) return;
    const slug = articleDraft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const today = new Date().toISOString().slice(0, 10);
    const fallbackImage = "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80";
    const existing = editingArticleSlug ? articles.find((item) => item.slug === editingArticleSlug) : undefined;
    const article: Article = {
        ...existing,
        status: articleDraft.publishNow ? "published" : "draft",
        title: articleDraft.title,
        slug,
        type: articleDraft.type as Article["type"],
        category: articleDraft.category as Article["category"],
        excerpt: articleDraft.excerpt,
        featuredImage: articleDraft.featuredImage || fallbackImage,
        pinterestImage: articleDraft.featuredImage || fallbackImage,
        author: articleDraft.author,
        publishedAt: existing?.publishedAt || today,
        updatedAt: today,
        products: articleDraft.relatedProducts.split(",").map((item) => item.trim()).filter(Boolean),
        sections: [{ heading: articleDraft.sectionHeading, body: articleDraft.body }, ...(existing?.sections.slice(1) || [])],
        faqs: existing?.faqs || [],
        tags: existing?.tags || [],
        seoTitle: articleDraft.seoTitle || articleDraft.title,
        metaDescription: articleDraft.metaDescription || articleDraft.excerpt
      };
    if (connected) {
      const response = await fetch(editingArticleSlug ? `/api/admin/articles/${encodeURIComponent(editingArticleSlug)}` : "/api/admin/articles", { method: editingArticleSlug ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ article, status: article.status }) });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not save article.");
    }
    setArticles((current) => editingArticleSlug ? current.map((item) => item.slug === editingArticleSlug ? article : item) : [article, ...current]);
    setNotice(`${articleDraft.title} was ${editingArticleSlug ? "updated" : connected ? "saved to Supabase" : "added to this export"}.`);
    setArticleDraft(emptyArticleDraft);
    setEditingArticleSlug(null);
  }

  function editArticle(article: Article) {
    setEditingArticleSlug(article.slug);
    setArticleDraft({
      title: article.title,
      type: article.type,
      category: article.category,
      excerpt: article.excerpt,
      sectionHeading: article.sections[0]?.heading || "Introduction",
      body: article.sections[0]?.body || "",
      author: article.author,
      featuredImage: article.featuredImage,
      relatedProducts: article.products.join(", "),
      seoTitle: article.seoTitle,
      metaDescription: article.metaDescription,
      publishNow: article.status === "published"
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  async function deleteArticle(article: Article) {
    if (!window.confirm(`Delete ${article.title}? This cannot be undone.`)) return;
    if (connected) {
      const response = await fetch(`/api/admin/articles/${encodeURIComponent(article.slug)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) return setNotice(result.error || "Could not delete article.");
    }
    setArticles((current) => current.filter((item) => item.slug !== article.slug));
    if (editingArticleSlug === article.slug) {
      setEditingArticleSlug(null);
      setArticleDraft(emptyArticleDraft);
    }
    setNotice(`${article.title} was deleted.`);
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
          <h2 className="flex items-center gap-2 text-xl font-bold"><Plus size={20} /> {editingProductSlug ? "Edit product" : "Add product"}</h2>
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
            <div className="flex flex-wrap gap-2">
              <button onClick={addProduct} className="rounded-full bg-berry px-5 py-3 font-bold text-white">{editingProductSlug ? "Save changes" : "Add product"}</button>
              {editingProductSlug && <button onClick={() => { setEditingProductSlug(null); setDraft(emptyDraft); }} className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-5 py-3 font-bold"><X size={17} /> Cancel</button>}
            </div>
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
        <h2 className="text-xl font-bold">Manage products</h2>
        <p className="mt-2 text-sm text-ink/70">Edit affiliate links and product details, or permanently remove an item.</p>
        <div className="mt-5 grid gap-3">
          {products.length === 0 && <p className="text-sm text-ink/60">No products have been added yet.</p>}
          {products.map((product) => (
            <div key={product.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pink-100 p-4">
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-ink/50">{product.status || "demo"} · {product.category}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editProduct(product)} className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-4 py-2 text-sm font-bold"><Pencil size={16} /> Edit</button>
                <button onClick={() => deleteProduct(product)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl font-bold"><FileText size={20} /> {editingArticleSlug ? "Edit blog article" : "Submit blog article"}</h2>
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
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={addArticle} className="rounded-full bg-berry px-5 py-3 font-bold text-white">{editingArticleSlug ? "Save changes" : "Submit article"}</button>
          {editingArticleSlug && <button onClick={() => { setEditingArticleSlug(null); setArticleDraft(emptyArticleDraft); }} className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-5 py-3 font-bold"><X size={17} /> Cancel</button>}
        </div>
      </section>
      <section className="mt-8 rounded-lg bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold">Manage blog posts</h2>
        <p className="mt-2 text-sm text-ink/70">Edit existing articles or permanently delete posts you no longer need.</p>
        <div className="mt-5 grid gap-3">
          {articles.length === 0 && <p className="text-sm text-ink/60">No articles have been added yet.</p>}
          {articles.map((article) => (
            <div key={article.slug} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-pink-100 p-4">
              <div>
                <p className="font-bold">{article.title}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-ink/50">{article.status || "demo"} · {article.type.replace("-", " ")}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editArticle(article)} className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-4 py-2 text-sm font-bold"><Pencil size={16} /> Edit</button>
                <button onClick={() => deleteArticle(article)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-700"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
