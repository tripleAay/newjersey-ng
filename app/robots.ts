import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin",
        "/auth",
        "/login",
        "/register",
        "/shop/account",
        "/shop/order",
        "/shop/cart",
        
        "/shop/search",
        "/checkout",
      ],
    },
    sitemap: "https://newjersey.ng/sitemap.xml",
  };
}