import { NextResponse } from "next/server";
import type { Article } from "@/lib/types";
import { getAdminSession } from "@/lib/supabase/auth";
import { supabaseRequest } from "@/lib/supabase/rest";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { article, status = "draft" } = await request.json() as { article: Article; status?: "draft" | "published" };
  if (!article?.title || !article.slug || !article.sections?.length) {
    return NextResponse.json({ error: "Title and article body are required." }, { status: 400 });
  }

  try {
    await supabaseRequest("/rest/v1/articles", {
      method: "POST",
      accessToken: session.accessToken,
      prefer: "return=minimal",
      body: {
        title: article.title,
        slug: article.slug,
        type: article.type,
        category: article.category,
        excerpt: article.excerpt,
        featured_image: article.featuredImage,
        pinterest_image: article.pinterestImage,
        author: article.author,
        published_at: status === "published" ? article.publishedAt : null,
        sections: article.sections,
        comparison_rows: article.comparisonRows || null,
        pros: article.pros || null,
        cons: article.cons || null,
        faqs: article.faqs,
        tags: article.tags,
        related_products: article.products,
        seo_title: article.seoTitle,
        meta_description: article.metaDescription,
        status,
        created_by: session.user.id
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save article." }, { status: 400 });
  }
}

