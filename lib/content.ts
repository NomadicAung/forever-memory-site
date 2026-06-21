import { articles as demoArticles, products as demoProducts } from "./data";
import type { Article, Product } from "./types";
import { isSupabaseConfigured } from "./supabase/config";
import { supabaseRequest } from "./supabase/rest";

type ProductRow = {
  name: string;
  slug: string;
  category: Product["category"];
  brand: string;
  image: string;
  short_description: string;
  long_description: string;
  price_range: string;
  affiliate_links: Product["affiliateLinks"];
  rating: number | null;
  pros: string[];
  cons: string[];
  best_for: string;
  tags: string[];
  related_products: string[];
  seo_title: string;
  meta_description: string;
  featured: boolean;
};

type ArticleRow = {
  title: string;
  slug: string;
  type: Article["type"];
  category: Article["category"];
  excerpt: string;
  featured_image: string;
  pinterest_image: string;
  author: string;
  published_at: string | null;
  updated_at: string;
  sections: Article["sections"];
  comparison_rows: Article["comparisonRows"] | null;
  pros: string[] | null;
  cons: string[] | null;
  faqs: Article["faqs"];
  tags: string[];
  related_products: string[];
  seo_title: string;
  meta_description: string;
};

const productSelect = "name,slug,category,brand,image,short_description,long_description,price_range,affiliate_links,rating,pros,cons,best_for,tags,related_products,seo_title,meta_description,featured";
const articleSelect = "title,slug,type,category,excerpt,featured_image,pinterest_image,author,published_at,updated_at,sections,comparison_rows,pros,cons,faqs,tags,related_products,seo_title,meta_description";

function mapProduct(row: ProductRow): Product {
  return {
    name: row.name,
    slug: row.slug,
    category: row.category,
    brand: row.brand,
    image: row.image,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    priceRange: row.price_range,
    affiliateLinks: row.affiliate_links,
    rating: row.rating ?? undefined,
    pros: row.pros,
    cons: row.cons,
    bestFor: row.best_for,
    tags: row.tags,
    relatedProducts: row.related_products,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    featured: row.featured
  };
}

function mapArticle(row: ArticleRow): Article {
  return {
    title: row.title,
    slug: row.slug,
    type: row.type,
    category: row.category,
    excerpt: row.excerpt,
    featuredImage: row.featured_image,
    pinterestImage: row.pinterest_image,
    author: row.author,
    publishedAt: row.published_at || row.updated_at.slice(0, 10),
    updatedAt: row.updated_at.slice(0, 10),
    products: row.related_products,
    sections: row.sections,
    comparisonRows: row.comparison_rows || undefined,
    pros: row.pros || undefined,
    cons: row.cons || undefined,
    faqs: row.faqs,
    tags: row.tags,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description
  };
}

export async function getProductsFromContent(accessToken?: string): Promise<Product[]> {
  if (!isSupabaseConfigured) return demoProducts;
  try {
    const rows = await supabaseRequest<ProductRow[]>(`/rest/v1/products?select=${productSelect}&order=created_at.desc`, { accessToken });
    return rows.length > 0 || accessToken ? rows.map(mapProduct) : demoProducts;
  } catch {
    return demoProducts;
  }
}

export async function getArticlesFromContent(accessToken?: string): Promise<Article[]> {
  if (!isSupabaseConfigured) return demoArticles;
  try {
    const rows = await supabaseRequest<ArticleRow[]>(`/rest/v1/articles?select=${articleSelect}&order=created_at.desc`, { accessToken });
    return rows.length > 0 || accessToken ? rows.map(mapArticle) : demoArticles;
  } catch {
    return demoArticles;
  }
}

export async function getProductFromContent(slug: string) {
  const products = await getProductsFromContent();
  return products.find((product) => product.slug === slug);
}

export async function getArticleFromContent(slug: string) {
  const articles = await getArticlesFromContent();
  return articles.find((article) => article.slug === slug);
}
