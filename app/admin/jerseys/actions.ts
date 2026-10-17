"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { minor } from "@/app/lib/newjersey/jerseys/catalogue";

export async function saveJersey(form: FormData): Promise<void> {
  await requireStoreAdmin();
  const idValue = form.get("product_id");
  const id = typeof idValue === "string" ? idValue : "";
  const validId = /^[1-9]\d{0,18}$/.test(id) && BigInt(id) <= 9223372036854775807n;
  const path = validId ? `/admin/jerseys/${id}` : "/admin/jerseys/new";
  function fail(message: string): never { redirect(`${path}?error=${encodeURIComponent(message)}`); }
  if (id && !validId) fail("Invalid jersey reference.");
  function read(key: string, max: number): string {
    const value = form.get(key);
    if (typeof value !== "string" || value.length > max) fail(`Invalid ${key.replaceAll("_", " ")}.`);
    return value.trim();
  }
  function amount(key: string, optional = false): number | null {
    const raw = read(key, 20);
    if (!raw && optional) return null;
    if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(raw) || minor(raw) === null) fail("Enter valid prices without commas or currency symbols.");
    return Number(raw);
  }
  const name = read("name", 160);
  const slug = read("slug", 160).toLowerCase();
  const team = read("team", 100);
  const season = read("season", 40);
  const kit = read("kit", 10);
  const description = read("description", 10000);
  const publication = read("publication_status", 20);
  const fulfillment = read("fulfillment_type", 30);
  if (!name || !team || !season) fail("Enter the jersey name, team and season.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("Use a unique URL name with lowercase letters, numbers and hyphens.");
  if (!["home", "away", "third"].includes(kit)) fail("Choose a kit.");
  if (!["draft", "published"].includes(publication)) fail("Choose draft or published.");
  if (!["in_stock", "made_to_order", "preorder"].includes(fulfillment)) fail("Choose a fulfillment option.");
  const sizes = [...new Set(read("sizes", 200).split(",").map(value => value.trim().toUpperCase()).filter(Boolean))];
  if (!sizes.length || sizes.length > 20 || sizes.some(value => !/^[A-Z0-9 -]{1,15}$/.test(value))) fail("Enter valid sizes separated by commas.");
  const price = amount("price");
  const nameFee = amount("name_fee", true);
  const numberFee = amount("number_fee", true);
  if (price === null || price <= 0) fail("Enter a jersey price greater than zero.");
  const images = [...new Set(read("image_urls", 8500).split(/\r?\n/).map(value => value.trim()).filter(Boolean))];
  if (images.length > 4) fail("Use up to four images.");
  for (const image of images) {
    try {
      const url = new URL(image);
      if (url.protocol !== "https:" || url.username || url.password || image.length > 2048) fail("Use valid HTTPS image URLs.");
    } catch { fail("Use valid HTTPS image URLs."); }
  }
  if (publication === "published" && !images.length) fail("Upload at least one jersey image before publishing.");
  const supabase = getSupabaseAdmin();
  const payload = {
    name, slug, description: description || null, category: "Jerseys", price,
    currency: "NGN", sale_mode: "fixed", fulfillment_type: fulfillment,
    publication_status: publication, featured: form.get("featured") === "on",
    image_url: images[0] ?? null, image_urls: images, jersey_enabled: form.get("enabled") === "on",
    jersey_team: team, jersey_season: season, jersey_kit: kit, jersey_sizes: sizes,
    jersey_name_fee: nameFee, jersey_number_fee: numberFee, updated_at: new Date().toISOString(),
  };
  let savedId: string;
  if (validId) {
    const expected = read("expected_updated_at", 100);
    let update = supabase.from("products").update(payload).eq("id", id);
    update = expected ? update.eq("updated_at", expected) : update.is("updated_at", null);
    const { data, error } = await update.select("id").maybeSingle();
    if (error) { console.error("[Update jersey]", error); fail(error.code === "23505" ? "That URL name already exists." : "Unable to save this jersey."); }
    if (!data) fail("This product changed or was removed. Refresh before saving again.");
    savedId = String(data.id);
  } else {
    const { data, error } = await supabase.from("products").insert({ ...payload, design_fee: 0, status: "active", stock: 0 }).select("id").single();
    if (error || !data) { console.error("[Create jersey]", error); fail(error?.code === "23505" ? "That URL name already exists." : "Unable to create this jersey."); }
    savedId = String(data.id);
  }
  for (const route of ["/admin/jerseys", `/admin/jerseys/${savedId}`, "/admin/products", `/admin/products/${savedId}`, "/shop", "/shop/jerseys"]) revalidatePath(route);
  redirect(`/admin/jerseys/${savedId}?saved=1`);
}
