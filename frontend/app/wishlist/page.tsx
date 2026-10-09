"use client";
import { CatalogPage } from "@/components/CatalogPage";
import { mockProducts } from "@/data/mock-products";
import { useStore } from "@/components/StoreProvider";
export default function WishlistPage() { const { wishlist } = useStore(); return <CatalogPage title="Your Wishlist" description="Pieces you have saved for later." products={mockProducts.filter((product) => wishlist.includes(product.id))} />; }
