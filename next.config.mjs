const nextConfig = {
  turbopack: {
    root: import.meta.dirname
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
