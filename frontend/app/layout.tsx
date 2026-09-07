import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
