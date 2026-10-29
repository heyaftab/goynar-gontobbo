import type { Category, Product } from "@/types";
import { categories as mockCategories } from "@/data/mock-categories";
import { mockProducts } from "@/data/mock-products";
import { loadWorkspace } from "@/lib/demo-data";
import { getLaravelApiUrl } from "@/lib/laravel-api-url";

type Filters = { q?: string; category?: string; newArrivals?: boolean; bestSellers?: boolean };
type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  compare_at_price?: number | string | null;
  description?: string | null;
  stock_quantity: number;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  category?: { name: string; slug: string };
  images?: { image_url: string }[];
};

const apiBase = getLaravelApiUrl();
const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL?.replace(/\/$/, "");
const placeholder = "/jewellery-placeholder.svg";

function resolveImageUrl(imageUrl: string): string {
  if (/^(https?:)?\/\//i.test(imageUrl) || imageUrl.startsWith("data:")) return imageUrl;
  // Seeded catalog image paths refer to frontend/public assets. When the API
  // and storefront are deployed separately, serve those paths from the store.
  if (storefrontBase && imageUrl.startsWith("/assets/")) return `${storefrontBase}${imageUrl}`;
  return imageUrl;
}

function toProduct(item: ApiProduct): Product {
  const localProduct = mockProducts.find((product) => product.slug === item.slug);
  const apiImages = item.images?.map(({ image_url }) => resolveImageUrl(image_url)).filter((image) => Boolean(image) && image !== placeholder) ?? [];
  return {
    id: String(item.id),
    name: item.name,
    slug: item.slug,
    price: Number(item.price),
    originalPrice: item.compare_at_price == null ? undefined : Number(item.compare_at_price),
    currency: "৳",
    images: apiImages.length ? apiImages : localProduct?.images ?? [placeholder],
    category: item.category?.name ?? "Jewellery",
    categorySlug: item.category?.slug ?? "",
    isNewArrival: item.is_new_arrival ?? false,
    isBestSeller: item.is_best_seller ?? false,
    inStock: item.stock_quantity > 0,
    description: item.description ?? undefined,
  };
}

function fromMock(filters: Filters): Product[] {
  let products = loadWorkspace().products;
  if (filters.category) products = products.filter((item) => item.categorySlug === filters.category);
  if (filters.newArrivals) products = products.filter((item) => item.isNewArrival);
  if (filters.bestSellers) products = products.filter((item) => item.isBestSeller);
  if (filters.q) {
    const query = filters.q.toLowerCase();
    products = products.filter((item) => `${item.name} ${item.category} ${item.description ?? ""}`.toLowerCase().includes(query));
  }
  return products;
}

export async function getProducts(filters: Filters = {}): Promise<Product[]> {
  if (!apiBase) return fromMock(filters);
  const query = new URLSearchParams({ per_page: "100" });
  if (filters.q) query.set("q", filters.q);
  if (filters.category) query.set("category", filters.category);
  if (filters.newArrivals) query.set("new_arrivals", "1");
  if (filters.bestSellers) query.set("best_sellers", "1");
  try {
    const response = await fetch(`${apiBase}/api/v1/products?${query}`, { next: { revalidate: 60 } });
    if (!response.ok) return fromMock(filters);
    const result = await response.json() as { data: ApiProduct[] };
    return result.data.map(toProduct);
  } catch {
    return fromMock(filters);
  }
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  if (!apiBase) return loadWorkspace().products.find((item) => item.slug === slug);
  try {
    const response = await fetch(`${apiBase}/api/v1/products/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (!response.ok) return loadWorkspace().products.find((item) => item.slug === slug);
    return toProduct(await response.json() as ApiProduct);
  } catch {
    return loadWorkspace().products.find((item) => item.slug === slug);
  }
}

export async function getCategories(): Promise<Category[]> {
  if (!apiBase) return mockCategories;
  try {
    const response = await fetch(`${apiBase}/api/v1/categories`, { next: { revalidate: 60 } });
    if (!response.ok) return mockCategories;
    const result = await response.json() as { id: number; name: string; slug: string; image?: string | null; products_count?: number }[];
    return result.map((item) => ({
      id: String(item.id),
      name: item.name,
      slug: item.slug,
      image: item.image && item.image !== placeholder ? resolveImageUrl(item.image) : mockCategories.find((category) => category.slug === item.slug)?.image || placeholder,
      productCount: item.products_count ?? 0,
    }));
  } catch {
    return mockCategories;
  }
}
