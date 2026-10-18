import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID } from "@/app/lib/newjersey/design/model";
export const runtime = "nodejs";
const reply = (error: string, status = 400) =>
  NextResponse.json({ error }, { status });
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return reply("Invalid request origin.", 403);
  if (Number(request.headers.get("content-length") || 0) > 21 * 1024 * 1024)
    return reply("File too large.", 413);
  const auth = await createClient();
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();
  if (authError || !user) return reply("Please sign in again.", 401);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply("Unable to read this file.");
  }
  const id = String(form.get("order_id") || "");
  const kind = String(form.get("kind") || "");
  const expected = String(form.get("expected") || "");
  const file = form.get("file");
  if (
    !UUID.test(id) ||
    !["reference", "delivery"].includes(kind) ||
    !expected ||
    !(file instanceof File)
  )
    return reply("Check your upload.");
  const max = kind === "reference" ? 10 * 1024 * 1024 : 20 * 1024 * 1024;
  if (file.size <= 0 || file.size > max)
    return reply("This file exceeds the permitted size.");
  const db = getSupabaseAdmin();
  const { data: project, error } = await db
    .from("design_projects")
    .select("customer_id")
    .eq("order_id", id)
    .maybeSingle();
  if (error) return reply("Unable to check this project.", 503);
  if (!project) return reply("Project not found.", 404);
  if (kind === "reference") {
    if (project.customer_id !== user.id) return reply("Access denied.", 403);
  } else {
    const { data: admin, error: adminError } = await db
      .from("admin_users")
      .select("role")
      .eq("id", user.id)
      .eq("active", true)
      .maybeSingle();
    if (adminError || !admin || !["owner", "admin"].includes(admin.role))
      return reply("Admin access required.", 403);
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  let mime = "",
    extension = "";
  if (bytes.subarray(0, 5).toString() === "%PDF-") {
    mime = "application/pdf";
    extension = "pdf";
  } else if (
    bytes.length >= 3 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255
  ) {
    mime = "image/jpeg";
    extension = "jpg";
  } else if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    mime = "image/png";
    extension = "png";
  } else if (
    bytes.subarray(0, 4).toString() === "RIFF" &&
    bytes.subarray(8, 12).toString() === "WEBP"
  ) {
    mime = "image/webp";
    extension = "webp";
  } else if (
    kind === "delivery" &&
    bytes[0] === 80 &&
    bytes[1] === 75 &&
    ((bytes[2] === 3 && bytes[3] === 4) || (bytes[2] === 5 && bytes[3] === 6))
  ) {
    mime = "application/zip";
    extension = "zip";
  }
  if (!mime) return reply("Use a supported PDF, image or delivery ZIP.");
  const name =
    file.name.replace(/[\x00-\x1f\x7f/\\]/g, "_").slice(0, 160) ||
    "design." + extension;
  const path = `${project.customer_id}/${id}/${randomUUID()}.${extension}`;
  const bucket = db.storage.from("newjersey-design-files");
  const { error: uploadError } = await bucket.upload(path, bytes, {
    contentType: mime,
    upsert: false,
  });
  if (uploadError) {
    console.error("[Design upload]", uploadError);
    return reply("File upload failed. Please try again.", 503);
  }
  const { data: saved, error: saveError } = await db.rpc("attach_design_file", {
    p_order_id: id,
    p_actor_id: user.id,
    p_kind: kind,
    p_expected: expected,
    p_path: path,
    p_name: name,
    p_mime: mime,
    p_size: bytes.length,
  });
  if (saveError || !saved) {
    console.error("[Design file attach]", saveError);
    const check = await db
      .from("design_files")
      .select("id")
      .eq("storage_path", path)
      .maybeSingle();
    if (!check.error && !check.data) await bucket.remove([path]);
    if (check.error || !check.data)
      return reply(
        "File not attached. Refresh the project before trying again.",
        409,
      );
  }
  revalidatePath("/shop/design/" + id);
  revalidatePath("/admin/design/" + id);
  revalidatePath("/admin/design");
  return NextResponse.json({ ok: true });
}
