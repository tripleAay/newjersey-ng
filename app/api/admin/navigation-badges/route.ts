import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
};

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

    const categories =
      current.profile.role === "production"
        ? ["order", "artwork"]
        : ["order", "artwork", "payment"];

    const results = await Promise.all(
      categories.map(async (category) => {
        const { count, error } = await supabase
          .from("admin_notifications")
          .select("id", { count: "exact", head: true })
          .eq("admin_id", current.user.id)
          .eq("category", category)
          .is("read_at", null);

        if (error) throw error;

        return {
          category,
          count: count ?? 0,
        };
      })
    );

    const destinations: Record<string, string> = {
      order: "/admin/orders",
      artwork: "/admin/artworks",
      payment: "/admin/payments",
    };

    const badges: Record<string, number> = {};

    for (const result of results) {
      badges[destinations[result.category]] = result.count;
    }

    return NextResponse.json({ badges }, { headers });
  } catch (error) {
    console.error("[Admin navigation badges]", error);

    return NextResponse.json(
      { message: "Unable to load notification counts." },
      { status: 500, headers }
    );
  }
}