"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Upload } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import { useCart } from "@/app/contexts/cartContext";

import type {
  CreateOrderPayload,
  CreateOrderResult,
} from "@/app/types/commerce";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const inputClass =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] outline-none transition focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20";

const sectionClass =
  "rounded-2xl border border-black/10 bg-white p-5 sm:p-7";

const buttonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F58220] px-6 py-3.5 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-6 py-3.5 text-sm font-semibold text-[#181818] transition-colors hover:border-[#F58220] hover:bg-[#F58220]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

const statuses = new Set([
  "submitted",
  "under-review",
  "awaiting-artwork",
  "awaiting-payment",
  "confirmed",
  "in-production",
  "ready",
  "dispatched",
  "completed",
  "cancelled",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER / 100
  );
}

function isOrderResult(value: unknown): value is CreateOrderResult {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.orderNumber === "string" &&
    value.orderNumber.length > 0 &&
    typeof value.status === "string" &&
    statuses.has(value.status) &&
    isMoney(value.subtotal) &&
    isMoney(value.designFee) &&
    isMoney(value.estimatedTotal) &&
    Math.round(value.estimatedTotal * 100) ===
      Math.round((value.subtotal + value.designFee) * 100) &&
    typeof value.createdAt === "string" &&
    Number.isFinite(Date.parse(value.createdAt))
  );
}

