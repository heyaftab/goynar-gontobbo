import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/data/catalog-api";
import { absoluteUrl } from "@/lib/seo";

const publicPages = [
  ["", 1], ["shop", 0.9], ["categories", 0.8], ["new-arrivals", 0.7], ["best-sellers", 0.7],
  ["about", 0.5], ["story", 0.5], ["contact", 0.4], ["faq", 0.4], ["shipping", 0.3],
  ["returns", 0.3], ["size-guide", 0.3],
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    ...publicPages.map(([path, priority]) => ({
      url: absoluteUrl(path ? `/${path}` : "/"),
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...categories.map((category) => ({ url: absoluteUrl(`/categories/${category.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((product) => ({ url: absoluteUrl(`/products/${product.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
