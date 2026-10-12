import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { safeDestination } from "@/app/lib/newjersey/auth/destination";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeDestination(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destination = `/auth/continue${
        next ? `?next=${encodeURIComponent(next)}` : ""
      }`;

      const response = NextResponse.redirect(
        new URL(destination, request.url)
      );

      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }
  }

  const response = NextResponse.redirect(
    new URL("/login?error=confirmation", request.url)
  );

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}