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
      className="group relative block aspect-[3/4] overflow-hidden bg-cream border border-border hover:border-gold/30 transition-all duration-300"
    >
      <Image src={category.image || "/jewellery-placeholder.svg"} alt={`${category.name} jewellery collection`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/10 transition-colors duration-300" />

      {/* Label */}
      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-dark/40 to-transparent">
        <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-0.5">
          {category.name}
        </h3>
        <p className="text-xs text-white/70">
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
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-3">
            Collections
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-3">
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
