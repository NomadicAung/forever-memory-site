import type { Article, Category, Product } from "./types";

export const site = {
  name: "Forever Memory",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://forevermemory.xyz",
  tagline: "Discover products that bring back memories.",
  description:
    "Forever Memory helps people rediscover the products, characters, toys, games, and collectibles that bring back happy memories."
};

export const categories: Category[] = [
  {
    slug: "kawaii",
    name: "Kawaii Finds",
    description: "Cute gifts, cozy desk accessories, plushies, stationery, and character-inspired finds.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
    accent: "bg-pink-100"
  },
  {
    slug: "nostalgia",
    name: "Nostalgia",
    description: "Toys, school supplies, keepsakes, displays, and memory-soaked finds from happier times.",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
    accent: "bg-yellow-100"
  },
  {
    slug: "retro-gaming",
    name: "Retro Gaming",
    description: "Handhelds, cartridges, displays, cases, and accessories for game collectors.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    accent: "bg-cyan-100"
  }
];

const demoLinks = (name: string) => [
  { store: "Amazon" as const, label: "View on Amazon", url: `https://example.com/amazon/${name}` },
  { store: "eBay" as const, label: "View on eBay", url: `https://example.com/ebay/${name}` },
  { store: "Etsy" as const, label: "Shop handmade finds", url: `https://example.com/etsy/${name}` }
];

