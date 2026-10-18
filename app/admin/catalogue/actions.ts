"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  parseOptions,
  validImage,
  amount,
} from "@/app/lib/newjersey/storefront/catalogue";
export async function saveCatalogue(form: FormData): Promise<void> {
  await requireStoreAdmin();
  const id = String(form.get("id") || "");
  if (!/^[1-9]\d{0,18}$/.test(id)) redirect("/admin/catalogue");
  const path = "/admin/catalogue/" + id;
  function fail(m: string): never {
    redirect(path + "?error=" + encodeURIComponent(m));
  }
  function read(key: string, max: number) {
    const v = form.get(key);
    if (typeof v !== "string" || v.length > max) fail("Check " + key + ".");
    return v.trim();
  }
  const name = read("name", 160),
    slug = read("slug", 160),
    description = read("description", 10000),
    dept = read("department", 20),
    sale = read("sale_mode", 20),
    pub = read("publication_status", 20),
    unit = read("unit", 40),
    quantity = Number(read("quantity", 8)),
    rank = Number(read("rank", 8)),
    price = amount(read("price", 20)),
    rawFee = read("design_fee", 20),
    fee = rawFee ? amount(rawFee) : null,
    expected = read("expected", 60),
    topic = read("topic", 20);
  if (
    !name ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !["print", "branding"].includes(dept) ||
    !["fixed", "starting_from", "quote"].includes(sale) ||
    !["draft", "published"].includes(pub) ||
    !unit ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 1000000 ||
    !Number.isInteger(rank) ||
    rank < 0 ||
    rank > 99999 ||
    !["general", "signage", "vehicle", "space", "identity"].includes(topic) ||
    (sale !== "quote" && (price === null || price <= 0)) ||
    (rawFee && fee === null)
  )
    fail("Check the product name, URL, price, quantity and department.");
  const images = [
    ...new Set(
      read("image_urls", 8500)
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
  if (images.length > 4 || images.some((s) => !validImage(s)))
    fail("Use up to four valid HTTPS images or existing /images/ paths.");
  let options;
  try {
    options = parseOptions(JSON.parse(read("options", 30000)));
  } catch (e) {
    fail(e instanceof Error ? e.message : "Check product options.");
  }
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .update({
      name,
      slug,
      description,
      price: sale === "quote" ? 0 : price,
      currency: "NGN",
      sale_mode: sale,
      design_fee: fee,
      publication_status: pub,
      image_url: images[0] ?? null,
      image_urls: images,
      featured: form.get("featured") === "on",
      catalogue_department: dept,
      catalogue_enabled: form.get("enabled") === "on",
      catalogue_rank: rank,
      catalogue_quantity: quantity,
      catalogue_unit: unit,
      catalogue_options: options,
      catalogue_topic: topic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("jersey_enabled", false)
    .eq("apparel_enabled", false)
    .eq("updated_at", expected)
    .select("id");
  if (error || !data?.length) {
    console.error("[Catalogue save]", error);
    fail("Not saved. Refresh this page and check that the URL is unique.");
  }
  for (const p of [
    "/shop",
    "/shop/print",
    "/shop/branding",
    "/shop/search",
    "/admin/catalogue",
  ])
    revalidatePath(p);
  revalidatePath(path);
  revalidatePath("/shop/" + dept + "/" + slug);
  redirect(path + "?saved=1");
}
export async function updateEnquiry(form: FormData): Promise<void> {
  await requireStoreAdmin();
  const id = String(form.get("id") || ""),
    status = String(form.get("status") || "");
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !["new", "reviewing", "quoted", "closed"].includes(status)
  )
    redirect("/admin/catalogue/enquiries");
  const { error } = await getSupabaseAdmin()
    .from("catalogue_enquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error("Unable to update enquiry.");
  revalidatePath("/admin/catalogue/enquiries");
  redirect("/admin/catalogue/enquiries?saved=1");
}
