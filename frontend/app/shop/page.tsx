import type { Metadata } from "next";
import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the complete collection of Bangladeshi jewellery at Goynar Gontobbo. Find earrings, bangles, necklaces, rings, and more.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  return <CatalogPage title="Our Collection" description="Explore our full range of handcrafted Bangladeshi jewellery." products={products} />;
}
