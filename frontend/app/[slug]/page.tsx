import { notFound } from "next/navigation";

const pages: Record<string, { title: string; body: string }> = {
  about: { title: "About Us", body: "Goynar Gontobbo celebrates Bangladeshi jewellery craftsmanship with pieces that bring traditional artistry into everyday life." },
  contact: { title: "Contact Us", body: "For help with our collection, please contact our customer care team through our official social channels." },
  faq: { title: "Frequently Asked Questions", body: "Product availability and prices are shown on each product page. Orders and online payments are not yet available." },
  shipping: { title: "Shipping Information", body: "Delivery arrangements will be published here when online ordering becomes available." },
  returns: { title: "Returns & Exchanges", body: "Return and exchange terms will be published before online ordering becomes available." },
  "size-guide": { title: "Size Guide", body: "Please contact customer care for sizing guidance while this storefront is in preview." },
  privacy: { title: "Privacy Policy", body: "This preview stores cart and wishlist data in your browser only. It does not submit personal information to a server." },
  terms: { title: "Terms of Service", body: "This storefront is a preview catalog. Product listings are sample data and cannot currently be purchased." },
  sitemap: { title: "Sitemap", body: "Browse the shop, categories, new arrivals, best sellers, product pages, cart, and wishlist using the navigation." },
};

export function generateStaticParams() { return Object.keys(pages).map((slug) => ({ slug })); }
export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const page = pages[slug]; if (!page) notFound(); return <section id="story" className="max-w-3xl mx-auto px-4 py-20"><h1 className="font-heading text-4xl mb-6">{page.title}</h1><p className="text-muted leading-relaxed">{page.body}</p></section>; }
