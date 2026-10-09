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
    <article className="group relative" data-motion={motionIndex(product.slug)}>
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-cream border border-border overflow-hidden mb-3">
        <Image src={product.images[0] || "/jewellery-placeholder.svg"} alt={product.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />

        {/* Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 bg-charcoal text-white text-[10px] font-medium tracking-wider uppercase">
              New
            </span>
          )}
          {discount && (
            <span className="px-2 py-0.5 bg-gold text-white text-[10px] font-medium tracking-wider">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          type="button"
          data-motion={motionIndex(`${product.slug}-wish`)}
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-2 sm:top-3 right-2 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-surface/90 backdrop-blur-sm border border-border hover:border-gold/50 transition-all duration-200 ${
            isWishlisted ? "border-gold bg-gold/10" : ""
          }`}
          aria-label={
            isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
        >
          <svg
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
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            href={`/products/${product.slug}`}
            data-motion={motionIndex(`${product.slug}-quick`)}
            className="block w-full py-2.5 bg-surface/95 backdrop-blur-sm text-center text-charcoal text-xs font-medium tracking-wider hover:bg-gold hover:text-white transition-colors border border-border"
          >
            Quick View
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
          className="mt-2 w-full border border-border px-3 py-2 text-xs font-medium text-charcoal hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
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
