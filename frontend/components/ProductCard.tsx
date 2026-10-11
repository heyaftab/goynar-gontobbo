"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { useStore } from "@/components/StoreProvider";
import { motionIndex } from "@/lib/motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : null;

  return (
    <article className="product-card group relative">
      {/* Image container */}
      <div className="product-card__image relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f3eee7] shadow-[0_6px_22px_rgba(47,35,20,0.08)] mb-3">
        <Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="rounded-full border border-white/70 bg-[#fbf7ef]/95 px-3 py-1 text-[9px] font-semibold tracking-[0.12em] text-[#49391f] shadow-sm backdrop-blur-sm">
              New
            </span>
          )}
          {discount && (
            <span className="rounded-full border border-[#fff4dc]/70 bg-[#b8860b]/90 px-3 py-1 text-[9px] font-semibold tracking-[0.08em] text-white shadow-sm backdrop-blur-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          data-motion={motionIndex(`${product.slug}-wish`)}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-surface/85 shadow-sm backdrop-blur-sm hover:bg-white hover:scale-105 transition-all duration-200 ${
            isWishlisted ? "border-gold bg-gold/10" : ""
          }`}
          aria-label={
            isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
        >
          <svg
            data-wishlist-heart
            xmlns="http://www.w3.org/2000/svg"
            fill={isWishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "text-gold" : "text-charcoal"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-charcoal text-white text-xs font-medium tracking-wider uppercase">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover quick view */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-all duration-300">
          <Link
            href={`/products/${product.slug}`}
            data-motion={motionIndex(`${product.slug}-quick`)}
            className="product-card-action inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-dark bg-gold px-4 py-3 text-center text-[11px] font-semibold tracking-[0.08em] text-white shadow-[0_5px_18px_rgba(49,35,16,0.14)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-dark hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b58c43] focus-visible:ring-offset-2"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
            <span>View this piece</span>
          </Link>
        </div>
      </div>

      {/* Product info */}
      <div className="space-y-1.5">
        <p className="text-[10px] tracking-wider uppercase text-gold font-medium">
          {product.category}
        </p>
        <h3 className="font-heading text-sm sm:text-base font-semibold text-dark leading-tight line-clamp-2 group-hover:text-gold transition-colors">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-medium text-dark">
            {product.currency}{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-muted line-through">
              {product.currency}
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
        <button
          type="button"
          data-motion={motionIndex(`${product.slug}-cart`)}
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="product-card-action group/cart mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold-dark bg-gold px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-white shadow-[0_2px_8px_rgba(91,68,30,0.12)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5b4318] hover:bg-gold-dark hover:text-white hover:shadow-[0_6px_16px_rgba(91,68,30,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b58c43] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-border disabled:bg-cream disabled:text-muted disabled:shadow-none disabled:hover:translate-y-0"
        >
          {product.inStock ? <><span aria-hidden="true" className="text-sm leading-none transition-transform group-hover/cart:scale-110">＋</span><span>Add to bag</span></> : "Out of Stock"}
        </button>
        {product.rating && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!)
                      ? "text-gold"
                      : "text-warm-gray"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-muted">
              ({product.reviewCount})
            </span>
          </div>
        )}
      </div>
    </article>
  );
}
