import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";
import type { Metadata } from "next";
export const revalidate = 60;
export const metadata: Metadata = { title: "New Arrivals", description: "Discover new jewellery designs and fresh additions to the Goynar Gontobbo collection." };
export default async function NewArrivalsPage() { const products = await getProducts({ newArrivals: true }); return <CatalogPage title="New Arrivals" description="Fresh designs for your collection." products={products} />; }
