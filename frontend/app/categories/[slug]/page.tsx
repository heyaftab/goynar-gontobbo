import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/CatalogPage";
import { getCategories, getProducts } from "@/data/catalog-api";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() { return (await getCategories()).map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) return { title: "Category not found", robots: { index: false, follow: false } };
  const description = `Browse ${category.name.toLowerCase()} from Goynar Gontobbo’s Bangladeshi jewellery collection.`;
  return {
    title: `${category.name} Jewellery`,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: { type: "website", title: `${category.name} Jewellery | Goynar Gontobbo`, description, url: absoluteUrl(`/categories/${category.slug}`), images: category.image ? [{ url: category.image, alt: `${category.name} jewellery` }] : undefined },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  if (!category) notFound();
  const products = await getProducts({ category: slug });
  return <CatalogPage title={category.name} description={`Browse our ${category.name.toLowerCase()} collection.`} products={products} />;
}
