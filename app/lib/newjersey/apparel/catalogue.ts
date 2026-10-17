import type { NewJerseyProduct } from "@/app/types/commerce";
export const APPAREL_FIELDS =
  "id,slug,name,description,price,currency,sale_mode,publication_status,jersey_enabled,apparel_enabled,apparel_sizes,apparel_colours,image_url,image_urls,featured";
export type ApparelRow = {
  id: string | number;
  slug: string;
  name: string;
  description: string | null;
  price: string | number | null;
  currency: string;
  sale_mode: string;
  publication_status: string;
  jersey_enabled: boolean;
  apparel_enabled: boolean;
  apparel_sizes: string[];
  apparel_colours: string[];
  image_url: string | null;
  image_urls: string[] | null;
  featured: boolean;
};
export function toApparelProduct(row: ApparelRow): NewJerseyProduct | null {
  const price = Number(row.price);
  const validList = (v: unknown): v is string[] =>
    Array.isArray(v) &&
    v.length > 0 &&
    v.every((x) => typeof x === "string" && x.trim().length > 0);
  if (
    !row.apparel_enabled ||
    row.jersey_enabled ||
    row.publication_status !== "published" ||
    row.sale_mode !== "fixed" ||
    row.currency !== "NGN" ||
    row.price == null ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 99999999.99 ||
    !validList(row.apparel_sizes) ||
    !validList(row.apparel_colours)
  )
    return null;
  const images = [...new Set([row.image_url, ...(row.image_urls ?? [])])]
    .filter((s): s is string => {
      if (typeof s !== "string") return false;
      try {
        const u = new URL(s);
        return u.protocol === "https:" && !u.username && !u.password;
      } catch {
        return false;
      }
    })
    .slice(0, 4);
  if (!images.length) return null;
  return {
    id: `retail-${row.id}`,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: "apparel",
    status: "available",
    image: images[0],
    images,
    pricing: {
      type: "fixed",
      basePrice: Math.round(price * 100) / 100,
      baseQuantity: 1,
      unit: "piece",
    },
    options: [
      {
        id: "size",
        label: "Size",
        type: "select",
        required: true,
        choices: row.apparel_sizes.map((s) => ({ id: s, label: s })),
      },
      {
        id: "colour",
        label: "Colour",
        type: "select",
        required: true,
        choices: row.apparel_colours.map((s) => ({ id: s, label: s })),
      },
    ],
  };
}