export const products: Product[] = [
  {
    name: "Pastel Character Desk Organizer",
    slug: "pastel-character-desk-organizer",
    category: "kawaii",
    brand: "Demo Kawaii Co.",
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A cheerful organizer for stationery, stickers, washi tape, and tiny desk treasures.",
    longDescription:
      "This pastel desk organizer is a flexible starter pick for kawaii desks, journaling corners, and cozy workspaces. Use it for pens, clips, memo pads, charms, and small collectibles.",
    priceRange: "$12-$25",
    affiliateLinks: demoLinks("pastel-character-desk-organizer"),
    rating: 4.6,
    pros: ["Cute giftable look", "Useful for stationery", "Affordable entry pick"],
    cons: ["Not for heavy supplies", "Designs vary by seller"],
    bestFor: "Kawaii desk setups and gift baskets",
    tags: ["kawaii", "stationery", "desk decor", "gifts"],
    relatedProducts: ["kawaii-wall-decor", "retro-sticker-variety-pack"],
    seoTitle: "Pastel Character Desk Organizer Review",
    metaDescription: "A cute pastel desk organizer pick for kawaii stationery, stickers, and small collectibles."
  },
  {
    featured: true,
    name: "Kawaii Wall Decor",
    slug: "kawaii-wall-decor",
    category: "kawaii",
    brand: "Amazon Marketplace",
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A cute wall decor pick for adding a playful kawaii touch to bedrooms, creative spaces, and cozy corners.",
    longDescription:
      "This kawaii wall decor is an easy way to bring more personality to a bedroom, workspace, vanity area, or reading corner. Check the current Amazon listing for exact dimensions, materials, included pieces, and mounting details before ordering.",
    priceRange: "Check latest price",
    affiliateLinks: [{ store: "Amazon", label: "View on Amazon", url: "https://amzn.to/3QsHLqm" }],
    pros: ["Cute room accent", "Easy decor update", "Works in several types of spaces"],
    cons: ["Check dimensions before buying", "Colors may look different on screen"],
    bestFor: "Kawaii bedrooms and creative spaces",
    tags: ["wall decor", "kawaii room", "bedroom decor", "gifts"],
    relatedProducts: ["pastel-character-desk-organizer", "acrylic-figure-display-risers"],
    seoTitle: "Kawaii Wall Decor for Cute and Cozy Rooms",
    metaDescription: "Discover a kawaii wall decor pick for bedrooms, workspaces, and cozy creative corners."
  },
  {
    name: "Retro Sticker Variety Pack",
    slug: "retro-sticker-variety-pack",
    category: "nostalgia",
    brand: "Memory Mail",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A colorful sticker pack inspired by school binders, lockers, notebooks, and toy boxes.",
    longDescription:
      "A low-cost nostalgia gift that works for scrapbooking, journals, laptops, water bottles, and party favors. Great for people who miss bright school-supply energy.",
    priceRange: "$6-$15",
    affiliateLinks: demoLinks("retro-sticker-variety-pack"),
    rating: 4.3,
    pros: ["Budget-friendly", "Easy stocking stuffer", "Great for journaling"],
    cons: ["Not official character art", "Sticker quality varies"],
    bestFor: "90s-themed gifts and party favors",
    tags: ["90s", "stickers", "stationery", "gifts"],
    relatedProducts: ["pastel-character-desk-organizer", "throwback-lunchbox-tin"],
    seoTitle: "Retro Sticker Variety Pack for 90s Kids",
    metaDescription: "A fun retro sticker pack for notebooks, laptops, journals, and nostalgic gift baskets."
  },
  {
    name: "Throwback Lunchbox Tin",
    slug: "throwback-lunchbox-tin",
    category: "nostalgia",
    brand: "Recess Goods",
    image: "https://images.unsplash.com/photo-1597843786411-a7fa8ad44a95?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A vintage-inspired tin for keepsakes, trading cards, photos, and desk storage.",
    longDescription:
      "A lunchbox-style tin is practical and memory-friendly. Use it for little collections, keepsake notes, craft supplies, or themed gifts.",
    priceRange: "$14-$35",
    affiliateLinks: demoLinks("throwback-lunchbox-tin"),
    rating: 4.5,
    pros: ["Strong nostalgia factor", "Useful storage", "Works as gift packaging"],
    cons: ["May dent in shipping", "Check dimensions"],
    bestFor: "90s kids and desk collectors",
    tags: ["90s", "storage", "lunchbox", "gifts"],
    relatedProducts: ["retro-sticker-variety-pack", "acrylic-figure-display-risers"],
    seoTitle: "Throwback Lunchbox Tin Gift Pick",
    metaDescription: "A nostalgic lunchbox tin for 90s-inspired storage, keepsakes, and gift sets."
  },
  {
    name: "Anbernic RG35XX Style Handheld",
    slug: "anbernic-rg35xx-style-handheld",
    category: "retro-gaming",
    brand: "Anbernic",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A compact vertical retro handheld for classic-style gaming on the go.",
    longDescription:
      "This handheld format is popular with retro gaming fans who want a compact device with a familiar layout. Always verify seller, storage, firmware, and legal game library details before buying.",
    priceRange: "$45-$85",
    affiliateLinks: demoLinks("anbernic-rg35xx-style-handheld"),
    rating: 4.7,
    pros: ["Portable size", "Strong collector appeal", "Good gift category"],
    cons: ["Listings can vary", "Requires buyer research"],
    bestFor: "Retro gaming beginners",
    tags: ["retro gaming", "handheld", "gaming gifts", "emulation"],
    relatedProducts: ["miyoo-mini-plus-style-handheld", "retro-handheld-carrying-case"],
    seoTitle: "Anbernic RG35XX Style Handheld Review",
    metaDescription: "A practical overview of a compact retro gaming handheld for collectors and gift buyers."
  },
  {
    name: "Miyoo Mini Plus Style Handheld",
    slug: "miyoo-mini-plus-style-handheld",
    category: "retro-gaming",
    brand: "Miyoo",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A pocketable handheld style loved by retro game fans and display shelf collectors.",
    longDescription:
      "The Miyoo Mini Plus style is a favorite topic in retro handheld comparisons thanks to its small footprint and community interest. Confirm current models and seller reputation before purchase.",
    priceRange: "$50-$95",
    affiliateLinks: demoLinks("miyoo-mini-plus-style-handheld"),
    rating: 4.6,
    pros: ["Compact and cute", "Popular comparison pick", "Strong community support"],
    cons: ["Availability changes", "Small form may not suit everyone"],
    bestFor: "Pocket retro handheld fans",
    tags: ["retro gaming", "handheld", "miyoo", "collectors"],
    relatedProducts: ["anbernic-rg35xx-style-handheld", "retro-handheld-carrying-case"],
    seoTitle: "Miyoo Mini Plus Style Handheld Overview",
    metaDescription: "A demo product entry for a pocket retro handheld style popular with collectors."
  },
  {
    name: "Retro Handheld Carrying Case",
    slug: "retro-handheld-carrying-case",
    category: "retro-gaming",
    brand: "Game Pouch Lab",
    image: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Protects compact handhelds, cables, screen cloths, and memory cards.",
    longDescription:
      "A simple carrying case is one of the easiest companion buys for retro handhelds. Look for a snug fit, soft lining, and enough space for a charging cable.",
    priceRange: "$10-$22",
    affiliateLinks: demoLinks("retro-handheld-carrying-case"),
    rating: 4.5,
    pros: ["Affordable add-on", "Protects devices", "Good bundle item"],
    cons: ["Fit varies by model", "Some cases are bulky"],
    bestFor: "Handheld owners",
    tags: ["retro gaming", "case", "accessories"],
    relatedProducts: ["anbernic-rg35xx-style-handheld", "miyoo-mini-plus-style-handheld"],
    seoTitle: "Best Retro Handheld Carrying Case",
    metaDescription: "A compact carrying case recommendation for retro gaming handheld accessories."
  },
  {
    name: "Acrylic Figure Display Risers",
    slug: "acrylic-figure-display-risers",
    category: "nostalgia",
    brand: "Clear Case Co.",
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "Tiered risers that make small figures, blind boxes, and mini collectibles easier to see.",
    longDescription:
      "Acrylic risers turn crowded shelves into cleaner displays. They are especially useful for mini figures, blind boxes, small plushies, and toy photography.",
    priceRange: "$12-$30",
    affiliateLinks: demoLinks("acrylic-figure-display-risers"),
    rating: 4.8,
    pros: ["Improves shelf visibility", "Works with many collections", "Clean look"],
    cons: ["Can scratch", "Needs dusting"],
    bestFor: "Figure and blind box collectors",
    tags: ["display", "collectors", "figures", "blind boxes"],
    relatedProducts: ["led-display-case-for-collectibles", "kawaii-wall-decor"],
    seoTitle: "Acrylic Figure Display Risers for Collectors",
    metaDescription: "Tiered acrylic risers for displaying figures, blind boxes, and mini collectibles."
  },
  {
    name: "LED Display Case for Collectibles",
    slug: "led-display-case-for-collectibles",
    category: "nostalgia",
    brand: "Glow Shelf",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1000&q=80",
    shortDescription: "A lighted display case for figures, cartridges, die-cast cars, and tiny treasures.",
    longDescription:
      "LED display cases add polish and protection to small collections. They are best for pieces you want to keep visible while reducing dust.",
    priceRange: "$30-$90",
    affiliateLinks: demoLinks("led-display-case-for-collectibles"),
    rating: 4.6,
    pros: ["Display-ready lighting", "Dust protection", "Premium gift feel"],
    cons: ["Higher price", "Measure shelf depth first"],
    bestFor: "Display-focused collectors",
    tags: ["display case", "collectibles", "figures", "storage"],
    relatedProducts: ["acrylic-figure-display-risers", "throwback-lunchbox-tin"],
    seoTitle: "LED Display Case for Collectibles",
    metaDescription: "A lighted display case pick for figures, cartridges, and collectible shelves."
  }
];

