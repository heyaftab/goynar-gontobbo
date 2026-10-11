"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NavItem } from "@/types";
import { useStore } from "@/components/StoreProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "About", href: "/about" },
];

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { cart } = useStore();
  const cartCount = cart.reduce((count, line) => count + line.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-charcoal text-cream text-xs text-center py-1.5 tracking-wide hidden sm:block">
        Free delivery on orders over ৳5,000 across Bangladesh
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden mr-2 p-2 -ml-2 text-charcoal hover:text-gold transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>

          {/* Logo */}
          <Link href="/" className="mr-auto flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.025]" aria-label="Goynar Gontobbo home">
            <Image src="/assets/Luxurious%20Gold%20Goynar%20Gontobbo%20Monogram.png" alt="Goynar Gontobbo" width={1254} height={1254} priority className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-motion={navItems.indexOf(item) * 13 + 31}
                className="text-sm font-medium text-charcoal hover:text-gold transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              data-motion="203"
              className="hidden sm:flex p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Search"
              onClick={() => router.push("/search")}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              data-motion="147"
              className="hidden sm:flex p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Account"
              onClick={() => router.push("/account")}
            >
              <UserIcon />
            </button>
            <button
              type="button"
              data-motion="255"
              className="hidden sm:flex p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Wishlist"
              onClick={() => router.push("/wishlist")}
            >
              <HeartIcon />
            </button>
            <button
              type="button"
              data-motion="89"
              className="p-2 text-charcoal hover:text-gold transition-colors relative"
              aria-label={`Cart, ${cartCount} items`}
              onClick={() => router.push("/cart")}
            >
              <CartIcon />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            <ThemeToggle compact />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="px-4 pb-4 pt-2 border-t border-border"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-3 text-sm font-medium text-charcoal hover:text-gold transition-colors border-b border-border last:border-0"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-3 mt-2 border-t border-border">
            <ThemeToggle />
            <button
              type="button"
              className="p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Search"
              onClick={() => router.push("/search")}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className="p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Account"
              onClick={() => router.push("/account")}
            >
              <UserIcon />
            </button>
            <Link
              href="/register"
              className="text-sm font-medium text-charcoal hover:text-gold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create account
            </Link>
            <Link href="/account" className="text-sm font-medium text-charcoal hover:text-gold" onClick={() => setMobileMenuOpen(false)}>My account</Link>
            <button
              type="button"
              className="p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Wishlist"
              onClick={() => router.push("/wishlist")}
            >
              <HeartIcon />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
