export type CategorySlug = "kawaii" | "nostalgia" | "retro-gaming";
export type ContentStatus = "draft" | "published";

export type AffiliateLink = {
  store: "Amazon" | "eBay" | "Etsy" | "AliExpress" | "Other";
  label: string;
  url: string;
};

export type Product = {
  status?: ContentStatus;
  featured?: boolean;
  name: string;
  slug: string;
  category: CategorySlug;
  brand: string;
  image: string;
  galleryImages?: string[];
  aestheticTags?: string[];
  roomTypeTags?: string[];
  colorTags?: string[];
  shippingRegions?: string[];
  roomGlowUpEnabled?: boolean;
  availability?: "active" | "limited" | "unavailable";
  affiliateNetwork?: string;
  editorialPriority?: number;
  lastVerifiedAt?: string;
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

export type ArticleType = "best-of" | "review" | "comparison" | "memory" | "news";

export type Article = {
  status?: ContentStatus;
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

export type AnalyticsEvent = {
  eventType: "affiliate_click" | "outbound_click";
  productSlug?: string;
  productName?: string;
  store?: string;
  targetUrl?: string;
  pagePath?: string;
  referrer?: string;
  createdAt: string;
};

export type AnalyticsSummary = {
  totalClicks: number;
  todayClicks: number;
  topProducts: { label: string; clicks: number }[];
  topStores: { label: string; clicks: number }[];
  recentClicks: AnalyticsEvent[];
};

export type RoomGlowUpRecommendation = {
  category: string;
  title: string;
  reason: string;
  priority: number;
  suggestedColors: string[];
  placementSuggestion: string;
  estimatedBudgetMin: number;
  estimatedBudgetMax: number;
  searchTags: string[];
  safetyNote: string;
};

export type RoomGlowUpAnalysis = {
  id?: string;
  spaceType: string;
  aesthetic: string;
  budget: string;
  region: string;
  analysisConfidence: "low" | "medium" | "high";
  summary: string;
  positiveFeatures: string[];
  detectedColors: string[];
  detectedObjects: string[];
  constraints: string[];
  recommendations: RoomGlowUpRecommendation[];
  suggestedPalette: { name: string; hex: string }[];
  overallTips: string[];
  createdAt?: string;
};

export type RoomGlowUpProductMatch = {
  recommendationTitle: string;
  products: Product[];
};
