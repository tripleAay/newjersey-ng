"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

const MAX_IMAGES = 4;

function fail(message: string): never {
  redirect(
    `/admin/products/new?error=${encodeURIComponent(message)}`
  );
}

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      value.length <= 2048
    );
  } catch {
    return false;
  }
}

export async function saveProduct(formData: FormData) {
  await requireStoreAdmin();

  const read = (key: string) =>
    String(formData.get(key) ?? "").trim();

  const name = read("name");
  const slug = read("slug").toLowerCase();
  const description = read("description");
  const category = read("category");

  const rawPrice = read("price");
  const price = Number(rawPrice);

  const saleMode = read("sale_mode") || "fixed";
  const fulfillment =
    read("fulfillment_type") || "made_to_order";
  const publication =
    read("publication_status") || "draft";

  const imageUrls = read("image_urls")
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (!name || name.length > 160) {
    fail("Enter a product name of up to 160 characters.");
  }

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    slug.length > 160
  ) {
    fail(
      "Use a URL name containing lowercase letters, numbers and hyphens."
    );
  }

  if (description.length > 10000) {
    fail("Keep the description within 10,000 characters.");
  }

  if (category.length > 100) {
    fail("Keep the category within 100 characters.");
  }

  if (!["fixed", "starting_from", "quote"].includes(saleMode)) {
    fail("Choose a valid pricing type.");
  }

  if (
    saleMode !== "quote" &&
    (
      !/^\d+(?:\.\d{1,2})?$/.test(rawPrice) ||
      !Number.isFinite(price) ||
      price < 0 ||
      price > 9999999999
    )
  ) {
    fail(
      "Enter a valid price without currency symbols or commas, such as 18000."
    );
  }

  if (
    ![
      "in_stock",
      "made_to_order",
      "preorder",
      "digital",
      "service",
    ].includes(fulfillment)
  ) {
    fail("Choose a valid fulfillment type.");
  }

  if (!["draft", "published"].includes(publication)) {
    fail("Choose draft or published.");
  }

  if (imageUrls.length > MAX_IMAGES) {
    fail("Use up to four images per product.");
  }

  if (imageUrls.some((url) => !isValidImageUrl(url))) {
    fail("Each product image must have a valid HTTPS URL.");
  }

  if (
    publication === "published" &&
    imageUrls.length === 0
  ) {
    fail("Upload at least one image before publishing.");
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description: description || null,
      category: category || null,
      price:
        saleMode === "quote"
          ? 0
          : Math.round(price * 100) / 100,
      currency: "NGN",
      sale_mode: saleMode,
      fulfillment_type: fulfillment,
      publication_status: publication,
      image_url: imageUrls[0] ?? null,
      image_urls: imageUrls,
      featured: formData.get("featured") === "on",
      status: "active",
      stock: 0,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("[NewJersey Save Product]", error);

    fail(
      error.code === "23505"
        ? "That URL name already exists. Choose another."
        : "Product could not be saved. Check the development terminal."
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");

  redirect("/admin/products?created=1");
}