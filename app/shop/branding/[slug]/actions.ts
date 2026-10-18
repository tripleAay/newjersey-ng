"use server";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { loadStoreProduct } from "@/app/lib/newjersey/storefront/load";
export async function sendBrandingEnquiry(input: {
  slug: string;
  department: "print" | "branding";
  key: string;
  name: string;
  phone: string;
  brief: string;
  location: string;
}) {
  const auth = await createClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (error || !user)
    return { error: "Please sign in before sending your request." };
  if (
    !input ||
    ["slug", "department", "key", "name", "phone", "brief", "location"].some(
      (k) =>
        typeof (input as unknown as Record<string, unknown>)[k] !== "string",
    ) ||
    !["print", "branding"].includes(input.department) ||
    !/^[a-z0-9-]{1,160}$/.test(input.slug) ||
    !/^[0-9a-f-]{36}$/i.test(input.key) ||
    !input.name.trim() ||
    input.name.length > 120 ||
    !/^\+?[0-9 ()-]{7,30}$/.test(input.phone) ||
    input.phone.replace(/\D/g, "").length < 7 ||
    input.brief.trim().length < 15 ||
    input.brief.length > 3000 ||
    !input.location.trim() ||
    input.location.length > 300
  )
    return { error: "Check your contact details, location and project brief." };
  const p = await loadStoreProduct(input.department, input.slug);
  if (!p || p.pricing.type !== "quote")
    return { error: "This service has changed. Refresh the page." };
  const db = getSupabaseAdmin();
  const { data, error: saveError } = await db
    .from("catalogue_enquiries")
    .insert({
      customer_id: user.id,
      submission_key: input.key,
      product_id: p.id.slice(6),
      product_name: p.name,
      customer_name: input.name.trim(),
      customer_email: user.email,
      customer_phone: input.phone.trim(),
      brief: input.brief.trim(),
      location: input.location.trim(),
    })
    .select("id")
    .single();
  if (saveError?.code === "23505") {
    const previous = await db
      .from("catalogue_enquiries")
      .select("id")
      .eq("customer_id", user.id)
      .eq("submission_key", input.key)
      .maybeSingle();
    if (previous.data) return { id: previous.data.id };
  }
  if (saveError) {
    console.error("[Branding enquiry]", saveError);
    return { error: "Your request could not be saved. Please try again." };
  }
  return { id: data.id };
}
