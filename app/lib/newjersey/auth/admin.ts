import {
  redirect,
} from "next/navigation";

import {
  createClient,
} from "@/app/lib/newjersey/supabase/server";

import {
  getSupabaseAdmin,
} from "@/app/lib/newjersey/supabase/admin";

export type AdminRole =
  | "owner"
  | "admin"
  | "production";

export type AdminProfile = {
  id: string;
  full_name: string;
  role: AdminRole;
  active: boolean;
};

export async function getCurrentAdmin() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
    error,
  } =
    await supabase.auth.getUser();

  if (
    error ||
    !user
  ) {
    return null;
  }

  /*
   * Authorization is checked using
   * the trusted server client.
   *
   * We do not trust client metadata
   * such as user_metadata.role.
   */

  const admin =
    getSupabaseAdmin();

  const {
    data: profile,
    error: profileError,
  } =
    await admin
      .from("admin_users")
      .select(
        `
          id,
          full_name,
          role,
          active
        `
      )
      .eq(
        "id",
        user.id
      )
      .eq(
        "active",
        true
      )
      .maybeSingle();

  if (
    profileError ||
    !profile
  ) {
    return null;
  }

  return {
    user,
    profile:
      profile as AdminProfile,
  };
}

export async function requireAdmin() {
  const admin =
    await getCurrentAdmin();

  if (!admin) {
    redirect(
      "/login?next=/shop/admin"
    );
  }

  return admin;
}