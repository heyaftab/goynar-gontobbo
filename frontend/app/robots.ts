import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/assets/"],
      disallow: ["/account", "/cart", "/login", "/register", "/wishlist", "/search", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
