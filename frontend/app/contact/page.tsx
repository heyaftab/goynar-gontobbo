import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Contact Us", description: "Find support information and updates about the Goynar Gontobbo jewellery storefront preview.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return <InfoPage eyebrow="Customer Service" title="Contact us" intro="We’re here to help with questions about the collection and this preview store." >
    <section><h2>How to reach us</h2><p>Customer support channels are being set up. Please check back for verified contact details before sharing personal or payment information.</p></section>
    <section><h2>About orders</h2><p>Online ordering is not active yet. Product cards are for browsing only, and the checkout button is disabled.</p></section>
  </InfoPage>;
}
