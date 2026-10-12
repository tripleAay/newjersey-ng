import Link from "next/link";
import { redirect } from "next/navigation";

import Header from "@/app/components/dashboard components/mainheader";
import Footer from "@/app/components/Footer";
import { createClient } from "@/app/lib/newjersey/supabase/server";

import { saveAddress, deleteAddress } from "./actions";

type Props = {
  searchParams: Promise<{
    error?: string | string[];
    saved?: string | string[];
    removed?: string | string[];
  }>;
};

const fields = [
  {
    name: "recipient_name",
    label: "Recipient name",
    autoComplete: "shipping name",
    required: true,
    maxLength: 120,
  },
  {
    name: "phone",
    label: "Contact number",
    autoComplete: "shipping tel",
    required: true,
    maxLength: 30,
  },
  {
    name: "address_line_1",
    label: "Street address",
    autoComplete: "shipping address-line1",
    required: true,
    maxLength: 200,
  },
  {
    name: "address_line_2",
    label: "Apartment, suite or landmark",
    autoComplete: "shipping address-line2",
    required: false,
    maxLength: 200,
  },
  {
    name: "city",
    label: "City",
    autoComplete: "shipping address-level2",
    required: true,
    maxLength: 200,
  },
  {
    name: "region",
    label: "State, province or region",
    autoComplete: "shipping address-level1",
    required: true,
    maxLength: 200,
  },
  {
    name: "postal_code",
    label: "Postal code",
    autoComplete: "shipping postal-code",
    required: false,
    maxLength: 20,
  },
  {
    name: "country_code",
    label: "Country code",
    autoComplete: "shipping country",
    required: true,
    maxLength: 2,
  },
];

const messages: Record<string, string> = {
  details: "Complete the required fields and use a two-letter country code.",
  phone: "Enter a valid contact number with your country code.",
  save: "Your address could not be saved. Please try again.",
  delete: "Your address could not be removed. Please try again.",
};

export default async function AddressPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=%2Fshop%2Faccount%2Faddress");
  }

  const { data: address, error } = await supabase
    .from("customer_delivery_addresses")
    .select(
      "recipient_name, phone, address_line_1, address_line_2, city, region, postal_code, country_code"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[NewJersey Load Address]", error);
    throw new Error("Unable to load your delivery address.");
  }

  const params = await searchParams;
  const errorMessage =
    typeof params.error === "string" ? messages[params.error] : "";

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#181818]">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-16">
        <Link
          href="/shop/account"
          className="inline-flex min-h-11 items-center text-sm text-[#625D55] hover:underline"
        >
          Back to your account
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Your delivery address.
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#625D55]">
          Save the address you normally use. Delivery availability and
          charges will be confirmed for each order.
        </p>

        {(params.saved === "1" || params.removed === "1") && (
          <p
            role="status"
            className="mt-6 rounded-xl bg-[#F4F1E9] p-4 text-sm"
          >
            {params.saved === "1"
              ? "Your address has been saved."
              : "Your saved address has been removed."}
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

        <form action={saveAddress} className="mt-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.name}
                className={`block text-sm font-medium ${
                  field.name.startsWith("address_line")
                    ? "sm:col-span-2"
                    : ""
                }`}
              >
                {field.label}
                {!field.required && (
                  <span className="ml-1 font-normal text-[#625D55]">
                    (optional)
                  </span>
                )}

                <input
                  name={field.name}
                  type={field.name === "phone" ? "tel" : "text"}
                  required={field.required}
                  maxLength={field.maxLength}
                  autoComplete={field.autoComplete}
                  defaultValue={
                    address?.[field.name as keyof typeof address] ?? ""
                  }
                  placeholder={
                    field.name === "country_code"
                      ? "NG, US, GB..."
                      : field.name === "phone"
                        ? "+234..."
                        : undefined
                  }
                  pattern={
                    field.name === "country_code"
                      ? "[A-Za-z]{2}"
                      : undefined
                  }
                  className="mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="mt-7 min-h-12 rounded-full bg-[#181818] px-6 text-sm font-semibold text-white hover:bg-[#363636]"
          >
            Save address
          </button>
        </form>

        {address && (
          <form
            action={deleteAddress}
            className="mt-8 border-t border-black/10 pt-5"
          >
            <button
              type="submit"
              className="min-h-11 text-sm text-[#625D55] hover:underline"
            >
              Remove saved address
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}