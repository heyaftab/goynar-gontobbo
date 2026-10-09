import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const queryParam = (await searchParams).q;
  const q = Array.isArray(queryParam) ? queryParam[0] ?? "" : queryParam ?? "";
  const query = q.trim().toLowerCase();
  const results = query ? await getProducts({ q }) : [];
  return <><form action="/search" className="max-w-xl mx-auto px-4 pt-12 flex gap-2"><label className="sr-only" htmlFor="q">Search jewellery</label><input id="q" name="q" defaultValue={q} placeholder="Search products" className="flex-1 border border-border bg-white px-4 py-3"/><button className="bg-gold px-5 text-white">Search</button></form><CatalogPage title={query ? `Search results for “${q}”` : "Search"} description={query ? `${results.length} product${results.length === 1 ? "" : "s"} found.` : "Enter a product or category to search."} products={results} /></>;
}
