"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
export async function saveApparel(form: FormData): Promise<void> {
  await requireStoreAdmin();
  const id = String(form.get("product_id") ?? "");
  function fail(message: string): never {
    redirect(`/admin/apparel?error=${encodeURIComponent(message)}`);
  }
  if (!/^[1-9]\d{0,18}$/.test(id)) fail("Invalid product.");
  function list(key: string) {
    const raw = form.get(key);
    if (typeof raw !== "string" || raw.length > 500) fail("Invalid options.");
    const values = [
      ...new Set(
        raw
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      ),
    ];
    if (
      !values.length ||
      values.length > 30 ||
      values.some((x) => x.length > 40 || /[\x00-\x1f]/.test(x))
    )
      fail("Enter sizes and colours separated by commas.");
    return values;
  }
  function text(key: string, max: number) {
    const raw = form.get(key);
    if (typeof raw !== "string" || raw.length > max) fail(`Invalid ${key}.`);
    return raw.trim();
  }
  const name = text("name", 160),
    slug = text("slug", 160),
    description = text("description", 10000),
    rawPrice = text("price", 20),
    publication = text("publication_status", 20);
  if (
    !name ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !/^\d{1,8}(?:\.\d{1,2})?$/.test(rawPrice) ||
    Number(rawPrice) <= 0 ||
    !["draft", "published"].includes(publication)
  )
    fail(
      "Enter a name, lowercase URL slug, positive price and publication status.",
    );
  const images = [
    ...new Set(
      text("image_urls", 8500)
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  ];
  if (images.length > 4) fail("Use up to four images.");
  for (const image of images) {
    try {
      const u = new URL(image);
      if (u.protocol !== "https:" || u.username || u.password)
        fail("Use valid HTTPS images.");
    } catch {
      fail("Use valid HTTPS images.");
    }
  }
  const enabled = form.get("enabled") === "on";
  if (enabled && publication === "published" && !images.length)
    fail("Upload at least one finished product image before publishing.");
  const sizes = list("sizes"),
    colours = list("colours");
  const supabase = getSupabaseAdmin();
  const { error, data } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      price: Number(rawPrice),
      currency: "NGN",
      sale_mode: "fixed",
      publication_status: publication,
      image_url: images[0] ?? null,
      image_urls: images,
      apparel_enabled: form.get("enabled") === "on",
      apparel_sizes: sizes,
      apparel_colours: colours,
    })
    .eq("id", id)
    .eq("jersey_enabled", false)
    .select("id")
    .maybeSingle();
  if (error || !data)
    fail(
      "Unable to save apparel settings. Jersey products cannot be enabled here.",
    );
  revalidatePath("/admin/apparel");
  revalidatePath("/shop/apparel");
  revalidatePath("/shop");
  redirect("/admin/apparel?saved=1");
}
