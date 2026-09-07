import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse the complete collection of Bangladeshi jewellery at Goynar Gontobbo. Find earrings, bangles, necklaces, rings, and more.",
};

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-dark mb-3">
          Our Collection
        </h1>
        <p className="text-base text-muted">
          Explore our full range of handcrafted Bangladeshi jewellery.
        </p>
        <div className="w-12 h-[1px] bg-gold mx-auto mt-4" />
      </div>
      <div className="text-center py-20 text-muted text-sm">
        <p>Shop page coming soon. This will display all products.</p>
      </div>
    </div>
  );
}
