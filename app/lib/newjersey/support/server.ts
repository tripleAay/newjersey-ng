import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { parseCursor, type SupportMessage } from "./model";
export const privateHeaders = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};
export function result(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: privateHeaders });
}
export function sameOrigin(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}
export async function smallBody(
  request: NextRequest,
): Promise<Record<string, unknown>> {
  // Bound streamed request bytes as well as the optional Content-Length header.
  if (Number(request.headers.get("content-length") ?? 0) > 16000)
    throw new Error("Request too large.");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing request.");
  const decoder = new TextDecoder();
  let size = 0,
    text = "";
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        throw new Error("Request too large.");
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  const body: unknown = JSON.parse(text);
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Invalid request.");
  return body as Record<string, unknown>;
}
export async function readMessages(
  threadId: string,
  cursorValue: string | null,
) {
  const cursor = parseCursor(cursorValue);
  let query = getSupabaseAdmin()
    .from("support_messages")
    .select("id,sender_role,body,created_at")
    .eq("thread_id", threadId);
  if (cursor)
    query = query.or(
      `created_at.lt.${cursor.date},and(created_at.eq.${cursor.date},id.lt.${cursor.id})`,
    );
  const { data, error } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(61);
  if (error) throw error;
  const list = (data ?? []) as SupportMessage[];
  const hasOlder = list.length > 60;
  const messages = list.slice(0, 60).reverse();
  const first = messages[0];
  return {
    messages,
    hasOlder,
    cursor: first ? `${first.created_at}|${first.id}` : null,
  };
}
