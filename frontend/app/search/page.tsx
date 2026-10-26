import { SearchExperience } from "@/components/SearchExperience";
import { getProducts } from "@/data/catalog-api";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const queryParam = (await searchParams).q;
  const q = Array.isArray(queryParam) ? queryParam[0] ?? "" : queryParam ?? "";
  const products = await getProducts();
  return <SearchExperience products={products} initialQuery={q} />;
}
