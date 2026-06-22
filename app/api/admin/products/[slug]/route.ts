import { NextResponse } from "next/server";
import type { ContentStatus, Product } from "@/lib/types";
import { getAdminSession } from "@/lib/supabase/auth";
import { supabaseRequest } from "@/lib/supabase/rest";

function productRow(product: Product, status: ContentStatus) {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    image: product.image,
    short_description: product.shortDescription,
    long_description: product.longDescription,
    price_range: product.priceRange,
    affiliate_links: product.affiliateLinks,
    rating: product.rating ?? null,
    pros: product.pros,
    cons: product.cons,
    best_for: product.bestFor,
    tags: product.tags,
    related_products: product.relatedProducts,
    seo_title: product.seoTitle,
    meta_description: product.metaDescription,
    featured: product.featured || false,
    status,
    updated_at: new Date().toISOString()
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await params;
  const { product, status = "draft" } = await request.json() as { product: Product; status?: ContentStatus };
  if (!product?.name || !product.slug || !product.affiliateLinks?.length) {
    return NextResponse.json({ error: "Name and affiliate link are required." }, { status: 400 });
  }
  try {
    await supabaseRequest(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      accessToken: session.accessToken,
      prefer: "return=minimal",
      body: productRow(product, status)
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not update product." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { slug } = await params;
  try {
    await supabaseRequest(`/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`, {
      method: "DELETE",
      accessToken: session.accessToken,
      prefer: "return=minimal"
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not delete product." }, { status: 400 });
  }
}