function readText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export default function CheckoutPage() {
  const {
    items,
    itemCount,
    subtotal,
    designFee,
    estimatedTotal,
    hydrated,
    clearCart,
  } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<
    "delivery" | "pickup"
  >("delivery");

  const [submitting, setSubmitting] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");

  const [createdOrder, setCreatedOrder] =
    useState<CreateOrderResult | null>(null);

  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current || createdOrder) return;

    setError("");
    setAuthRequired(false);

    if (!hydrated || items.length === 0) {
      setError("Add products before submitting your order.");
      return;
    }

    const form = new FormData(event.currentTarget);

    const customer = {
      fullName: readText(form, "fullName"),
      phone: readText(form, "phone"),
      email: readText(form, "email").toLowerCase(),
      organization: readText(form, "organization") || undefined,
    };

    const projectName = readText(form, "projectName");

    if (
      !customer.fullName ||
      !customer.phone ||
      !customer.email ||
      !projectName
    ) {
      setError("Complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      setError("Enter a valid email address.");
      return;
    }

    const state = readText(form, "state");
    const city = readText(form, "city");
    const address = readText(form, "address");

    if (
      deliveryMethod === "delivery" &&
      (!state || !city || !address)
    ) {
      setError("Complete your delivery address.");
      return;
    }

    const payload: CreateOrderPayload = {
      customer,
      delivery:
        deliveryMethod === "delivery"
          ? {
              method: "delivery",
              state,
              city,
              address,
              landmark: readText(form, "landmark") || undefined,
            }
          : {
              method: "pickup",
            },
      brief: {
        projectName,
        deadline: readText(form, "deadline") || undefined,
        instructions: readText(form, "instructions") || undefined,
      },
      items,
      // The API verifies prices and design fees.
      subtotal,
    };

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        setAuthRequired(true);
        return;
      }

      let result: unknown;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The response could not be read. Check whether your order was created before submitting again.",
        );
      }

      // Also handles the existing API's sign-in message if it
      // currently returns a status other than 401.
      if (
        !response.ok &&
        isRecord(result) &&
        typeof result.message === "string" &&
        /please sign in before submitting your order/i.test(
          result.message,
        )
      ) {
        setAuthRequired(true);
        return;
      }

      if (
        !response.ok ||
        !isRecord(result) ||
        result.success !== true
      ) {
        throw new Error(
          isRecord(result) && typeof result.message === "string"
            ? result.message
            : "Unable to confirm your order. Check whether it was created before trying again.",
        );
      }

      if (!isOrderResult(result.order)) {
        throw new Error(
          "The order confirmation was incomplete. Check whether your order was created before submitting again.",
        );
      }

      setCreatedOrder(result.order);
      clearCart();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to confirm your order. Check whether it was created before trying again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F1E9] text-[#181818]">
      <header className="sticky top-0 z-[100] w-full">
        <div className="relative z-[110]">
          <TopNav />
        </div>

        <div className="relative z-[100] bg-[#F4F1E9]/95 shadow-[0_2px_12px_rgba(0,0,0,0.08)] backdrop-blur-md">
          <DashboardHeader />
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        {createdOrder ? (
          <section className={`${sectionClass} mx-auto max-w-2xl`}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
              Request received
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
              Your order is in.
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#625D55]">
              Keep your order reference. We’ll review your selections
              and any required artwork before confirming production
              and any delivery charges.
            </p>

            <dl className="mt-6 space-y-4 rounded-xl bg-[#F4F1E9] p-5">
              <div>
                <dt className="text-xs text-[#625D55]">
                  Order reference
                </dt>
                <dd className="mt-1 break-all text-lg font-semibold">
                  {createdOrder.orderNumber}
                </dd>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-[#625D55]">Production</dt>
                <dd>{currency.format(createdOrder.subtotal)}</dd>
              </div>

              <div className="flex justify-between gap-4 text-sm">
                <dt className="text-[#625D55]">Design assistance</dt>
                <dd>{currency.format(createdOrder.designFee)}</dd>
              </div>

              <div className="flex flex-wrap justify-between gap-4 border-t border-black/10 pt-4">
                <dt className="font-semibold">
                  Total before delivery
                </dt>
                <dd className="text-xl font-bold">
                  {currency.format(createdOrder.estimatedTotal)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-[#625D55]">Status</dt>
                <dd className="mt-1 font-medium capitalize">
                  {createdOrder.status.replaceAll("-", " ")}
                </dd>
              </div>
            </dl>

            {createdOrder.status === "awaiting-artwork" && (
              <div className="mt-6 rounded-xl border border-[#F58220]/25 bg-[#F58220]/5 p-5">
                <h2 className="text-sm font-semibold">
                  Next: send your artwork
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#625D55]">
                  Upload the production-ready files for your
                  customer-supplied items. We’ll review them before
                  production begins.
                </p>

                <Link
                  href={`/shop/artwork/${createdOrder.id}`}
                  className={`${buttonClass} mt-4 w-full sm:w-auto`}
                >
                  <Upload size={17} aria-hidden="true" />
                  Upload your artwork
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </div>
            )}

            <Link
              href="/shop"
              className={`${secondaryButtonClass} mt-6 w-full sm:w-auto`}
            >
              Back to shop
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </section>
        ) : !hydrated ? (
          <p role="status" className="py-12 text-sm text-[#625D55]">
            Loading your order…
          </p>
        ) : items.length === 0 ? (
          <section className={`${sectionClass} text-center`}>
            <h1 className="text-2xl font-bold">
              Your order is empty.
            </h1>

            <p className="mt-3 text-sm text-[#625D55]">
              Add products before continuing to checkout.
            </p>

            <Link href="/shop" className={`${buttonClass} mt-6`}>
              Explore the shop
            </Link>
          </section>
        ) : (
          <>
            <Link
              href="/shop/cart"
              className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Back to your order
            </Link>

            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
                NewJersey.ng
                <span className="px-2 text-[#F58220]">/</span>
                Checkout
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Let&apos;s get the details right.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">
                Add your contact details, delivery preference, and
                production brief.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              aria-busy={submitting}
              className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"
            >
              <fieldset
                disabled={submitting}
                className="min-w-0 space-y-6"
              >
                <legend className="sr-only">
                  Customer and production details
                </legend>

                <section className={sectionClass}>
                  <h2 className="text-xl font-semibold">
                    Contact details
                  </h2>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-medium">
                      Full name *
                      <input
                        name="fullName"
                        autoComplete="name"
                        required
                        maxLength={150}
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Phone number *
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        maxLength={40}
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Email address *
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Organization
                      <input
                        name="organization"
                        autoComplete="organization"
                        maxLength={200}
                        className={inputClass}
                      />
                    </label>
                  </div>
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-semibold">
                    Delivery or pickup
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {(["delivery", "pickup"] as const).map(
                      (method) => (
                        <label
                          key={method}
                          className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
                            deliveryMethod === method
                              ? "border-[#F58220] bg-[#F58220]/10"
                              : "border-black/15"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryMethod"
                            value={method}
                            checked={deliveryMethod === method}
                            onChange={() =>
                              setDeliveryMethod(method)
                            }
                            className="h-4 w-4 accent-[#F58220]"
                          />

                          {method === "delivery"
                            ? "Deliver to me"
                            : "I'll arrange pickup"}
                        </label>
                      ),
                    )}
                  </div>

                  {deliveryMethod === "delivery" ? (
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <label className="block text-sm font-medium">
                        State *
                        <input
                          name="state"
                          autoComplete="address-level1"
                          required
                          maxLength={100}
                          className={inputClass}
                        />
                      </label>

                      <label className="block text-sm font-medium">
                        City / town *
                        <input
                          name="city"
                          autoComplete="address-level2"
                          required
                          maxLength={100}
                          className={inputClass}
                        />
                      </label>

                      <label className="block text-sm font-medium sm:col-span-2">
                        Delivery address *
                        <textarea
                          name="address"
                          autoComplete="street-address"
                          required
                          rows={3}
                          maxLength={500}
                          className={inputClass}
                        />
                      </label>

                      <label className="block text-sm font-medium sm:col-span-2">
                        Landmark
                        <input
                          name="landmark"
                          maxLength={200}
                          className={inputClass}
                        />
                      </label>

                      <p className="text-xs leading-6 text-[#625D55] sm:col-span-2">
                        Delivery availability and charges will be
                        confirmed for your location and order.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-5 text-sm leading-7 text-[#625D55]">
                      Pickup location and timing will be confirmed
                      when your order is ready.
                    </p>
                  )}
                </section>

                <section className={sectionClass}>
                  <h2 className="text-xl font-semibold">
                    Production brief
                  </h2>

                  <div className="mt-6 space-y-5">
                    <label className="block text-sm font-medium">
                      Project name *
                      <input
                        name="projectName"
                        required
                        maxLength={200}
                        placeholder="For example: Business launch"
                        className={inputClass}
                      />
                    </label>

                    <label className="block text-sm font-medium">
                      Preferred deadline
                      <input
                        name="deadline"
                        type="date"
                        className={inputClass}
                      />

                      <span className="mt-2 block text-xs font-normal leading-6 text-[#625D55]">
                        Your preferred date is subject to production
                        confirmation.
                      </span>
                    </label>

                    <label className="block text-sm font-medium">
                      Instructions
                      <textarea
                        name="instructions"
                        rows={5}
                        maxLength={5000}
                        placeholder="Add delivery notes or your design brief."
                        className={inputClass}
                      />
                    </label>
                  </div>
                </section>
              </fieldset>

              <aside className="min-w-0 rounded-[24px] border border-black/10 bg-white p-6 lg:sticky lg:top-44">
                <h2 className="text-xl font-bold">Your order</h2>

                <ul className="mt-5 space-y-5">
                  {items.map((item) => {
                    const fee =
                      item.artwork?.type === "design-needed"
                        ? (item.artwork.designFee ?? 0)
                        : 0;

                    return (
                      <li
                        key={item.cartItemId}
                        className="border-b border-black/10 pb-5"
                      >
                        <p className="text-sm font-semibold">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-[#625D55]">
                          {item.quantity}{" "}
                          {item.quantity === 1 ? "job" : "jobs"}
                        </p>

                        {item.selections.map((selection) => (
                          <p
                            key={selection.optionId}
                            className="mt-1 text-xs leading-6 text-[#625D55]"
                          >
                            {selection.optionLabel}:{" "}
                            {selection.choiceLabel}
                          </p>
                        ))}

                        <div className="mt-3 flex justify-between gap-4 text-xs">
                          <span className="text-[#625D55]">
                            Production
                          </span>
                          <span>
                            {currency.format(item.totalPrice)}
                          </span>
                        </div>

                        {item.artwork?.type === "design-needed" ? (
                          <div className="mt-2 flex justify-between gap-4 text-xs">
                            <span className="text-[#625D55]">
                              Design · once
                            </span>
                            <span>{currency.format(fee)}</span>
                          </div>
                        ) : (
                          <p className="mt-2 text-xs text-[#625D55]">
                            {item.artwork?.type === "not-required"
                              ? "Ready-designed apparel - no artwork required"
                              : "Customer-supplied artwork - no design fee"}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-[#625D55]">
                      Configured jobs
                    </dt>
                    <dd>{itemCount}</dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-[#625D55]">Production</dt>
                    <dd>{currency.format(subtotal)}</dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-[#625D55]">
                      Design assistance
                    </dt>
                    <dd>{currency.format(designFee)}</dd>
                  </div>

                  <div className="flex justify-between gap-4">
                    <dt className="text-[#625D55]">Delivery</dt>
                    <dd className="text-right text-xs">
                      {deliveryMethod === "pickup"
                        ? "Pickup selected"
                        : "Confirmed separately"}
                    </dd>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                    <dt className="font-semibold">
                      Estimated total
                    </dt>
                    <dd className="text-2xl font-bold">
                      {currency.format(estimatedTotal)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-xs leading-6 text-[#625D55]">
                  Includes selected design assistance. Delivery
                  charges are excluded. Production is subject to
                  product availability and any required artwork
                  approval.
                </p>

                {authRequired && (
                  <div
                    role="alert"
                    className="mt-5 rounded-xl border border-[#F58220]/25 bg-[#FFF7ED] p-4"
                  >
                    <p className="text-sm font-semibold">
                      Sign in to complete your order.
                    </p>

                    <p className="mt-1 text-xs leading-6 text-[#625D55]">
                      Already have an account? Sign in, or create
                      one to continue.
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href="/login?next=%2Fshop%2Fcheckout"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#181818] px-3 text-xs font-semibold text-white transition-colors hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                      >
                        Sign in
                      </Link>

                      <Link
                        href="/register?next=%2Fshop%2Fcheckout"
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-black/15 bg-white px-3 text-xs font-semibold transition-colors hover:border-[#F58220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
                      >
                        Create account
                      </Link>
                    </div>
                  </div>
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-5 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`${buttonClass} mt-6 w-full`}
                >
                  {submitting
                    ? "Submitting request…"
                    : authRequired
                      ? "Retry submission after signing in"
                      : "Submit production request"}

                  {!submitting && (
                    <ArrowRight size={17} aria-hidden="true" />
                  )}
                </button>

                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-center text-xs leading-6 text-[#625D55]"
                >
                  {submitting
                    ? "Please wait while your request is saved."
                    : "This submits your order request. No payment is taken."}
                </p>
              </aside>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}