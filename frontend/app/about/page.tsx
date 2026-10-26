import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "About Us", description: "Learn about Goynar Gontobbo and our celebration of Bangladeshi jewellery, traditional inspiration, and contemporary style.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  return <InfoPage eyebrow="Company" title="About Goynar Gontobbo" intro="A home for jewellery that carries the artistry, warmth, and expressive detail of Bangladesh." >
    <section><h2>What we believe</h2><p>Jewellery can be part of everyday life and still feel meaningful. Goynar Gontobbo brings together traditional inspiration and thoughtful contemporary styling in one welcoming collection.</p></section>
    <section><h2>Our collection</h2><p>Explore earrings, rings, bangles, necklaces, and sets selected to celebrate craft and personal style. This storefront is currently a preview catalog; online ordering is not available yet.</p></section>
  </InfoPage>;
}
