import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/CatalogPage";
import { getCategories, getProducts } from "@/data/catalog-api";

export const revalidate = 60;

export async function generateStaticParams() { return (await getCategories()).map(({ slug }) => ({ slug })); }

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();
  const products = await getProducts({ category: slug });
  return <CatalogPage title={category.name} description={`Browse our ${category.name.toLowerCase()} collection.`} products={products} />;
}
