import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";
export const revalidate = 60;
export default async function NewArrivalsPage() { const products = await getProducts({ newArrivals: true }); return <CatalogPage title="New Arrivals" description="Fresh designs for your collection." products={products} />; }
