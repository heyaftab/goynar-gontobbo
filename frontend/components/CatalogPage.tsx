import type { Product } from "@/types";
import { ProductGrid } from "@/components/ProductGrid";

export function CatalogPage({ title, description, products }: { title: string; description: string; products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">{title}</h1>
        <p className="text-base text-muted">{description}</p>
        <div className="w-12 h-px bg-gold mx-auto mt-4" />
      </div>
      {products.length ? <ProductGrid products={products} /> : <p className="text-center py-16 text-muted">No products found.</p>}
    </section>
  );
}
