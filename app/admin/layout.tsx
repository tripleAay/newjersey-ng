import type { ReactNode } from "react";

import AdminShell from "@/app/components/admin/AdminShell";
import { requireAdmin } from "@/app/lib/newjersey/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const current = await requireAdmin();

  return (
    <AdminShell
      key={current.user.id}
      adminName={current.profile.full_name}
      role={current.profile.role}
    >
      {children}
    </AdminShell>
  );
}