import type { MetadataRoute } from "next";
import { categories, site } from "@/lib/data";
import { getArticlesFromContent, getProductsFromContent } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, products] = await Promise.all([getArticlesFromContent(), getProductsFromContent()]);
  const staticRoutes = [
    "",
    "/gift-guides",
    "/product-reviews",
    "/comparison-articles",
    "/blog",
    "/about",
    "/contact",
    "/affiliate-disclosure",
    "/privacy-policy"
  ].map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() }));

  return [
    ...staticRoutes,
    ...categories.map((category) => ({ url: `${site.url}/categories/${category.slug}`, lastModified: new Date() })),
    ...products.map((product) => ({ url: `${site.url}/products/${product.slug}`, lastModified: new Date() })),
    ...articles.map((article) => ({ url: `${site.url}/articles/${article.slug}`, lastModified: new Date(article.updatedAt) }))
  ];
}
