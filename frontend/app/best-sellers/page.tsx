import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";
import type { Metadata } from "next";
export const revalidate = 60;
export const metadata: Metadata = { title: "Best Sellers", description: "Explore popular Bangladeshi jewellery designs from the Goynar Gontobbo collection." };
export default async function BestSellersPage() { const products = await getProducts({ bestSellers: true }); return <CatalogPage title="Best Sellers" description="Our most loved jewellery pieces." products={products} />; }
