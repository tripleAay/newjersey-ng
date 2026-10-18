import "server-only";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  STORE_FIELDS,
  toStoreProduct,
  type StoreRow,
  type Department,
} from "./catalogue";
import {
  APPAREL_FIELDS,
  toApparelProduct,
  type ApparelRow,
} from "@/app/lib/newjersey/apparel/catalogue";
import {
  JERSEY_FIELDS,
  toJerseyProduct,
  type JerseyRow,
} from "@/app/lib/newjersey/jerseys/catalogue";
export async function loadDepartment(department: Department) {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(STORE_FIELDS)
    .eq("catalogue_department", department)
    .eq("publication_status", "published")
    .eq("catalogue_enabled", true)
    .order("featured", { ascending: false })
    .order("catalogue_rank")
    .order("id")
    .limit(200);
  if (error) {
    console.error(
      "[Store catalogue] " +
        JSON.stringify({
          department,
          code: error.code || null,
          message: error.message || "Unknown database error",
          details: error.details || null,
          hint: error.hint || null,
        }),
    );
    throw new Error("Unable to load products. Check the storefront migration.");
  }
  return ((data ?? []) as unknown as StoreRow[])
    .map(toStoreProduct)
    .filter((p) => p !== null);
}
export async function loadApparel() {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(APPAREL_FIELDS)
    .eq("apparel_enabled", true)
    .eq("jersey_enabled", false)
    .eq("publication_status", "published")
    .order("featured", { ascending: false })
    .order("id")
    .limit(200);
  if (error) throw new Error("Unable to load apparel.");
  return ((data ?? []) as unknown as ApparelRow[])
    .map(toApparelProduct)
    .filter((p) => p !== null);
}
export async function loadJerseys() {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(JERSEY_FIELDS)
    .eq("jersey_enabled", true)
    .eq("publication_status", "published")
    .order("featured", { ascending: false })
    .order("id")
    .limit(200);
  if (error) throw new Error("Unable to load jerseys.");
  return ((data ?? []) as unknown as JerseyRow[])
    .map(toJerseyProduct)
    .filter((p) => p !== null);
}
export async function loadStoreProduct(department: Department, slug: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("products")
    .select(STORE_FIELDS)
    .eq("catalogue_department", department)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error("Unable to load product.");
  return data ? toStoreProduct(data as unknown as StoreRow) : null;
}
