import type { NewJerseyProduct, ProductOption } from "@/app/types/commerce";
export type Department = "print" | "branding";
export const STORE_FIELDS =
  "id,slug,name,description,price,currency,sale_mode,publication_status,featured,image_url,image_urls,design_fee,jersey_enabled,apparel_enabled,catalogue_department,catalogue_enabled,catalogue_rank,catalogue_unit,catalogue_quantity,catalogue_options,catalogue_topic,catalogue_legacy_id,updated_at";
export type StoreRow = {
  id: string | number;
  slug: string;
  name: string;
  description: string | null;
  price: number | string | null;
  currency: string;
  sale_mode: string;
  publication_status: string;
  featured: boolean;
  image_url: string | null;
  image_urls: string[] | null;
  design_fee: number | string | null;
  jersey_enabled: boolean;
  apparel_enabled: boolean;
  catalogue_department: Department | null;
  catalogue_enabled: boolean;
  catalogue_rank: number;
  catalogue_unit: string;
  catalogue_quantity: number;
  catalogue_options: unknown;
  catalogue_topic: string;
  catalogue_legacy_id: string | null;
  updated_at: string;
};
export type StoreProduct = NewJerseyProduct & {
  department: Department;
  topic: string;
  rank: number;
  legacyId: string | null;
};
export function amount(v: unknown) {
  if (
    (typeof v !== "string" && typeof v !== "number") ||
    String(v).trim() === ""
  )
    return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 99999999.99
    ? Math.round(n * 100) / 100
    : null;
}
export function validImage(s: unknown): s is string {
  if (typeof s !== "string" || s.length > 2048) return false;
  if (/^\/images\/[a-zA-Z0-9/_.,@-]+$/.test(s) && !s.includes(".."))
    return true;
  try {
    const u = new URL(s);
    return u.protocol === "https:" && !u.username && !u.password;
  } catch {
    return false;
  }
}
export function parseOptions(input: unknown): ProductOption[] {
  if (!Array.isArray(input) || input.length > 12)
    throw new Error("Use up to twelve product options.");
  const optionIds = new Set<string>();
  return input.map((raw) => {
    if (!raw || typeof raw !== "object")
      throw new Error("Invalid product option.");
    const o = raw as Record<string, unknown>;
    if (
      typeof o.id !== "string" ||
      !/^[a-z0-9-]{1,50}$/.test(o.id) ||
      optionIds.has(o.id) ||
      typeof o.label !== "string" ||
      !o.label.trim() ||
      o.label.length > 80 ||
      !["select", "radio", "quantity"].includes(String(o.type)) ||
      !Array.isArray(o.choices) ||
      !o.choices.length ||
      o.choices.length > 30
    )
      throw new Error("Check option IDs, labels and choices.");
    optionIds.add(o.id);
    const ids = new Set<string>();
    return {
      id: o.id,
      label: o.label.trim(),
      type: o.type as ProductOption["type"],
      required: o.required !== false,
      choices: o.choices.map((v: unknown) => {
        if (!v || typeof v !== "object")
          throw new Error("Invalid option choice.");
        const c = v as Record<string, unknown>;
        const modifier =
          c.priceModifier === undefined ? 0 : amount(c.priceModifier);
        if (
          typeof c.id !== "string" ||
          !c.id ||
          c.id.length > 80 ||
          ids.has(c.id) ||
          typeof c.label !== "string" ||
          !c.label.trim() ||
          c.label.length > 120 ||
          modifier === null
        )
          throw new Error("Check option choices and non-negative charges.");
        ids.add(c.id);
        return { id: c.id, label: c.label.trim(), priceModifier: modifier };
      }),
    };
  });
}
export function toStoreProduct(row: StoreRow): StoreProduct | null {
  if (
    !row.catalogue_enabled ||
    !["print", "branding"].includes(row.catalogue_department ?? "") ||
    row.jersey_enabled ||
    row.apparel_enabled ||
    row.publication_status !== "published" ||
    row.currency !== "NGN" ||
    !["fixed", "starting_from", "quote"].includes(row.sale_mode) ||
    !Number.isInteger(row.catalogue_quantity) ||
    row.catalogue_quantity < 1
  )
    return null;
  const price = amount(row.price);
  if (row.sale_mode !== "quote" && (price === null || price <= 0)) return null;
  let options: ProductOption[];
  try {
    options = parseOptions(row.catalogue_options ?? []);
  } catch {
    return null;
  }
  const images = [
    ...new Set([
      row.image_url,
      ...(Array.isArray(row.image_urls) ? row.image_urls : []),
    ]),
  ]
    .filter(validImage)
    .slice(0, 4);
  const designFee = amount(row.design_fee);
  return {
    id: "store-" + row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: row.catalogue_department === "print" ? "print" : "merch",
    department: row.catalogue_department!,
    topic: row.catalogue_topic || "",
    rank: row.catalogue_rank || 0,
    legacyId: row.catalogue_legacy_id,
    image: images[0] ?? "",
    images,
    status: "made-to-order",
    featured: row.featured,
    published: true,
    pricing: {
      type:
        row.sale_mode === "starting_from"
          ? "starting-from"
          : (row.sale_mode as "fixed" | "quote"),
      basePrice: price ?? undefined,
      baseQuantity: row.catalogue_quantity,
      unit: row.catalogue_unit || "pieces",
    },
    options,
    designFee: designFee ?? undefined,
  };
}
export function productHref(p: NewJerseyProduct) {
  return p.id.startsWith("retail-")
    ? "/shop/apparel/" + encodeURIComponent(p.slug)
    : "/shop/" +
        (p.category === "print" ? "print" : "branding") +
        "/" +
        encodeURIComponent(p.slug);
}
