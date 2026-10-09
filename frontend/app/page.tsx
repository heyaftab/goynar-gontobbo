import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { ProductSection } from "@/components/ProductSection";
import { AboutSection } from "@/components/AboutSection";
import { TrustSection } from "@/components/TrustSection";
import { VirtualStylist } from "@/components/VirtualStylist";
import { getCategories, getProducts } from "@/data/catalog-api";

export const revalidate = 60;

export default async function Home() {
  const [categories, newArrivals, bestSellers] = await Promise.all([
    getCategories(),
    getProducts(),
    getProducts({ bestSellers: true }),
  ]);
  return (
    <>
      <Hero />
      <VirtualStylist products={newArrivals} />
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
