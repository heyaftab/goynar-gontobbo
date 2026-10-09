import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Sitemap" };

const links = [
  ["Home", "/"], ["Shop all jewellery", "/shop"], ["Categories", "/categories"],
  ["New arrivals", "/new-arrivals"], ["Best sellers", "/best-sellers"],
  ["Your cart", "/cart"], ["Your wishlist", "/wishlist"], ["Your account", "/account"],
  ["About us", "/about"], ["Our story", "/story"], ["Contact us", "/contact"],
  ["FAQs", "/faq"], ["Shipping information", "/shipping"],
  ["Returns & exchanges", "/returns"], ["Size guide", "/size-guide"],
  ["Privacy policy", "/privacy"], ["Terms of service", "/terms"],
] as const;

export default function SitemapPage() {
  return <InfoPage eyebrow="Explore" title="Sitemap" intro="Find your way around Goynar Gontobbo." >
    <ul>{links.map(([label, href]) => <li key={href}><Link href={href} className="text-gold-dark underline underline-offset-4 hover:text-gold">{label}</Link></li>)}</ul>
  </InfoPage>;
}
