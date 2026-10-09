import { CatalogPage } from "@/components/CatalogPage";
import { getProducts } from "@/data/catalog-api";
export const revalidate = 60;
export default async function BestSellersPage() { const products = await getProducts({ bestSellers: true }); return <CatalogPage title="Best Sellers" description="Our most loved jewellery pieces." products={products} />; }
