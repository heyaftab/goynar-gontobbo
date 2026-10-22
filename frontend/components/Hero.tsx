import Link from "next/link";
import Image from "next/image";
import { CinematicIntro } from "@/components/CinematicIntro";

export function Hero() {
  return (
    <>
    <CinematicIntro />
    <section className="hero-shell relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-gold-dark blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[500px] lg:min-h-[600px] py-16 lg:py-0">
          {/* Text content */}
          <div className="flex flex-col justify-center text-center lg:text-left order-2 lg:order-1">
            <span className="inline-block text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold font-medium mb-4 sm:mb-6">
              The Goynar Gontobbo Experience
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark leading-[1.1] mb-4 sm:mb-6">
              Jewellery That
              <br />
              <span className="text-gold">Tells Your Story</span>
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
              Discover timeless pieces crafted to become part of your most beautiful moments.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                data-motion="117"
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 bg-gold text-white text-sm font-medium tracking-wide shadow-[0_5px_16px_rgba(139,101,8,0.18)] hover:-translate-y-0.5 hover:bg-gold-dark transition-all duration-300 hover:shadow-lg hover:shadow-gold/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Explore Collection
              </Link>
              <Link
                href="/about"
                data-motion="286"
                className="inline-flex items-center justify-center rounded-full border border-charcoal/15 bg-surface/65 px-8 py-3.5 text-charcoal text-sm font-medium tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-surface hover:text-gold hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
              >
                Discover Goynar Gontobbo
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative order-1 lg:order-2">
            <div className="relative my-6 aspect-[4/5] max-w-lg mx-auto sm:my-8 lg:my-12">
              <div className="hero-image-placeholder absolute inset-0 overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-warm-gray to-cream shadow-[0_18px_50px_rgba(64,47,22,0.12)]">
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
              <div className="hero-feature-card absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 max-w-[200px] rounded-2xl border border-white/70 bg-surface/95 p-3 shadow-[0_12px_32px_rgba(64,47,22,0.14)] backdrop-blur sm:p-4">
                <p className="mb-1 inline-flex rounded-full bg-cream px-2.5 py-1 text-[9px] tracking-wider uppercase text-gold">
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
