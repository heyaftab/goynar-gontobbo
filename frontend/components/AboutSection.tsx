"use client";

import Link from "next/link";
import Image from "next/image";

export function AboutSection() {
  return (
    <section className="about-section py-16 sm:py-20 lg:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Center-cropped brand image */}
          <div className="relative isolate aspect-[4/5] w-full max-w-md justify-self-center mx-auto">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-10 z-0 rounded-[2.5rem] bg-[radial-gradient(ellipse_at_center,rgba(197,154,69,0.5)_0%,rgba(197,154,69,0.24)_48%,transparent_75%)] blur-2xl"
            />
            <div className="absolute inset-0 z-10 overflow-hidden rounded-2xl border border-[#c59a45] bg-white/50 p-[3px] shadow-[0_10px_30px_rgba(116,78,22,0.16),inset_0_0_0_1px_rgba(255,239,190,0.75)]">
              <Image
                src="/assets/GoynarGontobboBrandImageWhole.png"
                alt="Goynar Gontobbo jewellery brand image"
                fill
                sizes="(max-width: 1024px) 90vw, 448px"
                className="rounded-[13px] object-cover object-center"
              />
            </div>
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
              <Link
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
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
