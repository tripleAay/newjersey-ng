"use server";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "@/app/lib/newjersey/design/model";
export async function sendDesignBrief(input: {
  key: string;
  designer: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  deadline: string;
}): Promise<{ id?: string; error?: string }> {
  const auth = await createClient();
  const {
    data: { user },
    error,
  } = await auth.auth.getUser();
  if (error || !user)
    return { error: "Please sign in, then return here to send your brief." };
  if (
    !input ||
    [
      "key",
      "designer",
      "type",
      "name",
      "email",
      "phone",
      "description",
      "deadline",
    ].some(
      (key) =>
        typeof (input as unknown as Record<string, unknown>)[key] !== "string",
    ) ||
    !UUID.test(input.key) ||
    !["ink", "form"].includes(input.designer) ||
    !input.type?.trim() ||
    input.type.length > 100 ||
    !input.name?.trim() ||
    input.name.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email) ||
    input.email.length > 254 ||
    !/^\+?[0-9 ()-]{7,30}$/.test(input.phone) ||
    input.phone.replace(/\D/g, "").length < 7 ||
    input.phone.replace(/\D/g, "").length > 15 ||
    input.description.trim().length < 15 ||
    input.description.length > 3000 ||
    (input.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(input.deadline))
  )
    return { error: "Check your brief and contact details." };
  const { data, error: saveError } = await getSupabaseAdmin().rpc(
    "create_design_project",
    {
      p_customer_id: user.id,
      p_key: input.key,
      p_designer: input.designer,
      p_type: input.type,
      p_brief: input.description,
      p_name: input.name,
      p_email: input.email,
      p_phone: input.phone,
      p_deadline: input.deadline || null,
    },
  );
  if (saveError || typeof data !== "string" || !UUID.test(data)) {
    console.error("[Design brief]", saveError);
    return {
      error: "Your brief could not be saved. Try again using this page.",
    };
  }
  return { id: data };
}
