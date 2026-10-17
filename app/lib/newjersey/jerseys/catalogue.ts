export const JERSEY_FIELDS = "id, name, slug, category, description, price, currency, sale_mode, publication_status, fulfillment_type, featured, image_url, image_urls, updated_at, jersey_enabled, jersey_team, jersey_season, jersey_kit, jersey_sizes, jersey_name_fee, jersey_number_fee";

export type JerseyRow = {
  id: string | number;
  name: string;
  category: string | null;
  slug: string;
  description: string | null;
  price: number | string | null;
  currency: string | null;
  sale_mode: string | null;
  publication_status: string | null;
  fulfillment_type: string | null;
  featured: boolean;
  image_url: string | null;
  image_urls: string[] | null;
  updated_at: string | null;
  jersey_enabled: boolean;
  jersey_team: string | null;
  jersey_season: string | null;
  jersey_kit: string | null;
  jersey_sizes: string[] | null;
  jersey_name_fee: number | string | null;
  jersey_number_fee: number | string | null;
};

export type JerseyProduct = {
  id: string;
  name: string;
  description: string;
  images: string[];
  team: string;
  season: string;
  kit: string;
  sizes: string[];
  priceMinor: number;
  nameFeeMinor: number | null;
  numberFeeMinor: number | null;
};

export function minor(value: unknown): number | null {
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 && amount <= 99999999.99
    ? Math.round(amount * 100) : null;
}

export function imagesFor(row: Pick<JerseyRow, "image_url" | "image_urls">): string[] {
  return [...new Set([row.image_url, ...(Array.isArray(row.image_urls) ? row.image_urls : [])])]
    .filter((value): value is string => {
      if (typeof value !== "string") return false;
      try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; }
      catch { return false; }
    }).slice(0, 4);
}

export function jerseyIssues(row: JerseyRow): string[] {
  const issues: string[] = [];
  if (!row.jersey_enabled) issues.push("Sales paused");
  if (row.publication_status !== "published") issues.push("Draft");
  if (row.currency !== "NGN" || row.sale_mode !== "fixed") issues.push("Fixed NGN pricing required");
  const price = minor(row.price);
  if (price === null || price <= 0) issues.push("Price missing");
  if (!row.jersey_team?.trim()) issues.push("Team missing");
  if (!row.jersey_season?.trim()) issues.push("Season missing");
  if (!["home", "away", "third"].includes(row.jersey_kit ?? "")) issues.push("Kit missing");
  if (!Array.isArray(row.jersey_sizes) || !row.jersey_sizes.length || row.jersey_sizes.some(size => typeof size !== "string" || !size.trim())) issues.push("Sizes missing");
  if (!imagesFor(row).length) issues.push("Image missing");
  return issues;
}

export function toJerseyProduct(row: JerseyRow): JerseyProduct | null {
  if (jerseyIssues(row).length) return null;
  return {
    id: String(row.id), name: row.name, description: row.description ?? "",
    images: imagesFor(row), team: row.jersey_team!, season: row.jersey_season!,
    kit: row.jersey_kit!, sizes: row.jersey_sizes!, priceMinor: minor(row.price)!,
    nameFeeMinor: minor(row.jersey_name_fee), numberFeeMinor: minor(row.jersey_number_fee),
  };
}
