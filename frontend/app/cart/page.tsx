"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";

const paymentMethods = [
  { name: "bKash", detail: "Mobile banking", style: "bg-[#e2136e] text-white", mark: "bKash" },
  { name: "Nagad", detail: "Mobile banking", style: "bg-[#f47920] text-white", mark: "Nagad" },
  { name: "Visa", detail: "Credit & debit cards", style: "bg-[#1a1f71] text-white", mark: "VISA" },
  { name: "Mastercard", detail: "Credit & debit cards", style: "bg-[#242424] text-white", mark: "MC" },
  { name: "American Express", detail: "Credit cards", style: "bg-[#2876b8] text-white", mark: "AMEX" },
  { name: "Rocket", detail: "Mobile banking", style: "bg-[#8c1c66] text-white", mark: "Rocket" },
  { name: "Upay", detail: "Mobile banking", style: "bg-[#673ab7] text-white", mark: "upay" },
  { name: "Internet banking", detail: "Participating banks", style: "bg-[#365c48] text-white", mark: "BANK" },
];

export default function CartPage() {
  const { cart, setCartQuantity, removeFromCart } = useStore();
  const itemCount = cart.reduce((count, line) => count + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mb-8 border-b border-border pb-6 sm:mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-dark">Your selection</p>
        <h1 className="font-heading text-3xl text-dark sm:text-4xl">Shopping bag</h1>
        <p className="mt-2 text-sm text-muted">{itemCount} {itemCount === 1 ? "piece" : "pieces"} in your bag</p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center sm:py-20">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream text-gold-dark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974a1.125 1.125 0 0 1 1.119 1.007Z" /></svg>
          </div>
          <h2 className="font-heading text-2xl text-dark">Your bag is waiting for something special</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Explore handcrafted pieces and add your favourites here. Your selection stays saved in this browser.</p>
          <Link href="/shop" className="mt-7 inline-flex rounded-lg bg-charcoal px-6 py-3 text-sm font-semibold text-white transition hover:bg-gold-dark">Explore the collection</Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div className="space-y-4">
            {cart.map(({ product, quantity }) => (
              <article key={product.id} className="flex gap-4 rounded-xl border border-border bg-surface p-3 sm:gap-6 sm:p-5">
                <Link href={`/products/${product.slug}`} className="relative h-32 w-28 shrink-0 overflow-hidden rounded-lg bg-cream sm:h-40 sm:w-36">
                  <Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="144px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-1 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gold-dark">{product.category}</p>
                    <Link href={`/products/${product.slug}`} className="mt-1 block font-heading text-lg leading-snug text-dark hover:text-gold-dark sm:text-xl">{product.name}</Link>
                    <p className="mt-2 text-sm font-medium text-charcoal">{product.currency}{product.price.toLocaleString()}</p>
                    {!product.inStock && <p className="mt-1 text-xs font-medium text-red-700">Currently out of stock</p>}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 sm:mt-0 sm:flex-col sm:items-end">
                    <div className="inline-flex items-center rounded-lg border border-border" aria-label={`Quantity for ${product.name}`}>
                      <button type="button" onClick={() => setCartQuantity(product.id, quantity - 1)} className="px-3 py-2 text-charcoal hover:text-gold-dark" aria-label={`Decrease ${product.name} quantity`}>−</button>
                      <span className="min-w-8 text-center text-sm tabular-nums">{quantity}</span>
                      <button type="button" onClick={() => setCartQuantity(product.id, quantity + 1)} disabled={!product.inStock} className="px-3 py-2 text-charcoal hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-40" aria-label={`Increase ${product.name} quantity`}>+</button>
                    </div>
                    <p className="font-semibold text-dark">{product.currency}{(product.price * quantity).toLocaleString()}</p>
                    <button type="button" onClick={() => removeFromCart(product.id)} className="text-xs text-muted underline underline-offset-4 hover:text-red-700">Remove</button>
                  </div>
                </div>
              </article>
            ))}
            <Link href="/shop" className="inline-flex pt-2 text-sm font-medium text-gold-dark underline underline-offset-4">Continue shopping</Link>
          </div>

          <aside className="h-fit rounded-xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="font-heading text-2xl text-dark">Order summary</h2>
            <div className="mt-6 space-y-3 border-b border-border pb-5 text-sm">
              <div className="flex justify-between gap-3 text-muted"><span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span><span className="text-charcoal">৳{total.toLocaleString()}</span></div>
              <div className="flex justify-between gap-3 text-muted"><span>Delivery</span><span className="text-charcoal">Calculated at checkout</span></div>
            </div>
            <div className="flex justify-between py-5 font-semibold text-dark"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
            <button type="button" disabled className="w-full cursor-not-allowed rounded-lg bg-charcoal px-5 py-3.5 text-sm font-semibold text-white opacity-60">Checkout coming soon</button>
            <p className="mt-3 text-center text-xs leading-5 text-muted">Payment methods planned for secure checkout</p>
            <div className="mt-4 grid grid-cols-2 gap-2" aria-label="Planned payment methods">
              {paymentMethods.map((method) => (
                <div key={method.name} className="flex min-w-0 items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-2">
                  <span aria-hidden="true" className={`flex h-7 w-10 shrink-0 items-center justify-center rounded text-[9px] font-bold ${method.style}`}>{method.mark}</span>
                  <span className="min-w-0"><span className="block truncate text-xs font-semibold text-charcoal">{method.name}</span><span className="block truncate text-[10px] text-muted">{method.detail}</span></span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-[10px] leading-4 text-muted">Payments are not active yet. bKash, Nagad, cards and other methods require SSLCommerz checkout integration.</p>
            <div className="mt-6 rounded-lg bg-cream p-4 text-center text-xs leading-5 text-charcoal">Complimentary delivery on orders over ৳5,000 across Bangladesh.</div>
          </aside>
        </div>
      )}
    </section>
  );
}
