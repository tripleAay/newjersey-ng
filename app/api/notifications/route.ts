import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const headers = {
  "Cache-Control": "private, no-store",
};

export async function GET() {
  try {
    const auth = await createClient();

    const {
      data: { user },
      error,
    } = await auth.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { message: "Please sign in." },
        { status: 401, headers }
      );
    }

    const supabase = getSupabaseAdmin();

    const [list, unread] = await Promise.all([
      supabase
        .from("customer_notifications")
        .select(
          "id, order_id, target_path, title, message, read_at, created_at"
        )
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(20),

      supabase
        .from("customer_notifications")
        .select("id", { count: "exact", head: true })
        .eq("customer_id", user.id)
        .is("read_at", null),
    ]);

    if (list.error || unread.error) {
      throw list.error || unread.error;
    }

    const notifications = (list.data ?? []).map(
      (notification) => {
        const orderPath =
          `/shop/order/${notification.order_id}`;

        const artworkPath =
          `/shop/artwork/${notification.order_id}`;

        // Only permit known destinations for this order.
        // Older notifications were artwork notifications.
        const href =
          notification.target_path === orderPath
            ? orderPath
            : artworkPath;

        return {
          id: notification.id,
          order_id: notification.order_id,
          title: notification.title,
          message: notification.message,
          read_at: notification.read_at,
          created_at: notification.created_at,
          href,
          actionLabel:
            href === orderPath
              ? "View order"
              : "View artwork",
        };
      }
    );

    return NextResponse.json(
      {
        notifications,
        unreadCount: unread.count ?? 0,
      },
      { headers }
    );
  } catch (error) {
    console.error("[Customer notifications]", error);

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

    const auth = await createClient();

    const {
      data: { user },
      error,
    } = await auth.auth.getUser();

    if (error || !user) {
      return NextResponse.json(
        { message: "Please sign in." },
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
      Array.isArray(body) ||
      !("id" in body) ||
      typeof body.id !== "string" ||
      !UUID.test(body.id)
    ) {
      return NextResponse.json(
        { message: "Invalid notification." },
        { status: 400, headers }
      );
    }

    const supabase = getSupabaseAdmin();

    const { error: updateError } = await supabase
      .from("customer_notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", body.id)
      .eq("customer_id", user.id)
      .is("read_at", null);

    if (updateError) throw updateError;

    return NextResponse.json(
      { success: true },
      { headers }
    );
  } catch (error) {
    console.error("[Notification read status]", error);

    return NextResponse.json(
      { message: "Unable to update notification." },
      { status: 500, headers }
    );
  }
}