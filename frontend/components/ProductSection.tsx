import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { ProductGrid } from "./ProductGrid";
import type { Product } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref: string;
}

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: ProductSectionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading title={title} subtitle={subtitle} />
        <ProductGrid products={products} />
        <div className="text-center mt-10 sm:mt-12">
          <Link
            href={viewAllHref}
            className="inline-flex items-center justify-center px-8 py-3 border border-charcoal/20 text-charcoal text-sm font-medium tracking-wide hover:border-gold hover:text-gold transition-all duration-300"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
