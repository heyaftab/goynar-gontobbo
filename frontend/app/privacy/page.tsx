import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <InfoPage eyebrow="Company" title="Privacy policy" intro="This preview storefront is designed for browsing. It does not currently provide customer accounts or online checkout." >
    <section><h2>Information stored in your browser</h2><p>Your cart and wishlist are stored in local browser storage so they can be shown again on this device. The newsletter preview also saves an entered email in this browser and does not send it to a server.</p></section>
    <section><h2>Information sent to the service</h2><p>When configured, the storefront requests public catalog data from its backend. Do not enter passwords, payment details, or other sensitive information into this preview.</p></section>
    <section><h2>Changes to this policy</h2><p>This notice describes the current preview only. A complete policy will be published before customer accounts, analytics, or online orders are introduced.</p></section>
  </InfoPage>;
}
