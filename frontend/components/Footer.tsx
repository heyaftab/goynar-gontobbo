"use client";

import Link from "next/link";
import { useState } from "react";

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Earrings", href: "/categories/earrings" },
    { label: "Bangles", href: "/categories/bangles" },
    { label: "Necklaces", href: "/categories/necklaces" },
    { label: "Sets", href: "/categories/sets" },
  ],
  customerService: [
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping Info", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size Guide", href: "/size-guide" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about#story" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  const [newsletterMessage, setNewsletterMessage] = useState("");
  return (
    <footer className="bg-charcoal text-cream/80">
      {/* Newsletter */}
      <div className="border-b border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-heading text-2xl text-cream mb-2">
              Stay in Touch
            </h3>
            <p className="text-sm text-cream/60 mb-6">
              Be the first to know about new collections, exclusive offers, and
              styling inspiration.
            </p>
            <form className="flex gap-2" onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const email = new FormData(form).get("email")?.toString().trim().toLowerCase();
              if (!email) return;
              let current: string[] = [];
              try { current = JSON.parse(localStorage.getItem("gg-newsletter") ?? "[]") as string[]; } catch { localStorage.removeItem("gg-newsletter"); }
              if (!current.includes(email)) localStorage.setItem("gg-newsletter", JSON.stringify([...current, email]));
              setNewsletterMessage("Thanks for subscribing. This preview saved your email in this browser.");
              form.reset();
            }}>
              <input
                type="email"
                name="email"
                required
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 text-sm focus:outline-none focus:border-gold transition-colors"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gold text-white text-sm font-medium hover:bg-gold-dark transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p aria-live="polite" className="text-xs text-cream/60 mt-3">{newsletterMessage}</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-heading text-xl font-bold text-cream">
                Goynar Gontobbo
              </span>
              <span className="block text-[9px] tracking-[0.3em] uppercase text-cream/50 mt-[-1px]">
                Fine Jewellery
              </span>
            </Link>
            <p className="mt-4 text-sm text-cream/50 leading-relaxed">
              Celebrating the art of Bangladeshi jewellery with handcrafted
              pieces that honour tradition and embrace modern elegance.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-cream mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-cream mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-wider text-cream mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/50 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-cream/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/40">
            <p>
              &copy; {new Date().getFullYear()} Goynar Gontobbo. All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-cream/70 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-cream/70 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="hover:text-cream/70 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
