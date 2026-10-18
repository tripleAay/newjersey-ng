import { NextRequest } from "next/server";
import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import {
  UUID,
  messageText,
  parseCursor,
} from "@/app/lib/newjersey/support/model";
import {
  readMessages,
  result,
  sameOrigin,
  smallBody,
} from "@/app/lib/newjersey/support/server";
export const dynamic = "force-dynamic";
async function admin() {
  const current = await getCurrentAdmin();
  return current && ["owner", "admin"].includes(current.profile.role)
    ? current
    : null;
}
export async function GET(request: NextRequest) {
  try {
    const current = await admin();
    if (!current)
      return result({ message: "Store admin access required." }, 403);
    const id = request.nextUrl.searchParams.get("thread");
    const db = getSupabaseAdmin();
    if (id) {
      if (!UUID.test(id))
        return result({ message: "Invalid conversation." }, 400);
      const { data: thread, error } = await db
        .from("support_threads")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!thread) return result({ message: "Conversation not found." }, 404);
      return result({
        viewerId: current.user.id,
        thread,
        ...(await readMessages(id, request.nextUrl.searchParams.get("before"))),
      });
    }
    const cursor = parseCursor(request.nextUrl.searchParams.get("before"));
    let query = db.from("support_threads").select("*");
    if (cursor)
      query = query.or(
        `updated_at.lt.${cursor.date},and(updated_at.eq.${cursor.date},id.lt.${cursor.id})`,
      );
    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(51);
    if (error) throw error;
    const threads = (data ?? []).slice(0, 50);
    const last = threads[threads.length - 1];
    return result({
      threads,
      hasMore: (data ?? []).length > 50,
      cursor: last ? `${last.updated_at}|${last.id}` : null,
    });
  } catch (error) {
    console.error("[Admin support load]", error);
    return result(
      {
        message:
          "Support could not be loaded. Check the support migration and retry.",
      },
      503,
    );
  }
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return result({ message: "Invalid request origin." }, 403);
  try {
    const current = await admin();
    if (!current)
      return result({ message: "Store admin access required." }, 403);
    let body: Record<string, unknown>;
    let text: string;
    try {
      body = await smallBody(request);
      text = messageText(body.message);
      if (
        typeof body.threadId !== "string" ||
        !UUID.test(body.threadId) ||
        typeof body.requestId !== "string" ||
        !UUID.test(body.requestId)
      )
        throw new Error("Invalid conversation.");
    } catch (error) {
      return result(
        {
          message:
            error instanceof Error ? error.message : "Check your message.",
        },
        400,
      );
    }
    const db = getSupabaseAdmin();
    const { data: thread, error: threadError } = await db
      .from("support_threads")
      .select("customer_id")
      .eq("id", body.threadId)
      .maybeSingle();
    if (threadError) throw threadError;
    if (!thread) return result({ message: "Conversation not found." }, 404);
    const { error } = await db.rpc("send_support_message", {
      p_customer_id: thread.customer_id,
      p_sender_id: current.user.id,
      p_sender_role: "admin",
      p_body: text,
      p_request_id: body.requestId,
    });
    if (error) {
      if (error.message.includes("wait a minute"))
        return result({ message: error.message }, 429);
      throw error;
    }
    return result({ saved: true });
  } catch (error) {
    console.error("[Admin support reply]", error);
    return result(
      {
        message:
          "Reply could not be confirmed. Retry with the same message to avoid duplicates.",
      },
      503,
    );
  }
}
export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request))
    return result({ message: "Invalid request origin." }, 403);
  try {
    const current = await admin();
    if (!current)
      return result({ message: "Store admin access required." }, 403);
    const body = await smallBody(request);
    if (typeof body.threadId !== "string" || !UUID.test(body.threadId))
      return result({ message: "Invalid conversation." }, 400);
    const db = getSupabaseAdmin();
    if (body.status === "open" || body.status === "closed") {
      if (
        typeof body.expectedUpdatedAt !== "string" ||
        !Number.isFinite(Date.parse(body.expectedUpdatedAt))
      )
        return result({ message: "Refresh the conversation." }, 400);
      const { data, error } = await db
        .from("support_threads")
        .update({ status: body.status })
        .eq("id", body.threadId)
        .eq("updated_at", body.expectedUpdatedAt)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data)
        return result(
          { message: "The conversation changed. Refresh and try again." },
          409,
        );
    } else {
      if (
        typeof body.lastMessageId !== "string" ||
        !UUID.test(body.lastMessageId)
      )
        return result({ message: "Invalid message." }, 400);
      const { error } = await db.rpc("mark_support_read", {
        p_thread_id: body.threadId,
        p_actor_id: current.user.id,
        p_actor_role: "admin",
        p_message_id: body.lastMessageId,
      });
      if (error) throw error;
    }
    return result({ saved: true });
  } catch (error) {
    console.error("[Admin support update]", error);
    return result({ message: "Conversation could not be updated." }, 503);
  }
}
