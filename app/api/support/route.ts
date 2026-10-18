import { NextRequest } from "next/server";
import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { UUID, messageText } from "@/app/lib/newjersey/support/model";
import {
  readMessages,
  result,
  sameOrigin,
  smallBody,
} from "@/app/lib/newjersey/support/server";
export const dynamic = "force-dynamic";
async function viewer() {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  return error ? null : user;
}
export async function GET(request: NextRequest) {
  try {
    const user = await viewer();
    if (!user)
      return result({ message: "Please sign in to message our team." }, 401);
    const db = getSupabaseAdmin();
    const { data: thread, error } = await db
      .from("support_threads")
      .select("*")
      .eq("customer_id", user.id)
      .maybeSingle();
    if (error) throw error;
    if (request.nextUrl.searchParams.get("summary") === "1")
      return result({
        viewerId: user.id,
        thread,
        messages: [],
        hasOlder: false,
        cursor: null,
      });
    const page = thread
      ? await readMessages(
          thread.id,
          request.nextUrl.searchParams.get("before"),
        )
      : { messages: [], hasOlder: false, cursor: null };
    return result({ viewerId: user.id, thread, ...page });
  } catch (error) {
    console.error("[Customer support load]", error);
    return result(
      {
        message:
          "Support could not be loaded. Please retry or email hello@newjersey.ng.",
      },
      503,
    );
  }
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request))
    return result({ message: "Invalid request origin." }, 403);
  try {
    const user = await viewer();
    if (!user)
      return result({ message: "Please sign in to send your message." }, 401);
    let body: Record<string, unknown>;
    let text: string;
    try {
      body = await smallBody(request);
      text = messageText(body.message);
      if (typeof body.requestId !== "string" || !UUID.test(body.requestId))
        throw new Error("Refresh the conversation before sending.");
    } catch (error) {
      return result(
        {
          message:
            error instanceof Error ? error.message : "Check your message.",
        },
        400,
      );
    }
    const { data, error } = await getSupabaseAdmin().rpc(
      "send_support_message",
      {
        p_customer_id: user.id,
        p_sender_id: user.id,
        p_sender_role: "customer",
        p_body: text,
        p_request_id: body.requestId,
      },
    );
    if (error) {
      if (
        error.message.includes("wait a minute") ||
        error.message.includes("further help today")
      )
        return result({ message: error.message }, 429);
      throw error;
    }
    const rawName = user.user_metadata?.full_name;
    const name =
      typeof rawName === "string"
        ? rawName
            .replace(/[\u0000-\u001f\u007f]/g, "")
            .trim()
            .slice(0, 120)
        : "";
    if (name) {
      const { error: nameError } = await getSupabaseAdmin()
        .from("support_threads")
        .update({ customer_name: name })
        .eq("id", data)
        .eq("customer_id", user.id);
      if (nameError) console.error("[Support display name]", nameError);
    }
    return result({ threadId: data, saved: true });
  } catch (error) {
    console.error("[Customer support send]", error);
    return result(
      {
        message:
          "We could not confirm your message. Retry with the same message; it will not be saved twice.",
      },
      503,
    );
  }
}
export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request))
    return result({ message: "Invalid request origin." }, 403);
  try {
    const user = await viewer();
    if (!user) return result({ message: "Please sign in." }, 401);
    const body = await smallBody(request);
    if (
      typeof body.lastMessageId !== "string" ||
      !UUID.test(body.lastMessageId)
    )
      return result({ message: "Invalid message." }, 400);
    const db = getSupabaseAdmin();
    const { data: thread, error: loadError } = await db
      .from("support_threads")
      .select("id")
      .eq("customer_id", user.id)
      .maybeSingle();
    if (loadError) throw loadError;
    if (!thread) return result({ message: "Conversation not found." }, 404);
    const { error } = await db.rpc("mark_support_read", {
      p_thread_id: thread.id,
      p_actor_id: user.id,
      p_actor_role: "customer",
      p_message_id: body.lastMessageId,
    });
    if (error) throw error;
    return result({ saved: true });
  } catch (error) {
    console.error("[Customer support read]", error);
    return result({ message: "Read status could not be updated." }, 503);
  }
}
