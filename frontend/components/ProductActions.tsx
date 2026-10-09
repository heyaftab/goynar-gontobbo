"use client";
import type { Product } from "@/types";
import { useStore } from "@/components/StoreProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useStore();
  return <button type="button" disabled={!product.inStock} onClick={() => addToCart(product)} className="mt-8 bg-gold px-8 py-3 text-white disabled:opacity-50">{product.inStock ? "Add to Cart" : "Out of Stock"}</button>;
}
