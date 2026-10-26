import Link from "next/link";
import { getCategories } from "@/data/catalog-api";
import type { Metadata } from "next";

export const revalidate = 60;
export const metadata: Metadata = { title: "Jewellery Categories", description: "Browse Goynar Gontobbo jewellery by category, including earrings, rings, bangles, necklaces, and more.", alternates: { canonical: "/categories" } };

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"><h1 className="font-heading text-4xl text-center mb-10">Shop by Category</h1><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{categories.map((category) => <Link className="border border-border bg-cream p-8 text-center hover:border-gold" key={category.id} href={`/categories/${category.slug}`}><h2 className="font-heading text-xl">{category.name}</h2><p className="text-sm text-muted mt-2">{category.productCount} pieces</p></Link>)}</div></section>;
}
