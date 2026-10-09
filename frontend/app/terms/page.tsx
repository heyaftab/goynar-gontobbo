import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return <InfoPage eyebrow="Company" title="Terms of service" intro="These terms describe the current Goynar Gontobbo preview catalog." >
    <section><h2>Preview content</h2><p>Product descriptions, images, prices, and availability may be sample content and are provided for browsing. No purchase contract is formed through this preview.</p></section>
    <section><h2>Availability</h2><p>Features may change while the storefront is being developed. Cart and wishlist controls are for local convenience; checkout is not available.</p></section>
    <section><h2>Future purchases</h2><p>Separate purchase, delivery, return, and payment terms will be presented before the store accepts orders.</p></section>
  </InfoPage>;
}
