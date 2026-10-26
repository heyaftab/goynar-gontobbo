import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Shipping Information", description: "Learn about planned delivery coverage and shipping information for Goynar Gontobbo in Bangladesh.", alternates: { canonical: "/shipping" } };

export default function ShippingPage() {
  return <InfoPage eyebrow="Customer Service" title="Shipping information" intro="We plan to offer delivery across Bangladesh when online ordering launches." >
    <section><h2>Delivery coverage and timing</h2><p>Delivery areas, estimated timelines, and courier details have not yet been confirmed. We’ll publish them here before accepting orders.</p></section>
    <section><h2>Delivery charges</h2><p>Any delivery fees and eligibility for complimentary delivery will be shown clearly at checkout once checkout is available.</p></section>
  </InfoPage>;
}
