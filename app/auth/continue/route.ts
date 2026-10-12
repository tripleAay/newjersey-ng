import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getCurrentAdmin } from "@/app/lib/newjersey/auth/admin";
import { safeDestination } from "@/app/lib/newjersey/auth/destination";

export async function GET(request: NextRequest) {
  const next = safeDestination(request.nextUrl.searchParams.get("next"));

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let destination: string;

  if (!user) {
    destination = `/login${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;
  } else {
    const admin = await getCurrentAdmin();
    const nextPath = next?.split(/[?#]/, 1)[0];
    const adminDestination =
      nextPath === "/admin" || nextPath?.startsWith("/admin/");

    if (admin) {
      destination = next ?? "/admin";
    } else {
      destination = adminDestination ? "/shop" : (next ?? "/shop");
    }
  }

  const response = NextResponse.redirect(
    new URL(destination, request.url)
  );

  response.headers.set("Cache-Control", "private, no-store");

  return response;
}