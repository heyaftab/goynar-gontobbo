import { WishlistView } from "@/components/WishlistView";
import { getProducts } from "@/data/catalog-api";

export const revalidate = 60;

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistView products={products} />;
}
