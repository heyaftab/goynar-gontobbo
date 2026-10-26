import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shopping Cart", robots: { index: false, follow: false } };

export default function CartLayout({ children }: LayoutProps<"/cart">) {
  return children;
}