export const articles: Article[] = [
  {
    title: "Best Kawaii Gifts for Adults",
    slug: "best-kawaii-gifts-for-adults",
    type: "best-of",
    category: "gift-guides",
    excerpt: "Cute, useful, and display-worthy kawaii gift ideas that still feel grown-up.",
    featuredImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
    pinterestImage: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80",
    author: "Forever Memory Editors",
    publishedAt: "2026-01-12",
    updatedAt: "2026-06-01",
    products: ["pastel-character-desk-organizer", "kawaii-wall-decor", "retro-sticker-variety-pack"],
    sections: [
      { heading: "What makes a kawaii gift work?", body: "The best kawaii gifts combine charm with daily usefulness: desk storage, cozy room accents, stationery, plush displays, and small treats that feel personal." },
      { heading: "How to choose", body: "Match the gift to the recipient's space. Desk people love organizers and memo pads. Collectors usually appreciate shelves, risers, and anything that helps display a favorite character." }
    ],
    pros: ["Easy to personalize", "Works across many budgets", "Strong visual appeal for Pinterest"],
    cons: ["Licensed character availability changes", "Quality varies between marketplace sellers"],
    faqs: [
      { question: "Are kawaii gifts only for kids?", answer: "No. Many kawaii products are made for adult desks, apartments, journals, shelves, and everyday routines." },
      { question: "What is a safe first kawaii gift?", answer: "Stationery, plush display shelves, and small desk organizers are usually easy wins." }
    ],
    tags: ["kawaii gifts", "gift guide", "cute products"],
    seoTitle: "Best Kawaii Gifts for Adults | Forever Memory",
    metaDescription: "Cute and practical kawaii gift ideas for adults, including desk decor, plush displays, and stationery."
  },
  {
    title: "Best Retro Gaming Handhelds for Nostalgia",
    slug: "best-retro-gaming-handhelds",
    type: "best-of",
    category: "retro-gaming",
    excerpt: "Compact handheld-style picks and accessories for people who miss classic portable gaming.",
    featuredImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    pinterestImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=80",
    author: "Forever Memory Editors",
    publishedAt: "2026-02-07",
    updatedAt: "2026-06-03",
    products: ["anbernic-rg35xx-style-handheld", "miyoo-mini-plus-style-handheld", "retro-handheld-carrying-case"],
    sections: [
      { heading: "Start with the form factor", body: "Vertical handhelds feel familiar to many 90s kids, while smaller devices are easier to pocket. Bigger screens are nicer for long play sessions." },
      { heading: "Check before buying", body: "Always check the exact model, included storage, seller reviews, return policy, and whether the device meets your legal and technical expectations." }
    ],
    faqs: [
      { question: "Which retro handheld is best for beginners?", answer: "A compact, well-reviewed vertical handheld is usually the easiest place to start." },
      { question: "Should I buy a case too?", answer: "Yes, a small carrying case is a practical add-on if the handheld will leave the house." }
    ],
    tags: ["retro handhelds", "retro gaming", "gift guide"],
    seoTitle: "Best Retro Gaming Handhelds for Nostalgia",
    metaDescription: "A beginner-friendly guide to retro gaming handhelds and useful accessories."
  },
  {
    title: "Miyoo Mini Plus vs Anbernic RG35XX",
    slug: "miyoo-mini-plus-vs-anbernic-rg35xx",
    type: "comparison",
    category: "retro-gaming",
    excerpt: "A practical comparison template for two popular retro handheld styles.",
    featuredImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1200&q=80",
    pinterestImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
    author: "Forever Memory Editors",
    publishedAt: "2026-03-02",
    updatedAt: "2026-06-05",
    products: ["miyoo-mini-plus-style-handheld", "anbernic-rg35xx-style-handheld"],
    sections: [
      { heading: "Quick verdict", body: "Pick the Miyoo-style device if you want the smallest shelf-friendly option. Pick the Anbernic-style device if you prefer a slightly more familiar vertical handheld feel." },
      { heading: "Buyer note", body: "Model revisions, prices, and availability change often, so treat the product cards as editable placeholders for your current affiliate partners." }
    ],
    comparisonRows: [
      { feature: "Best for", left: "Pocket-first collectors", right: "Beginner retro gamers" },
      { feature: "Gift appeal", left: "Cute and compact", right: "Classic handheld shape" },
      { feature: "Buying caution", left: "Availability changes quickly", right: "Listings vary by bundle" }
    ],
    faqs: [
      { question: "Which one is more giftable?", answer: "Both can work. The better choice depends on hand size, screen preference, and the recipient's comfort with setup." }
    ],
    tags: ["miyoo", "anbernic", "comparison"],
    seoTitle: "Miyoo Mini Plus vs Anbernic RG35XX",
    metaDescription: "Compare two popular retro handheld styles with product cards, pros, cons, and buyer notes."
  },
  {
    title: "Best Display Cases for Collectors",
    slug: "best-display-cases-for-collectors",
    type: "review",
    category: "nostalgia",
    excerpt: "Display case and riser ideas for figures, blind boxes, cartridges, and tiny treasures.",
    featuredImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1200&q=80",
    pinterestImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=900&q=80",
    author: "Forever Memory Editors",
    publishedAt: "2026-04-10",
    updatedAt: "2026-06-06",
    products: ["led-display-case-for-collectibles", "acrylic-figure-display-risers"],
    sections: [
      { heading: "Display first, storage second", body: "Collectors usually need two things: visibility and protection. Risers solve visibility. Enclosed cases help with dust." },
      { heading: "Measure before you buy", body: "Measure shelf width, height, and depth. Then measure your tallest figure or boxed collectible before choosing a case." }
    ],
    pros: ["Makes collections easier to enjoy", "Good add-on category", "Strong internal links to many niches"],
    cons: ["Dimensions matter", "Acrylic needs cleaning"],
    faqs: [
      { question: "Are acrylic risers worth it?", answer: "Yes, they are one of the simplest upgrades for crowded shelves." },
      { question: "Do LED display cases need power?", answer: "Many do, so check whether a case uses USB, batteries, or a wall plug." }
    ],
    tags: ["display cases", "collectors", "review"],
    seoTitle: "Best Display Cases for Collectors",
    metaDescription: "Collector display case ideas for figures, cartridges, blind boxes, and keepsakes."
  },
  {
    title: "90s Toys You Can Still Buy",
    slug: "90s-toys-you-can-still-buy",
    type: "memory",
    category: "nostalgia",
    excerpt: "A memory-first guide to modern finds that echo the toy boxes, lockers, and bedrooms of the 90s.",
    featuredImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80",
    pinterestImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=900&q=80",
    author: "Forever Memory Editors",
    publishedAt: "2026-05-04",
    updatedAt: "2026-06-08",
    products: ["retro-sticker-variety-pack", "throwback-lunchbox-tin"],
    sections: [
      { heading: "Why 90s products still hit", body: "The colors, packaging, textures, and school-day rituals are often the memory trigger. That makes small products surprisingly powerful gift ideas." },
      { heading: "Build a themed basket", body: "Combine stickers, a tin, candy-style treats, a small plush, and a handwritten note for a low-cost nostalgia gift." }
    ],
    faqs: [
      { question: "What is an easy 90s nostalgia gift?", answer: "A themed tin with stickers, stationery, and small colorful items is easy to customize." }
    ],
    tags: ["90s toys", "nostalgia", "memory articles"],
    seoTitle: "90s Toys You Can Still Buy",
    metaDescription: "Modern nostalgia products and gift ideas inspired by classic 90s toys and school memories."
  }
];

export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
export const productsByCategory = (slug: string) => products.filter((product) => product.category === slug);
export const articlesByCategory = (slug: string) => articles.filter((article) => article.category === slug);
