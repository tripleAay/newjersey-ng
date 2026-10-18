import { createHmac } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
export const runtime = "nodejs";
const reply = (message: string, status = 200) =>
  NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin)
    return reply("Please submit using this website.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply("Invalid request.", 415);
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply("Invalid request.", 400);
    let bytes = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 4096) {
        await reader.cancel();
        return reply("Request too large.", 413);
      }
      chunks.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const chunk of chunks) {
      buffer.set(chunk, offset);
      offset += chunk.length;
    }
    const parsed = JSON.parse(new TextDecoder().decode(buffer));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw Error();
    body = parsed;
  } catch {
    return reply("Invalid request.", 400);
  }
  const success = "Your subscription request has been received.";
  if (typeof body.website === "string" && body.website.trim())
    return reply(success);
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\u0000-\u001f\u007f]/.test(email)
  )
    return reply("Enter a valid email address.", 400);
  if (body.consent !== true)
    return reply("Please agree to receive email updates.", 400);
  try {
    // Vercel owns x-vercel-forwarded-for. Other hosts share a conservative fallback bucket.
    const address =
      process.env.VERCEL === "1"
        ? request.headers
            .get("x-vercel-forwarded-for")
            ?.split(",")[0]
            ?.trim() || "unknown"
        : "development";
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) throw Error("Configuration unavailable");
    const bucket = createHmac("sha256", secret)
      .update(`newsletter:${new Date().toISOString().slice(0, 10)}:${address}`)
      .digest("hex");
    const { error } = await getSupabaseAdmin().rpc(
      "request_newsletter_subscription",
      { p_email: email, p_rate_key: bucket },
    );
    if (error) {
      if (error.message.includes("newsletter_rate_limit"))
        return reply("Too many attempts. Please try again later.", 429);
      throw error;
    }
    return reply(success);
  } catch {
    console.error("[Newsletter] Unable to save subscription request.");
    return reply(
      "We couldn’t save your request. Please try again shortly.",
      503,
    );
  }
}
