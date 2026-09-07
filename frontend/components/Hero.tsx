import Link from "next/link";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-cream via-ivory to-warm-gray overflow-hidden">
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
              Handcrafted with Love
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark leading-[1.1] mb-4 sm:mb-6">
              Discover the
              <br />
              <span className="text-gold">Beauty of</span>
              <br />
              Bangladeshi Jewellery
            </h1>
            <p className="text-base sm:text-lg text-muted max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
              Explore our curated collection of handcrafted jewellery that
              celebrates timeless tradition and modern elegance.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-gold text-white text-sm font-medium tracking-wide hover:bg-gold-dark transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              >
                Shop Now
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-charcoal/20 text-charcoal text-sm font-medium tracking-wide hover:border-gold hover:text-gold transition-all duration-300"
              >
                Explore Categories
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/5] max-w-lg mx-auto">
              {/* Main image placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-warm-gray to-cream border border-border flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-4 border-2 border-gold/30 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-10 h-10 text-gold/40"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted tracking-wide uppercase">
                    Hero Image
                  </p>
                </div>
              </div>

              {/* Floating accent card */}
              <div className="absolute -bottom-4 -left-4 sm:bottom-8 sm:-left-8 bg-surface border border-border p-3 sm:p-4 shadow-lg max-w-[200px]">
                <p className="text-[10px] tracking-wider uppercase text-gold mb-1">
                  Featured
                </p>
                <p className="text-xs sm:text-sm font-heading font-semibold text-dark">
                  Bridal Collection 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
