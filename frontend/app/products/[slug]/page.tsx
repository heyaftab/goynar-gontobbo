import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/data/catalog-api";
import { AddToCartButton } from "@/components/ProductActions";
import { ProductGallery } from "@/components/ProductGallery";

export const revalidate = 60;

export async function generateStaticParams() { return (await getProducts()).map(({ slug }) => ({ slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center"><ProductGallery images={product.images} name={product.name} /><div><Link href={`/categories/${product.categorySlug}`} className="text-sm text-gold">{product.category}</Link><h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mt-3">{product.name}</h1><p className="text-2xl mt-5">{product.currency}{product.price.toLocaleString()} {product.originalPrice && <del className="ml-2 text-base text-muted">{product.currency}{product.originalPrice.toLocaleString()}</del>}</p><p className="text-muted leading-relaxed mt-6">{product.description ?? "A thoughtfully designed jewellery piece from our collection."}</p><p className="text-sm text-muted mt-4">{product.inStock ? "In stock" : "Currently out of stock"}</p><AddToCartButton product={product} /></div></section>;
}
