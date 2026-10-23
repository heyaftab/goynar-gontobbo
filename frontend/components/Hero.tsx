import Link from "next/link";
import Image from "next/image";
import { CinematicIntro } from "@/components/CinematicIntro";

export function Hero() {
  return (
    <>
    <CinematicIntro />
    <section className="hero-shell relative overflow-hidden">
      <div className="hero-container relative mx-auto px-6 sm:px-8 lg:px-10">
        <div className="hero-layout grid lg:grid-cols-2 items-center">
          {/* Text content */}
          <div className="hero-copy flex flex-col justify-center text-left order-1">
            <p className="hero-eyebrow">Adornment with a story</p>
            <h1 className="hero-title font-heading font-medium tracking-[-0.035em] text-dark">
              <span className="hero-title-line hero-title-line-first">Goynar</span>
              <br />
              <span className="hero-title-line hero-title-line-second hero-title-accent">Gontobbo</span>
            </h1>
            <p className="hero-description text-base sm:text-lg text-muted max-w-md mb-8 leading-relaxed">
              Jewellery That Tells Your Story
            </p>
            <div className="hero-actions flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/shop"
                data-motion="117"
                className="hero-button inline-flex items-center justify-center bg-gold text-white text-sm font-medium tracking-wide hover:bg-gold-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                data-motion="286"
                className="hero-button inline-flex items-center justify-center border border-charcoal/30 bg-transparent text-charcoal text-sm font-medium tracking-wide transition-colors duration-200 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Discover Goynar Gontobbo
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero-visual relative order-2">
            <div className="hero-image-frame relative mx-auto aspect-[4/5] max-w-lg overflow-hidden rounded-[18px] border border-gold/20 bg-warm-gray">
              <div className="hero-image-placeholder absolute inset-0 overflow-hidden">
                <Image
                  src="/assets/GoynarGontobboModel.png"
                  alt="Model wearing handcrafted jewellery from Goynar Gontobbo"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  className="hero-cinema-image object-cover"
                />
                <div className="hero-cinema-grade" aria-hidden="true" />
              </div>

              {/* Floating accent card */}
              <div className="hero-feature-card absolute bottom-3 left-3 max-w-[190px] border border-white/50 bg-surface/95 p-3 shadow-[0_8px_24px_rgba(30,20,12,0.12)] sm:bottom-4 sm:left-4 sm:p-4">
                <p className="mb-1 inline-flex bg-cream px-2 py-1 text-[9px] tracking-wider uppercase text-gold">
                  Featured
                </p>
                <p className="text-xs sm:text-sm font-heading font-semibold text-dark">
                  Crafted for your moments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
