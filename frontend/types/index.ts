export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: string;
  categorySlug: string;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface NavItem {
  label: string;
  href: string;
}
