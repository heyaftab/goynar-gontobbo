import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/data/catalog-api";
import { AddToCartButton } from "@/components/ProductActions";

export const revalidate = 60;

export async function generateStaticParams() { return (await getProducts()).map(({ slug }) => ({ slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  return <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center"><div className="relative aspect-[4/5] bg-gradient-to-br from-cream to-warm-gray border border-border"><Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority /></div><div><Link href={`/categories/${product.categorySlug}`} className="text-sm text-gold">{product.category}</Link><h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mt-3">{product.name}</h1><p className="text-2xl mt-5">{product.currency}{product.price.toLocaleString()} {product.originalPrice && <del className="ml-2 text-base text-muted">{product.currency}{product.originalPrice.toLocaleString()}</del>}</p><p className="text-muted leading-relaxed mt-6">{product.description ?? "A thoughtfully designed jewellery piece from our collection."}</p><p className="text-sm text-muted mt-4">{product.inStock ? "In stock" : "Currently out of stock"}</p><AddToCartButton product={product} /></div></section>;
}
