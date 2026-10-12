import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/app/components/dashboard components/mainheader";
import Footer from "@/app/components/Footer";
import { createClient } from "@/app/lib/newjersey/supabase/server";

import { updateProfile } from "../actions";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
  }>;
};

const errorMessages: Record<string, string> = {
  name: "Enter a name between 2 and 120 characters.",
  phone: "Enter a valid contact number, including your country code.",
  save: "Your details could not be saved. Please try again.",
};

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818]";

export default async function EditProfilePage({
  searchParams,
}: Props) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login?next=%2Fshop%2Faccount%2Fedit");
  }

  const params = await searchParams;

  const fullName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "";

  const contactPhone =
    typeof user.user_metadata?.contact_phone === "string"
      ? user.user_metadata.contact_phone
      : "";

  const errorMessage =
    typeof params.error === "string"
      ? errorMessages[params.error]
      : undefined;

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-16">
        <Link
          href="/shop/account"
          className="inline-flex min-h-11 items-center text-sm text-[#625D55] hover:underline"
        >
          Back to your account
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Your details.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#625D55]">
          Keep your name and contact information up to date.
        </p>

        {params.saved === "1" && (
          <p
            role="status"
            className="mt-6 rounded-xl border border-black/10 bg-[#F4F1E9] p-4 text-sm"
          >
            Your details have been saved.
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800"
          >
            {errorMessage}
          </p>
        )}

        <form action={updateProfile} className="mt-8 space-y-6">
          <label className="block text-sm font-medium">
            Full name
            <input
              name="full_name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={120}
              defaultValue={fullName}
              className={inputClass}
            />
          </label>

          <label className="block text-sm font-medium">
            Contact number
            <input
              name="contact_phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              defaultValue={contactPhone}
              placeholder="+234..."
              className={inputClass}
            />
            <span className="mt-2 block text-xs leading-5 text-[#625D55]">
              Optional. Include your country code.
            </span>
          </label>

          <div>
            <p className="text-sm font-medium">Email address</p>
            <p className="mt-2 break-words text-base">
              {user.email}
            </p>
            <p className="mt-2 text-xs leading-5 text-[#625D55]">
              Email changes require a separate confirmation process.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 border-t border-black/10 pt-6">
            <button
              type="submit"
              className="min-h-12 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636]"
            >
              Save changes
            </button>

            <Link
              href="/shop/account"
              className="inline-flex min-h-11 items-center text-sm hover:underline"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}