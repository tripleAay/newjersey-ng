import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import SupportInbox from "./SupportInbox";
export const dynamic = "force-dynamic";
export default async function Page() {
  await requireStoreAdmin();
  return (
    <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[.17em] text-[#8A8379]">
        Customer care
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Support inbox.
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[#746E65]">
        Saved customer conversations. Reply clearly, confirm the order reference
        and resolve when the issue is handled.
      </p>
      <SupportInbox />
    </main>
  );
}
