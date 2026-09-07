export function AboutSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-warm-gray to-cream border border-border flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-3 border-2 border-gold/30 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-8 h-8 text-gold/40"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                    />
                  </svg>
                </div>
                <p className="text-xs text-muted tracking-wide uppercase">
                  Brand Image
                </p>
              </div>
            </div>
            {/* Accent line */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/20 -z-10" />
          </div>

          {/* Content */}
          <div>
            <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-gold font-medium mb-4">
              Our Story
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-6 leading-tight">
              A Celebration of
              <br />
              Bangladeshi Craftsmanship
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-muted leading-relaxed">
              <p>
                Goynar Gontobbo was born from a deep appreciation for the rich
                heritage of Bangladeshi jewellery-making. Each piece in our
                collection reflects the skill and passion of artisans who have
                perfected their craft over generations.
              </p>
              <p>
                We believe that jewellery is more than an accessory — it is a
                form of self-expression, a carrier of culture, and a bridge
                between tradition and contemporary style.
              </p>
              <p>
                Our mission is to bring you beautifully crafted pieces that
                honour this legacy while embracing modern design sensibilities,
                making timeless jewellery accessible to the modern woman.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/about"
                className="inline-flex items-center text-sm font-medium text-gold hover:text-gold-dark transition-colors group"
              >
                Read Our Full Story
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
