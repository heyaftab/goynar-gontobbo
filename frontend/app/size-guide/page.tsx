import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Size Guide" };

export default function SizeGuidePage() {
  return <InfoPage eyebrow="Customer Service" title="Jewellery size guide" intro="Use these simple measuring tips as a starting point. Product-specific sizing will be added as confirmed details become available." >
    <section><h2>Ring size</h2><p>Wrap a narrow strip of paper around the base of your finger, mark where it meets, then measure the length in millimetres. Measure more than once, and avoid pulling the paper tight. A jeweller can confirm the best fit.</p></section>
    <section><h2>Bangle size</h2><p>Measure around the widest part of your hand with your thumb tucked toward your palm. Compare that circumference with the inner circumference of a bangle that fits comfortably.</p></section>
    <section><h2>Necklace length</h2><p>Use a soft measuring tape or a piece of string to compare where different lengths sit on your neckline. Pendant size and body shape can change how a necklace hangs.</p></section>
  </InfoPage>;
}
