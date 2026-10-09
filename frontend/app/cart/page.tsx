"use client";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const { cart, removeFromCart } = useStore();
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  return <section className="max-w-4xl mx-auto px-4 py-16"><h1 className="font-heading text-4xl mb-8">Your Cart</h1>{cart.length === 0 ? <p className="text-muted">Your cart is empty. <Link className="text-gold" href="/shop">Browse the collection</Link></p> : <><ul className="divide-y divide-border">{cart.map(({ product, quantity }) => <li key={product.id} className="py-5 flex justify-between gap-4"><div><Link className="font-medium" href={`/products/${product.slug}`}>{product.name}</Link><p className="text-sm text-muted">Quantity: {quantity}</p></div><div className="text-right">{product.currency}{(product.price * quantity).toLocaleString()}<button className="block text-sm text-gold mt-2 ml-auto" onClick={() => removeFromCart(product.id)}>Remove</button></div></li>)}</ul><p className="text-right text-xl mt-6">Total: ৳{total.toLocaleString()}</p><p className="text-right text-sm text-muted mt-2">Checkout is not available yet.</p></>}</section>;
}
