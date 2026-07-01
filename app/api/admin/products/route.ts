import { NextResponse } from "next/server";
import type { Product } from "@/lib/types";
import { getAdminSession } from "@/lib/supabase/auth";
import { supabaseRequest } from "@/lib/supabase/rest";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { product, status = "draft" } = await request.json() as { product: Product; status?: "draft" | "published" };
  if (!product?.name || !product.slug || !product.affiliateLinks?.length) {
    return NextResponse.json({ error: "Name and affiliate link are required." }, { status: 400 });
  }

  try {
    await supabaseRequest("/rest/v1/products", {
      method: "POST",
      accessToken: session.accessToken,
      prefer: "return=minimal",
      body: {
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        image: product.image,
        gallery_images: product.galleryImages?.length ? product.galleryImages : [product.image].filter(Boolean),
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
        created_by: session.user.id
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save product." }, { status: 400 });
  }
}
