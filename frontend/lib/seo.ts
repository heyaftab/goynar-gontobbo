export const siteName = "Goynar Gontobbo";
export const siteOrigin = (process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://goynargontobbo.com").replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteOrigin}/`).toString();
}

export function productDescription(description: string | undefined, name: string): string {
  const value = description?.trim() || `${name} from Goynar Gontobbo’s Bangladeshi jewellery collection.`;
  return value.length > 160 ? `${value.slice(0, 157).trimEnd()}…` : value;
}
