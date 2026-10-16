import { NextRequest, NextResponse } from "next/server";

import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const headers = {
  "Cache-Control": "private, no-store",
};

function categories(role: string) {
  return role === "owner" || role === "admin"
    ? ["order", "artwork", "payment"]
    : ["order", "artwork"];
}

function safeDestination(value: string) {
  if (
    value === "/admin/artworks?status=queue&page=1" ||
    value === "/admin/payments?status=submitted&page=1"
  ) {
    return value;
  }

  if (/^\/admin\/orders\/[A-Za-z0-9-]+$/.test(value)) {
    return value;
  }

  return "/admin";
}

export async function GET() {
  try {
    const current = await getCurrentAdmin();

    if (!current) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 401, headers }
      );
    }

    const supabase = getSupabaseAdmin();
    const allowed = categories(current.profile.role);

    const [list, unread] = await Promise.all([
      supabase
        .from("admin_notifications")
        .select(
          "id, category, title, message, target_path, read_at, created_at"
        )
        .eq("admin_id", current.user.id)
        .in("category", allowed)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(20),

      supabase
        .from("admin_notifications")
        .select("id", { count: "exact", head: true })
        .eq("admin_id", current.user.id)
        .in("category", allowed)
        .is("read_at", null),
    ]);

    if (list.error || unread.error) {
      throw list.error || unread.error;
    }

    return NextResponse.json(
      {
        notifications: (list.data ?? []).map((item) => ({
          id: item.id,
          category: item.category,
          title: item.title,
          message: item.message,
          href: safeDestination(item.target_path),
          read_at: item.read_at,
          created_at: item.created_at,
        })),
        unreadCount: unread.count ?? 0,
      },
      { headers }
    );
  } catch (error) {
    console.error("[Admin notifications]", error);

    return NextResponse.json(
      { message: "Unable to load notifications." },
      { status: 500, headers }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");

    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { message: "Invalid request origin." },
        { status: 403, headers }
      );
    }

    const current = await getCurrentAdmin();

    if (!current) {
      return NextResponse.json(
        { message: "Admin access required." },
        { status: 401, headers }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400, headers }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400, headers }
      );
    }

    const markAll = "all" in body && body.all === true;
    const id = "id" in body ? body.id : null;

    if (
      !markAll &&
      (typeof id !== "string" || !UUID.test(id))
    ) {
      return NextResponse.json(
        { message: "Invalid notification." },
        { status: 400, headers }
      );
    }

    const supabase = getSupabaseAdmin();

    let update = supabase
      .from("admin_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("admin_id", current.user.id)
      .in("category", categories(current.profile.role))
      .is("read_at", null);

    if (!markAll && typeof id === "string") {
      update = update.eq("id", id);
    }

    const { error } = await update;

    if (error) throw error;

    return NextResponse.json(
      { success: true },
      { headers }
    );
  } catch (error) {
    console.error("[Admin notification read]", error);

    return NextResponse.json(
      { message: "Unable to update notifications." },
      { status: 500, headers }
    );
  }
}