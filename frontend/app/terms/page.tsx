import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Goynar Gontobbo preview storefront.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <InfoPage eyebrow="Legal" title="Terms of service" intro="These terms apply when you visit or use the Goynar Gontobbo website. The current site is a preview catalog for browsing, not an operating online shop. Please read these terms and the Privacy Policy before using the site.">
    <p className="text-xs">Last updated: October 11, 2026</p>

    <section><h2>1. Who operates this site</h2><p>“Goynar Gontobbo,” “we,” “us,” and “our” refer to the operator of this storefront. The website does not currently publish verified legal-entity, registered-address, or customer-support details. Those details must be supplied by the operator before the site is used to accept orders or payments.</p></section>

    <section><h2>2. The site is a preview</h2><p>This site lets visitors browse a sample jewellery catalog and explore storefront features. It does not currently accept orders, form sales contracts, collect payments, or arrange delivery. Customer registration and password login are available when the Laravel account service is configured. Adding an item to the cart or wishlist is a local browsing action only. No reservation, purchase, price guarantee, or promise of availability results from that action.</p></section>

    <section><h2>3. Catalog information</h2><p>Product names, descriptions, photographs, categories, prices, discounts, stock indicators, materials, purities, and other catalog details may be illustrative, incomplete, outdated, or sample data. Images may not show exact size, color, finish, or condition. Displayed prices use Bangladeshi Taka in the current sample catalog, but are not offers to sell. Do not rely on the catalog to make a purchase, valuation, material, allergy, or care decision.</p><p>Before any real orders are enabled, the operator must provide accurate product details, final prices, applicable charges, delivery terms, payment methods, cancellation and return rules, and a way to contact the business. Those terms will apply only when clearly presented for the live service.</p></section>

    <section><h2>4. Acceptable use</h2><p>You may use the preview for lawful personal browsing. You agree not to:</p><ul><li>Attempt to disrupt, overload, probe, or gain unauthorized access to the site, its API, or related systems.</li><li>Use automated means to copy or harvest site content at a scale that disrupts the service or violates applicable rights.</li><li>Upload, transmit, or introduce malicious code, or use the site to violate another person’s rights or applicable law.</li><li>Misrepresent your identity or imply that browsing, a cart, or local demo-role access creates an order or production administrator privileges.</li></ul></section>

    <section><h2>5. Accounts and Google sign-in</h2><p>Email and password registration and login use the configured Laravel account database. Passwords are hashed by Laravel before storage. Customers can request a password reset link by email and change their password from Profile settings. Reset links expire and may be used once; delivery depends on the operator&apos;s configured mail provider. Google sign-in, when configured, verifies a Google identity token and creates a short-lived browser session. The site does not provide order history. Google services are also subject to Google&apos;s own terms and privacy information.</p></section>

    <section><h2>6. Site content and intellectual property</h2><p>The site’s software, layout, text, branding, and images may be owned by the operator or used under license. These terms do not transfer ownership or grant permission to reproduce, distribute, modify, or commercially exploit content. You may view the site for personal evaluation. If you believe content infringes your rights, use the contact channel published on the live site; verified support details are not currently available here.</p></section>

    <section><h2>7. Third-party services and links</h2><p>The preview may rely on hosting providers, Google Identity Services, and a separately hosted catalog API. Those services operate under their own terms and may be unavailable or change independently. Links or references to third-party services do not mean that the operator endorses them or controls their content, security, or availability.</p></section>

    <section><h2>8. Availability and changes</h2><p>We may change, suspend, or remove preview features or catalog content at any time. We do not promise uninterrupted availability, error-free content, or that data stored by your browser will remain available. Browser storage can be cleared by you, your browser, or your device.</p></section>

    <section><h2>9. Disclaimers and liability</h2><p>To the extent permitted by applicable law, the preview is provided “as is” and “as available,” without warranties that it will be accurate, uninterrupted, secure, or fit for a particular purpose. Nothing in these terms limits rights or remedies that cannot legally be excluded. To the extent permitted by law, the operator is not liable for indirect or consequential loss arising from use of this non-transactional preview. This section does not exclude liability where exclusion is prohibited by law, including liability for fraud or intentional misconduct where applicable.</p></section>

    <section><h2>10. Privacy</h2><p>Use of the site is also governed by the <a className="font-medium text-gold-dark underline underline-offset-4" href="/privacy">Privacy Policy</a>, which describes browser storage, catalog requests, and optional Google sign-in.</p></section>

    <section><h2>11. Governing terms and updates</h2><p>The operator has not yet published a verified legal address or governing-law notice, so this preview does not specify a jurisdiction. The operator should complete this information before accepting orders. We may revise these terms as the site changes; the “Last updated” date identifies the current version. Continued browsing after an update means you have had an opportunity to review the revised terms, subject to rights that applicable law provides.</p></section>

    <section><h2>12. Contact</h2><p>Verified legal and customer-support contact details have not yet been published. Do not submit sensitive information or payment details through this preview. Contact details and a process for legal notices should be added here before the site launches as a commercial store.</p></section>
  </InfoPage>;
}
