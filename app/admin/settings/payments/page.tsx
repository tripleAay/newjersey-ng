import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

import { savePaymentSettings } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
  }>;
};

const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] outline-none focus:border-[#181818] focus:ring-2 focus:ring-black/5";

export default async function PaymentSettingsPage({
  searchParams,
}: Props) {
  await requireStoreAdmin();

  const params = await searchParams;

  const error =
    typeof params.error === "string" ? params.error : "";

  const supabase = getSupabaseAdmin();

  const { data: settings, error: settingsError } =
    await supabase
      .from("store_payment_settings")
      .select(`
        enabled,
        bank_name,
        account_name,
        account_number,
        instructions,
        updated_at
      `)
      .eq("id", "bank-transfer")
      .maybeSingle();

  if (settingsError || !settings) {
    console.error(
      "[Payment settings lookup]",
      settingsError
    );

    throw new Error(
      "Unable to load payment settings. Check that the payment settings migration has been applied."
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <Link
        href="/admin/settings"
        className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#625D55] hover:text-[#181818]"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Settings
      </Link>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
        Payments.
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
        Manage the bank account customers pay into and
        the instructions shown with new payment requests.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-red-50 p-4 text-sm leading-7 text-red-800"
        >
          {error}
        </p>
      )}

      {params.saved === "1" && (
        <p
          role="status"
          className="mt-6 rounded-xl bg-[#EDF3ED] p-4 text-sm text-[#426247]"
        >
          Payment settings saved.
        </p>
      )}

      <form
        action={savePaymentSettings}
        className="mt-8 rounded-[24px] border border-black/10 bg-white p-5 sm:p-7"
      >
        <input
          type="hidden"
          name="expectedUpdatedAt"
          value={settings.updated_at}
        />

        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <h2 className="text-lg font-semibold">
              Bank transfer
            </h2>

            <p className="mt-2 text-xs leading-6 text-[#625D55]">
              Payments are verified manually before
              an order is confirmed.
            </p>
          </div>

          <label className="inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={settings.enabled}
              className="h-5 w-5 accent-[#181818]"
            />
            Enabled
          </label>
        </div>

        <div className="mt-6 space-y-6">
          <label className="block text-sm font-medium">
            Bank name
            <input
              name="bankName"
              required
              maxLength={100}
              defaultValue={settings.bank_name}
              className={field}
              autoComplete="off"
            />
          </label>

          <label className="block text-sm font-medium">
            Account name
            <input
              name="accountName"
              required
              maxLength={160}
              defaultValue={settings.account_name}
              className={field}
              autoComplete="off"
            />
          </label>

          <label className="block text-sm font-medium">
            Account number
            <input
              name="accountNumber"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{10}"
              minLength={10}
              maxLength={10}
              required
              defaultValue={settings.account_number}
              className={field}
              autoComplete="off"
              spellCheck={false}
            />

            <span className="mt-2 block text-xs leading-6 text-[#625D55]">
              Check that the account number matches
              the bank and account name before saving.
            </span>
          </label>

          <label className="block text-sm font-medium">
            Customer instructions
            <textarea
              name="instructions"
              rows={4}
              maxLength={2000}
              defaultValue={settings.instructions}
              className={field}
            />
          </label>
        </div>

        <div className="mt-7 border-t border-black/10 pt-6">
          <p className="text-xs leading-6 text-[#625D55]">
            Changes apply to new payment requests.
            Existing requests retain their saved account
            details. Disabling bank transfer stops new
            requests; it does not cancel existing ones.
          </p>

          <button
            type="submit"
            className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
          >
            Save payment settings
          </button>
        </div>
      </form>
    </main>
  );
}