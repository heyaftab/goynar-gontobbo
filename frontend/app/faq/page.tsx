import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "FAQs" };

export default function FAQPage() {
  return <InfoPage eyebrow="Customer Service" title="Frequently asked questions" intro="A few quick answers about using the Goynar Gontobbo preview." >
    <section><h2>Can I place an order?</h2><p>Not yet. The store is currently a preview catalog and checkout is not connected.</p></section>
    <section><h2>Are the products real and available?</h2><p>Catalog content may include sample data. Check back when ordering launches for confirmed stock and product details.</p></section>
    <section><h2>Will my cart and wishlist be saved?</h2><p>They are saved in your current browser. Clearing browser storage or switching devices may remove or hide them.</p></section>
  </InfoPage>;
}
