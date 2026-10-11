"use client";

import { useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import type { Product } from "@/types";

function editDistanceAtMostOne(left: string, right: string): boolean {
  if (Math.abs(left.length - right.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) { i++; j++; continue; }
    edits++;
    if (edits > 1) return false;
    if (left.length > right.length) i++;
    else if (right.length > left.length) j++;
    else { i++; j++; }
  }
  if (i < left.length || j < right.length) edits++;
  return edits <= 1;
}

function scoreProduct(product: Product, query: string): number {
  const q = query.toLocaleLowerCase().trim();
  if (!q) return 0;
  const name = product.name.toLocaleLowerCase();
  const category = product.category.toLocaleLowerCase();
  const description = (product.description ?? "").toLocaleLowerCase();
  const all = `${name} ${category} ${description}`;
  let score = 0;

  if (name === q) score += 150;
  else if (name.startsWith(q)) score += 100;
  else if (name.includes(q)) score += 75;
  if (category === q) score += 85;
  else if (category.includes(q)) score += 55;
  if (description.includes(q)) score += 20;

  const fields = [name, category, description].filter(Boolean);
  for (const token of q.split(/\s+/).filter((part) => part.length > 1)) {
    const words = all.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    if (words.some((word) => word === token)) score += 30;
    else if (words.some((word) => word.startsWith(token))) score += 20;
    else if (words.some((word) => word.includes(token))) score += 10;
    else if (token.length >= 5 && words.some((word) => editDistanceAtMostOne(word, token))) score += 7;
  }
  return fields.length ? score : 0;
}

export function SearchExperience({ products, initialQuery = "" }: { products: Product[]; initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const normalizedQuery = query.trim();
  const categories = useMemo(() => ["All pieces", ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const ranked = useMemo(() => products
    .map((product) => ({ product, score: scoreProduct(product, normalizedQuery) }))
    .filter(({ score }) => !normalizedQuery || score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
    .map(({ product }) => product), [products, normalizedQuery]);
  const visibleProducts = ranked.filter((product) =>
    (activeCategory === "All pieces" || product.category === activeCategory) && (!inStockOnly || product.inStock),
  );
  const suggestions = normalizedQuery ? visibleProducts.slice(0, 4) : [];
  const popular = useMemo(() => products.filter((product) => product.isBestSeller).slice(0, 4), [products]);

  function rememberSearch(value: string) {
    if (!value) return;
    try {
      const recent = JSON.parse(localStorage.getItem("gg-recent-searches") ?? "[]") as string[];
      localStorage.setItem("gg-recent-searches", JSON.stringify([value, ...recent.filter((item) => item !== value)].slice(0, 5)));
    } catch {
      localStorage.setItem("gg-recent-searches", JSON.stringify([value]));
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      router.push(`/products/${suggestions[activeSuggestion].slug}`);
      return;
    }
    const value = normalizedQuery;
    rememberSearch(value);
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  function chooseSearch(value: string) {
    setQuery(value);
    setActiveCategory("All pieces");
    rememberSearch(value.trim());
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  const popularTerms = ["jhumka", "pearl", "bangles", "kundan", "earrings"];

  return (
    <section className="search-shell relative isolate overflow-hidden bg-gradient-to-b from-cream via-ivory to-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/2 -z-10 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl animate-search-glow motion-reduce:animate-none" />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <p className="animate-search-rise text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark">Find your favourite</p>
          <h1 className="animate-search-rise mt-3 font-heading text-4xl text-dark [animation-delay:80ms] sm:text-5xl">A little sparkle, just right</h1>
          <p className="animate-search-rise mx-auto mt-4 max-w-xl text-sm leading-6 text-muted [animation-delay:140ms]">Search by style, stone, or type. We’ll bring the closest pieces to the top.</p>

          <form onSubmit={submitSearch} role="search" className="animate-search-rise group relative mt-8 [animation-delay:200ms]">
            <label htmlFor="product-search" className="sr-only">Search jewellery</label>
            <div className="relative flex overflow-hidden rounded-2xl border border-border bg-white shadow-[0_12px_50px_rgba(49,39,22,0.08)] transition duration-300 focus-within:border-gold focus-within:shadow-[0_16px_55px_rgba(184,134,11,0.16)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="ml-4 mt-4 h-5 w-5 shrink-0 text-gold-dark transition-transform duration-300 group-focus-within:scale-110"><circle cx="10.8" cy="10.8" r="6.8"/><path strokeLinecap="round" d="m16 16 4.5 4.5"/></svg>
              <input id="product-search" type="search" role="combobox" aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls="search-suggestions" aria-activedescendant={activeSuggestion >= 0 ? `search-suggestion-${activeSuggestion}` : undefined} autoComplete="off" value={query} onChange={(event) => { setQuery(event.target.value); setActiveCategory("All pieces"); setActiveSuggestion(-1); }} onKeyDown={(event) => {
                if (event.key === "ArrowDown" && suggestions.length) { event.preventDefault(); setActiveSuggestion((current) => Math.min(current + 1, suggestions.length - 1)); }
                if (event.key === "ArrowUp" && suggestions.length) { event.preventDefault(); setActiveSuggestion((current) => Math.max(current - 1, -1)); }
                if (event.key === "Escape") { setQuery(""); setActiveSuggestion(-1); }
              }} placeholder="Try ‘pearl earrings’ or ‘gold bangles’" className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-dark outline-none placeholder:text-muted/70 sm:text-base" />
              {query && <button type="button" onClick={() => { setQuery(""); setActiveCategory("All pieces"); }} className="my-2 mr-2 rounded-full px-3 text-xl text-muted transition hover:bg-cream hover:text-dark" aria-label="Clear search">×</button>}
              <button type="submit" className="m-1.5 hidden shrink-0 rounded-xl bg-charcoal px-5 text-sm font-semibold text-white transition duration-200 hover:bg-gold-dark sm:inline-flex sm:items-center">Search</button>
            </div>
            {suggestions.length > 0 && (
              <ul id="search-suggestions" role="listbox" className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-border bg-white text-left shadow-2xl">
              {suggestions.map((product, index) => <li key={product.id} id={`search-suggestion-${index}`} role="option" aria-selected={index === activeSuggestion} style={{ animationDelay: `${index * 45}ms` }} className={`animate-search-rise border-b border-border last:border-0 ${index === activeSuggestion ? "bg-cream" : ""}`}><Link href={`/products/${product.slug}`} className="flex items-center gap-3 px-4 py-3 transition hover:bg-cream"><span className="relative h-12 w-10 overflow-hidden rounded bg-cream"><Image src={product.images[0] || "/jewellery-placeholder.svg"} alt="" fill sizes="40px" className="object-cover" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-dark">{product.name}</span><span className="text-xs text-muted">{product.category}</span></span><span className="text-sm font-medium text-charcoal">{product.currency}{product.price.toLocaleString()}</span></Link></li>)}
              </ul>
            )}
          </form>

          <div className="animate-search-rise mt-5 flex flex-wrap items-center justify-center gap-2 [animation-delay:260ms]">
            <span className="mr-1 text-xs text-muted">Popular:</span>
            {popularTerms.map((term) => <button key={term} type="button" onClick={() => chooseSearch(term)} className="rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs text-charcoal transition duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:bg-white hover:text-gold-dark">{term}</button>)}
          </div>
        </header>

        {normalizedQuery ? (
          <div className="mt-12 animate-search-rise">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">{visibleProducts.length ? "Best matches" : "No exact matches"}</p>
                <h2 className="mt-1 font-heading text-2xl text-dark sm:text-3xl">{visibleProducts.length ? <>Results for <span className="text-gold-dark">“{normalizedQuery}”</span></> : "Let’s try another search"}</h2>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="accent-gold" />In stock only</label>
            </div>
            <div className="mb-7 flex gap-2 overflow-x-auto pb-2" aria-label="Filter by category">
              {categories.map((category) => <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-xs transition duration-200 ${activeCategory === category ? "bg-charcoal text-white shadow-md" : "border border-border bg-white/70 text-charcoal hover:border-gold/50 hover:text-gold-dark"}`}>{category}</button>)}
            </div>
            {visibleProducts.length ? <ProductGrid products={visibleProducts} /> : <div className="rounded-2xl border border-border bg-white/70 px-6 py-10 text-center"><p className="text-sm text-muted">Try a shorter phrase, a category, or a popular search above.</p><button type="button" onClick={() => { setQuery(""); setInStockOnly(false); setActiveCategory("All pieces"); }} className="mt-4 text-sm font-semibold text-gold-dark underline underline-offset-4">Clear filters</button></div>}
          </div>
        ) : (
          <div className="mt-14 animate-search-rise [animation-delay:320ms]">
            <div className="mb-6 flex items-end justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">A good place to start</p><h2 className="mt-1 font-heading text-2xl text-dark sm:text-3xl">Popular right now</h2></div><Link href="/best-sellers" className="text-xs font-semibold text-gold-dark underline underline-offset-4">View best sellers</Link></div>
            <ProductGrid products={popular} />
          </div>
        )}

      </div>
    </section>
  );
}
