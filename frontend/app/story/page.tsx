import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = { title: "Our Story", description: "Discover the inspiration behind Goynar Gontobbo and our appreciation for the details of Bangladeshi jewellery." };

export default function StoryPage() {
  return <InfoPage eyebrow="Our Story" title="Inspired by heritage, made for today" intro="Goynar Gontobbo began with a simple idea: make the beauty of Bangladeshi jewellery craftsmanship easy to discover and enjoy." >
    <section><h2>A love of detail</h2><p>From the curve of a jhumka to the fine pattern of a bangle, traditional jewellery holds stories in its details. We built this collection around pieces that honour those details while feeling at home in modern wardrobes.</p></section>
    <section><h2>A growing destination</h2><p>Goynar Gontobbo is growing into a place to explore distinctive designs, learn about the craft behind them, and find pieces that feel personal. We look forward to sharing more of that journey as the store develops.</p></section>
  </InfoPage>;
}
