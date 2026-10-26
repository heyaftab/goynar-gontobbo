import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StoreProvider } from "@/components/StoreProvider";
import { ChatAssistant } from "@/components/ChatAssistant";
import { absoluteUrl, siteName } from "@/lib/seo";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Goynar Gontobbo | Premium Bangladeshi Jewellery",
    template: "%s | Goynar Gontobbo",
  },
  description:
    "Discover exquisite Bangladeshi jewellery crafted with elegance and tradition. Explore our collection of earrings, bangles, necklaces, and more at Goynar Gontobbo.",
  metadataBase: new URL((process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://goynargontobbo.com").replace(/\/$/, "")),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName,
    title: "Goynar Gontobbo | Premium Bangladeshi Jewellery",
    description: "Discover Bangladeshi jewellery inspired by heritage and crafted for today.",
    url: absoluteUrl("/"),
    locale: "en_BD",
    images: [{ url: "/assets/GoynarGontobboBrandImage.png", width: 1200, height: 630, alt: "Goynar Gontobbo jewellery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goynar Gontobbo | Premium Bangladeshi Jewellery",
    description: "Discover Bangladeshi jewellery inspired by heritage and crafted for today.",
    images: ["/assets/GoynarGontobboBrandImage.png"],
  },
  keywords: [
    "Bangladeshi jewellery",
    "gold jewellery",
    "traditional jewellery",
    "handcrafted jewellery",
    "Goynar Gontobbo",
    "earrings",
    "bangles",
    "necklaces",
    "jhumka",
  ],
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatAssistant />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "JewelryStore",
                name: siteName,
                url: absoluteUrl("/"),
                logo: absoluteUrl("/assets/GoynarGontobboMonogram.webp"),
                description: "Bangladeshi jewellery inspired by heritage and crafted for today.",
                areaServed: { "@type": "Country", name: "Bangladesh" },
              }).replace(/</g, "\\u003c"),
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
