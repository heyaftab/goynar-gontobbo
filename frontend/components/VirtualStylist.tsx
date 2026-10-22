"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { categories } from "@/data/mock-categories";
import type { Product } from "@/types";
import { motionIndex } from "@/lib/motion";

const slots = [
  { key: "earrings", label: "Earrings" },
  { key: "necklaces", label: "Necklace" },
  { key: "bangles", label: "Bangles" },
];

const categoryOrder = ["earrings", "necklaces", "bangles", "rings", "jhumka", "cuffs", "tana", "sets"];

export function VirtualStylist({ products }: { products: Product[] }) {
  const initial = useMemo(() => ({
    earrings: products.find((item) => item.categorySlug === "earrings" || item.categorySlug === "jhumka") ?? products[0],
    necklaces: products.find((item) => item.categorySlug === "necklaces" || item.categorySlug === "tana") ?? products[1],
    bangles: products.find((item) => item.categorySlug === "bangles" || item.categorySlug === "cuffs") ?? products[2],
  }), [products]);
  const [worn, setWorn] = useState<Record<string, Product | undefined>>(initial);
  const [activeCategory, setActiveCategory] = useState("earrings");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function choose(product: Product) {
    setSelectedProduct(product);
    const slot = slots.find((item) => item.key === product.categorySlug);
    if (slot) setWorn((current) => ({ ...current, [slot.key]: product }));
  }

  const category = categories.find((item) => item.slug === activeCategory) ?? categories[0];
  const categoryProducts = products.filter((product) => product.categorySlug === activeCategory);
  const featured = selectedProduct ?? categoryProducts[0] ?? worn.earrings;
  const orderedCategories = categoryOrder
    .map((slug) => categories.find((item) => item.slug === slug))
    .filter((item): item is (typeof categories)[number] => Boolean(item));

  return (
    <section className="stylist-shell overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-dark">The Goynar Gontobbo experience</p>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-tight text-dark sm:text-5xl">A little gold.<br /><span className="text-gold">A lot of you.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">Explore the details. Tap a piece to find more in its collection, then style the look your way.</p>
        </div>

        <div className="stylist-panel grid overflow-hidden rounded-[1.75rem] border lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
          <div className="stylist-stage relative min-h-[380px] overflow-hidden sm:min-h-[500px] lg:min-h-[660px]">
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(115deg,transparent 35%,rgba(232,203,153,.16) 50%,transparent 65%)" }} />
            <div key={featured?.id} className="stylist-enter absolute inset-5 overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] border border-white/20 shadow-[0_35px_90px_rgba(0,0,0,.48),0_0_40px_rgba(201,169,110,.12)] ring-1 ring-[#d2b36c]/20 sm:inset-x-[12%] sm:inset-y-8">
              {featured?.images[0] && <Image src={featured.images[0]} alt={`${featured.name} worn in a styling photo`} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="stylist-photo object-cover object-center" />}
              <div className="stylist-photo-grade absolute inset-0" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
                <p className="text-[9px] uppercase tracking-[.22em] text-[#e3c887]">{selectedProduct?.category ?? category.name}</p>
                <p className="mt-1 max-w-[75%] truncate font-heading text-lg text-white sm:text-xl">{featured?.name}</p>
              </div>
            </div>

            <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[9px] uppercase tracking-[.2em] text-white/60 backdrop-blur">Styled for you</div>
          </div>

          <aside className="stylist-aside relative flex min-h-[520px] flex-col border-t p-6 sm:p-8 lg:border-l lg:border-t-0">
            <div className="stylist-scroll-pattern" aria-hidden="true" />
            <p className="text-[9px] uppercase tracking-[.28em] text-gold-dark">Curated to complement</p>
            <h3 className="mt-3 font-heading text-2xl text-dark">Your look, in the details</h3>
            <p className="mt-2 text-xs leading-5 text-muted">Choose a category, then scroll its pieces below to find your favourite.</p>
            <div aria-label="Jewellery categories" className="stylist-options-scroll relative z-[1] mt-7 max-h-[238px] w-[84%] space-y-3 overflow-y-auto overscroll-contain pr-2 lg:w-[88%]">
              {orderedCategories.map((item) => {
                const product = products.find((entry) => entry.categorySlug === item.slug);
                const isActive = activeCategory === item.slug;
                return <button key={item.slug} type="button" data-motion={motionIndex(`category-${item.slug}`)} aria-pressed={isActive} onClick={() => { setActiveCategory(item.slug); setSelectedProduct(null); }} className={`stylist-category flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${isActive ? "is-active" : ""}`}>
                  <span className="stylist-thumb relative h-14 w-12 shrink-0 overflow-hidden rounded-lg"><Image src={product?.images[0] ?? item.image ?? "/jewellery-placeholder.svg"} alt="" fill sizes="48px" className="object-cover" /></span>
                  <span className="min-w-0 flex-1"><span className="block text-[9px] uppercase tracking-[.16em] text-muted">{item.name}</span><span className="mt-1 block truncate text-xs font-medium">{product?.name ?? `Explore ${item.name}`}</span></span>
                  {product ? <Link href={`/products/${product.slug}`} aria-label={`Quick view ${product.name}`} onClick={(event) => event.stopPropagation()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-gold transition hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">↗</Link> : <span className="pr-2 text-gold">↗</span>}
                </button>;
              })}
            </div>
            <div className="stylist-products mt-6 border-t pt-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[9px] uppercase tracking-[.24em] text-gold-dark">{category.name} collection</p>
                <span className="text-[10px] text-muted">{category.productCount} pieces</span>
              </div>
              {categoryProducts.length ? <div className="stylist-options-scroll relative z-[1] grid max-h-[330px] w-[84%] grid-cols-2 gap-3 overflow-y-auto overscroll-contain pr-2 sm:grid-cols-3 lg:w-[88%]">
                {categoryProducts.map((product) => <button key={product.id} type="button" data-motion={motionIndex(product.slug)} onClick={() => choose(product)} aria-pressed={selectedProduct?.id === product.id} className={`stylist-product overflow-hidden rounded-xl border text-left transition ${selectedProduct?.id === product.id ? "is-active" : ""}`}>
                  <span className="stylist-thumb relative block aspect-[4/5]"><Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="(max-width: 640px) 45vw, 150px" className="object-cover" /></span>
                  <span className="block p-2.5"><span className="block truncate text-[10px] font-medium text-dark">{product.name}</span><span className="mt-1 block text-[9px] text-gold-dark">৳{product.price.toLocaleString()}</span></span>
                </button>)}
              </div> : <p className="stylist-empty rounded-xl border px-4 py-5 text-xs leading-5 text-muted">No {category.name.toLowerCase()} pieces are available in this preview yet.</p>}
            </div>
          </aside>
        </div>
      </div>
      <style jsx global>{`@keyframes stylist-reveal{from{opacity:0;transform:translateY(10px) scale(1.02)}to{opacity:1;transform:translateY(0) scale(1)}}.stylist-enter{animation:stylist-reveal .8s cubic-bezier(.2,.8,.2,1) both}.stylist-options-scroll{scrollbar-width:thin;scrollbar-color:rgba(213,181,118,.55) rgba(255,255,255,.08)}.stylist-options-scroll::-webkit-scrollbar{width:7px}.stylist-options-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,.08);border-radius:8px}.stylist-options-scroll::-webkit-scrollbar-thumb{background:rgba(213,181,118,.55);border-radius:8px}@media(prefers-reduced-motion:reduce){.stylist-enter,.stylist-photo{animation:none!important;transform:none!important}}`}</style>
    </section>
  );
}
