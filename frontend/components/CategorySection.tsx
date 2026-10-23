import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/types";
import { motionIndex } from "@/lib/motion";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      data-motion={motionIndex(category.slug)}
      className="category-card group relative block aspect-[3/4] overflow-hidden rounded-[1.35rem] bg-cream shadow-[0_8px_28px_rgba(47,35,20,0.08)] ring-1 ring-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(47,35,20,0.15)]"
    >
      <Image src={category.image || "/jewellery-placeholder.svg"} alt={`${category.name} jewellery collection`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />

      {/* Label */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-dark/65 via-dark/20 to-transparent">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-0.5">
          {category.name}
        </h3>
        <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-sm">
          {category.productCount} pieces
        </p>
      </div>
    </Link>
  );
}

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section className="category-section py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
            Collections
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-medium tracking-[-0.025em] text-dark mb-3">
            Shop by Category
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto leading-relaxed">
            From timeless classics to contemporary designs, find the perfect
            piece for every occasion.
          </p>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
