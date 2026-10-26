"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { useStore } from "@/components/StoreProvider";
import type { Product } from "@/types";

export function WishlistView({ products: catalog }: { products: Product[] }) {
  const { wishlist, toggleWishlist } = useStore();
  const products = useMemo(
    () => catalog.filter((product) => wishlist.includes(product.id)),
    [catalog, wishlist],
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <header className="mb-9 border-b border-border pb-6 sm:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">Saved for later</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl text-dark sm:text-4xl">Your Wishlist</h1>
            <p className="mt-2 text-sm text-muted">{products.length} {products.length === 1 ? "piece" : "pieces"} saved in this browser</p>
          </div>
          {products.length > 0 && <button type="button" onClick={() => products.forEach((product) => toggleWishlist(product.id))} className="text-sm text-muted underline underline-offset-4 hover:text-charcoal">Clear wishlist</button>}
        </div>
      </header>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center sm:py-20">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          </div>
          <h2 className="font-heading text-2xl text-dark">Keep the pieces you love close</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Tap the heart on any product to save it here. Your wishlist stays on this browser.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark">Browse jewellery</Link>
        </div>
      )}
    </section>
  );
}
