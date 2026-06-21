export type CategorySlug = "kawaii" | "nostalgia" | "retro-gaming";

export type AffiliateLink = {
  store: "Amazon" | "eBay" | "Etsy" | "AliExpress" | "Other";
  label: string;
  url: string;
};

export type Product = {
  featured?: boolean;
  name: string;
  slug: string;
  category: CategorySlug;
  brand: string;
  image: string;
  shortDescription: string;
  longDescription: string;
  priceRange: string;
  affiliateLinks: AffiliateLink[];
  rating?: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  tags: string[];
  relatedProducts: string[];
  seoTitle: string;
  metaDescription: string;
};

export type ArticleType = "best-of" | "review" | "comparison" | "memory";

export type Article = {
  title: string;
  slug: string;
  type: ArticleType;
  category: CategorySlug | "gift-guides";
  excerpt: string;
  featuredImage: string;
  pinterestImage: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  products: string[];
  sections: { heading: string; body: string }[];
  comparisonRows?: { feature: string; left: string; right: string }[];
  pros?: string[];
  cons?: string[];
  faqs: { question: string; answer: string }[];
  tags: string[];
  seoTitle: string;
  metaDescription: string;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  accent: string;
};
