import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Returns & Exchanges", description: "Read the current returns and exchanges information for the Goynar Gontobbo storefront preview." };

export default function ReturnsPage() {
  return <InfoPage eyebrow="Customer Service" title="Returns & exchanges" intro="Clear return terms will be available before the store begins accepting orders." >
    <section><h2>Policy status</h2><p>Returns, exchanges, eligibility periods, and item-condition requirements are not yet established. This preview does not accept purchases.</p></section>
    <section><h2>Before you buy</h2><p>Please review the final policy at launch. We’ll include instructions for requesting help and the timelines that apply to each order.</p></section>
  </InfoPage>;
}
