import "server-only";

import { redirect } from "next/navigation";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

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

export type CurrentAdmin = {
  user: {
    id: string;
    email?: string;
  };
  profile: AdminProfile;
};

export async function getCurrentAdmin() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error,
  } =
    await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const admin =
    getSupabaseAdmin();

  const {
    data: profile,
    error: profileError,
  } = await admin
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
    if (profileError) {
      console.error(
        "[NewJersey Admin Auth]",
        profileError
      );
    }

    return null;
  }

  return {
    user,
    profile:
      profile as AdminProfile,
  };
}

export async function requireAdmin() {
  const currentAdmin =
    await getCurrentAdmin();

  if (!currentAdmin) {
    redirect(
      "/login?next=/admin"
    );
  }

  return currentAdmin;
}

export async function requireStoreAdmin(): Promise<CurrentAdmin> {
  const currentAdmin = await requireAdmin();

  if (
    currentAdmin.profile.role !== "owner" &&
    currentAdmin.profile.role !== "admin"
  ) {
    redirect("/admin");
  }

  return currentAdmin;
}