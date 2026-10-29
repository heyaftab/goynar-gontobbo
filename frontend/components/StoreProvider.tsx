"use client";

import { useSyncExternalStore } from "react";
import type { CartLine, Product } from "@/types";
import { mockProducts } from "@/data/mock-products";

interface StoreSnapshot {
  cart: CartLine[];
  wishlist: string[];
}

interface StoreValue extends StoreSnapshot {
  addToCart: (product: Product) => void;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const serverSnapshot: StoreSnapshot = { cart: [], wishlist: [] };
let snapshot: StoreSnapshot | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): StoreSnapshot {
  if (snapshot) return snapshot;
  try {
    const savedCart = JSON.parse(localStorage.getItem("gg-cart") ?? "[]") as CartLine[];
    snapshot = {
      cart: savedCart.map((line) => {
        const hasProductImage = Array.isArray(line.product.images)
          && line.product.images.some((image) => image && image !== "/jewellery-placeholder.svg");
        if (hasProductImage) return line;
        const currentProduct = mockProducts.find((product) => product.slug === line.product.slug);
        return currentProduct ? { ...line, product: { ...line.product, images: currentProduct.images } } : line;
      }),
      wishlist: JSON.parse(localStorage.getItem("gg-wishlist") ?? "[]") as string[],
    };
  } catch {
    localStorage.removeItem("gg-cart");
    localStorage.removeItem("gg-wishlist");
    snapshot = serverSnapshot;
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(next: StoreSnapshot) {
  snapshot = next;
  localStorage.setItem("gg-cart", JSON.stringify(next.cart));
  localStorage.setItem("gg-wishlist", JSON.stringify(next.wishlist));
  listeners.forEach((listener) => listener());
}

function addToCart(product: Product) {
  const current = getSnapshot();
  const existing = current.cart.find((line) => line.product.id === product.id);
  update({
    ...current,
    cart: existing
      ? current.cart.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current.cart, { product, quantity: 1 }],
  });
}

function removeFromCart(productId: string) {
  const current = getSnapshot();
  update({ ...current, cart: current.cart.filter((line) => line.product.id !== productId) });
}

function setCartQuantity(productId: string, quantity: number) {
  const current = getSnapshot();
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  update({
    ...current,
    cart: current.cart.map((line) =>
      line.product.id === productId ? { ...line, quantity } : line,
    ),
  });
}

function toggleWishlist(productId: string) {
  const current = getSnapshot();
  update({
    ...current,
    wishlist: current.wishlist.includes(productId)
      ? current.wishlist.filter((id) => id !== productId)
      : [...current.wishlist, productId],
  });
}

function clearWishlist() {
  const current = getSnapshot();
  update({ ...current, wishlist: [] });
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export function useStore(): StoreValue {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
  return { ...current, addToCart, setCartQuantity, removeFromCart, toggleWishlist, clearWishlist };
}
