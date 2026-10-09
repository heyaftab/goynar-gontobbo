"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { motionIndex } from "@/lib/motion";

const slots = [
  { key: "earrings", label: "Earrings" },
  { key: "necklaces", label: "Necklace" },
  { key: "bangles", label: "Bangles" },
];

const matches: Record<string, string[]> = {
  earrings: ["earrings", "jhumka"], necklaces: ["necklaces", "tana", "sets"], bangles: ["bangles", "cuffs"],
};

export function VirtualStylist({ products }: { products: Product[] }) {
  const initial = useMemo(() => ({
    earrings: products.find((item) => item.categorySlug === "earrings" || item.categorySlug === "jhumka") ?? products[0],
    necklaces: products.find((item) => item.categorySlug === "necklaces" || item.categorySlug === "tana") ?? products[1],
    bangles: products.find((item) => item.categorySlug === "bangles" || item.categorySlug === "cuffs") ?? products[2],
  }), [products]);
  const [worn, setWorn] = useState<Record<string, Product | undefined>>(initial);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  function choose(slot: string, next: Product) {
    setWorn((current) => ({ ...current, [slot]: next }));
  }

  const active = slots.find((slot) => slot.key === activeSlot);
  const options = active ? products.filter((item) => matches[active.key].includes(item.categorySlug)) : [];
  const featured = worn[activeSlot ?? "earrings"] ?? worn.earrings;

  return (
    <section className="overflow-hidden bg-[#171512] text-[#f8f1e6]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#d5b576]">The Goynar Gontobbo experience</p>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-tight sm:text-5xl">A little gold.<br /><span className="text-[#d5b576]">A lot of you.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/60">Explore the details. Tap a piece to find more in its collection, then style the look your way.</p>
        </div>

        <div className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#211e19] lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
          <div className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(ellipse_at_52%_38%,#66513a_0%,#392d22_38%,#211e19_76%)] sm:min-h-[660px]">
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(115deg,transparent 35%,rgba(232,203,153,.16) 50%,transparent 65%)" }} />
            <div key={featured?.id} className="stylist-enter absolute inset-5 overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] border border-white/10 shadow-[0_35px_90px_rgba(0,0,0,.42)] sm:inset-x-[12%] sm:inset-y-8">
              {featured?.images[0] && <Image src={featured.images[0]} alt={`${featured.name} worn in a styling photo`} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover object-center transition duration-700" />}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
                <p className="text-[9px] uppercase tracking-[.22em] text-[#e3c887]">{active?.label ?? "Current look"}</p>
                <p className="mt-1 max-w-[75%] truncate font-heading text-lg text-white sm:text-xl">{featured?.name}</p>
              </div>
            </div>

            <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[9px] uppercase tracking-[.2em] text-white/60 backdrop-blur">Styled for you</div>
          </div>

          <aside className="flex min-h-[520px] flex-col border-t border-white/10 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-[9px] uppercase tracking-[.28em] text-[#d5b576]">Curated to complement</p>
            <h3 className="mt-3 font-heading text-2xl">Your look, in the details</h3>
            <p className="mt-2 text-xs leading-5 text-white/55">Choose a category on the model to browse pieces from that collection.</p>
            <div className="mt-7 space-y-3">
              {slots.map((slot) => {
                const product = worn[slot.key];
                return <button key={slot.key} type="button" data-motion={motionIndex(`slot-${slot.key}`)} onClick={() => setActiveSlot(slot.key)} className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${activeSlot === slot.key ? "border-[#d5b576]/70 bg-white/[.07]" : "border-white/10 hover:border-white/25"}`}>
                  <span className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-white/10">{product?.images[0] && <Image src={product.images[0]} alt="" fill sizes="48px" className="object-cover" />}</span>
                  <span className="min-w-0 flex-1"><span className="block text-[9px] uppercase tracking-[.16em] text-white/45">{slot.label}</span><span className="mt-1 block truncate text-xs font-medium">{product?.name ?? "Choose a piece"}</span></span>
                  <span className="pr-2 text-[#d5b576]">↗</span>
                </button>;
              })}
            </div>
            <div className="mt-7 flex-1 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between"><p className="text-[9px] uppercase tracking-[.24em] text-[#d5b576]">{active ? `${active.label} collection` : "A thoughtful edit"}</p>{active && <button type="button" onClick={() => setActiveSlot(null)} className="text-[10px] text-white/50 hover:text-white">Close</button>}</div>
              {active ? <div key={activeSlot} className="stylist-enter mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto pr-1">
                {options.map((product) => <button key={product.id} type="button" data-motion={motionIndex(product.slug)} onClick={() => choose(active.key, product)} className={`group text-left ${worn[active.key]?.id === product.id ? "opacity-45" : ""}`} aria-label={`Style ${product.name}`}>
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-white/10"><Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="120px" className="object-cover transition duration-500 group-hover:scale-105" /></span>
                  <span className="mt-1.5 block truncate text-[9px] text-white/75">{product.name}</span>
                  <span className="block text-[9px] text-[#d5b576]">৳{product.price.toLocaleString()}</span>
                </button>)}
              </div> : <div className="mt-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-white/15 text-center text-xs leading-5 text-white/40">Hand-finished details,<br />made to be remembered.</div>}
            </div>
            <Link href="/shop" className="mt-5 inline-flex items-center justify-center rounded-full bg-[#d5b576] px-5 py-3 text-[10px] font-semibold uppercase tracking-[.18em] text-[#211e19] transition hover:bg-[#efdaaa]">Discover the collection <span className="ml-3">→</span></Link>
          </aside>
        </div>
      </div>
      <style jsx global>{`@keyframes stylist-reveal{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.stylist-enter{animation:stylist-reveal .55s cubic-bezier(.2,.8,.2,1) both}@media(prefers-reduced-motion:reduce){.stylist-enter{animation:none!important}}`}</style>
    </section>
  );
}
