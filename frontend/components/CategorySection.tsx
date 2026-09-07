import Link from "next/link";
import type { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
}

function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden bg-cream border border-border hover:border-gold/30 transition-all duration-300"
    >
      {/* Image placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-cream to-warm-gray">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 border border-gold/20 rounded-full flex items-center justify-center group-hover:border-gold/50 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-6 h-6 text-gold/40 group-hover:text-gold/60 transition-colors"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
              />
            </svg>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted">
            {category.name}
          </span>
        </div>
      </div>

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
