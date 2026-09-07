import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { ProductSection } from "@/components/ProductSection";
import { AboutSection } from "@/components/AboutSection";
import { TrustSection } from "@/components/TrustSection";
import { categories } from "@/data/mock-categories";
import { newArrivals, bestSellers } from "@/data/mock-products";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection categories={categories} />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh designs that celebrate the latest trends in Bangladeshi jewellery."
        products={newArrivals}
        viewAllHref="/new-arrivals"
      />
      <AboutSection />
      <ProductSection
        title="Best Sellers"
        subtitle="Our most loved pieces, chosen by customers across Bangladesh."
        products={bestSellers}
        viewAllHref="/best-sellers"
      />
      <TrustSection />
    </>
  );
}
