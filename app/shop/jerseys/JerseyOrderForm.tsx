"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";

import { submitJersey } from "./actions";

import ProductGallery from "@/app/components/newjersey/product/ProductGallery";
import type { JerseyProduct } from "@/app/lib/newjersey/jerseys/catalogue";

type Props = {
  products: JerseyProduct[];
};

const field =
  "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-[#181818] outline-none transition-shadow placeholder:text-[#9A9389] focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/15 disabled:cursor-not-allowed disabled:bg-[#F7F7F4] disabled:text-[#8A8379]";

const section =
  "rounded-2xl border border-black/10 bg-white p-5 sm:p-7";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function money(minor: number) {
  return currency.format(minor / 100);
}

function kitLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function feeLabel(value: number | null | undefined) {
  if (value == null) return "Unavailable";
  return value === 0 ? "Included" : `+${money(value)} each`;
}

export default function JerseyOrderForm({ products }: Props) {
  const router = useRouter();

  const busyRef = useRef(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const initialProduct =
    products.length === 1 ? products[0] : undefined;

  const [team, setTeam] = useState(
    initialProduct?.team ?? ""
  );
  const [season, setSeason] = useState(
    initialProduct?.season ?? ""
  );
  const [productId, setProductId] = useState(
    initialProduct?.id ?? ""
  );

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [wantName, setWantName] = useState(false);
  const [wantNumber, setWantNumber] = useState(false);
  const [printedName, setPrintedName] = useState("");
  const [printedNumber, setPrintedNumber] = useState("");

  const [delivery, setDelivery] = useState("pickup");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const locked = submitting || submitted;

  const teams = Array.from(
    new Set(products.map((product) => product.team))
  );

  const seasons = Array.from(
    new Set(
      products
        .filter((product) => product.team === team)
        .map((product) => product.season)
    )
  );

  const kits = products.filter(
    (product) =>
      product.team === team && product.season === season
  );

  const product = kits.find(
    (candidate) => candidate.id === productId
  );

  const nameAvailable =
    product != null && product.nameFeeMinor !== null;

  const numberAvailable =
    product != null && product.numberFeeMinor !== null;

  const nameCharge =
    wantName && nameAvailable
      ? product.nameFeeMinor ?? 0
      : 0;

  const numberCharge =
    wantNumber && numberAvailable
      ? product.numberFeeMinor ?? 0
      : 0;

  const unitMinor = product
    ? product.priceMinor + nameCharge + numberCharge
    : 0;

  const quantityNumber = Number(quantity);

  const quantityValid =
    Number.isInteger(quantityNumber) &&
    quantityNumber >= 1 &&
    quantityNumber <= 100;

  function resetConfirmation() {
    setConfirmed(false);
    setError("");
  }

  function resetPersonalisation() {
    setSize("");
    setWantName(false);
    setWantNumber(false);
    setPrintedName("");
    setPrintedNumber("");
    resetConfirmation();
  }

  function showError(message: string) {
    setError(message);

    requestAnimationFrame(() => {
      errorRef.current?.focus();
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (busyRef.current || submitted) return;

    if (
      !product ||
      !product.sizes.includes(size) ||
      !quantityValid ||
      !confirmed
    ) {
      showError(
        "Complete your jersey details and confirm your selections."
      );
      return;
    }

    if (
      wantName &&
      (!nameAvailable ||
        !printedName.trim() ||
        /[\u0000-\u001f\u007f]/.test(printedName))
    ) {
      showError("Enter a valid name to print.");
      return;
    }

    if (
      wantNumber &&
      (!numberAvailable ||
        !/^[0-9]{1,3}$/.test(printedNumber))
    ) {
      showError("Enter a printed number containing 1 to 3 digits.");
      return;
    }

    // Capture fields before disabling the form.
    const form = new FormData(event.currentTarget);

    busyRef.current = true;
    setSubmitting(true);
    setError("");

    try {
      const result = await submitJersey(form);

      if (result.error) {
        showError(result.error);
        return;
      }

      if (result.orderId) {
        setSubmitted(true);
        router.push(
          `/shop/order/${encodeURIComponent(result.orderId)}`
        );
        return;
      }

      showError(
        "Check your orders before submitting again."
      );
    } catch {
      showError(
        "The order confirmation could not be received. Check your orders before submitting again."
      );
    } finally {
      busyRef.current = false;
      setSubmitting(false);
    }
  }

  if (!products.length) {
    return (
      <p className="rounded-xl border border-black/10 bg-white p-6 text-sm leading-7 text-[#625D55]">
        Jerseys are currently being added. Please check back soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={locked}
      className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
    >
      <fieldset
        disabled={locked}
        className="min-w-0 space-y-6"
      >
        <legend className="sr-only">
          Jersey selection, personalisation and contact details
        </legend>

        {product && (
          <section className={section}>
            <div className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
                {product.team} · {product.season} ·{" "}
                {kitLabel(product.kit)}
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-tight">
                {product.name}
              </h3>
            </div>

            <ProductGallery
              key={product.id}
              name={product.name}
              images={product.images}
            />

            {product.description && (
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#625D55]">
                {product.description}
              </p>
            )}
          </section>
        )}

        <section className={section}>
          <h3 className="text-lg font-semibold tracking-tight">
            Jersey details
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Team *
              <select
                required
                value={team}
                className={field}
                onChange={(event) => {
                  setTeam(event.target.value);
                  setSeason("");
                  setProductId("");
                  resetPersonalisation();
                }}
              >
                <option value="">Choose a team</option>

                {teams.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Season *
              <select
                required
                disabled={!team}
                value={season}
                className={field}
                onChange={(event) => {
                  setSeason(event.target.value);
                  setProductId("");
                  resetPersonalisation();
                }}
              >
                <option value="">Choose a season</option>

                {seasons.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Kit *
              <select
                name="product_id"
                required
                disabled={!season}
                value={productId}
                className={field}
                onChange={(event) => {
                  setProductId(event.target.value);
                  resetPersonalisation();
                }}
              >
                <option value="">Choose a kit</option>

                {kits.map((kit) => (
                  <option key={kit.id} value={kit.id}>
                    {kitLabel(kit.kit)} - {kit.name}
                    {" - "}
                    {money(kit.priceMinor)}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Size *
              <select
                name="size"
                required
                disabled={!product}
                value={size}
                className={field}
                onChange={(event) => {
                  setSize(event.target.value);
                  resetConfirmation();
                }}
              >
                <option value="">Choose a size</option>

                {product?.sizes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium">
              Quantity *
              <input
                name="quantity"
                type="number"
                min={1}
                max={100}
                step={1}
                required
                value={quantity}
                className={field}
                onChange={(event) => {
                  setQuantity(event.target.value);
                  resetConfirmation();
                }}
              />
            </label>
          </div>

          <p className="mt-4 text-xs leading-6 text-[#625D55]">
            All jerseys in this order have the same size,
            printed name and number. Place separate orders
            for different sizes or personalisations.
          </p>
        </section>

        <section className={section}>
          <h3 className="text-lg font-semibold tracking-tight">
            Make it yours
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#625D55]">
            Name and number printing are optional.
          </p>

          <div className="mt-5 rounded-xl border border-black/10 p-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={wantName}
                disabled={!nameAvailable}
                onChange={(event) => {
                  setWantName(event.target.checked);
                  resetConfirmation();
                }}
                className="h-5 w-5 shrink-0 accent-[#181818]"
              />

              <span className="flex-1 font-medium">
                Add a printed name
              </span>

              <span className="text-right text-xs text-[#625D55]">
                {feeLabel(product?.nameFeeMinor)}
              </span>
            </label>

            {wantName && (
              <label className="mt-3 block text-sm font-medium">
                Name to print *
                <input
                  name="printed_name"
                  required
                  maxLength={30}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Enter the exact name"
                  value={printedName}
                  className={field}
                  onChange={(event) => {
                    setPrintedName(event.target.value);
                    resetConfirmation();
                  }}
                />
              </label>
            )}

            {!wantName && (
              <input
                type="hidden"
                name="printed_name"
                value=""
              />
            )}
          </div>

          <div className="mt-4 rounded-xl border border-black/10 p-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={wantNumber}
                disabled={!numberAvailable}
                onChange={(event) => {
                  setWantNumber(event.target.checked);
                  resetConfirmation();
                }}
                className="h-5 w-5 shrink-0 accent-[#181818]"
              />

              <span className="flex-1 font-medium">
                Add a printed number
              </span>

              <span className="text-right text-xs text-[#625D55]">
                {feeLabel(product?.numberFeeMinor)}
              </span>
            </label>

            {wantNumber && (
              <label className="mt-3 block text-sm font-medium">
                Number to print *
                <input
                  name="printed_number"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{1,3}"
                  maxLength={3}
                  required
                  autoComplete="off"
                  placeholder="For example, 07"
                  value={printedNumber}
                  className={field}
                  onChange={(event) => {
                    setPrintedNumber(event.target.value);
                    resetConfirmation();
                  }}
                />
              </label>
            )}

            {!wantNumber && (
              <input
                type="hidden"
                name="printed_number"
                value=""
              />
            )}
          </div>

          <p className="mt-5 rounded-xl bg-[#F4F1E9] p-4 text-xs leading-6 text-[#494540]">
            <strong>Capitalisation matters.</strong> SHINE,
            Shine and shine print differently. Enter the name
            exactly as you want it printed. Leading zeros in
            numbers such as 07 are preserved. Spaces at the
            beginning and end of a name are removed.
          </p>

          <label className="mt-5 block text-sm font-medium">
            Additional instructions
            <textarea
              name="instructions"
              rows={4}
              maxLength={2000}
              className={field}
              placeholder="Printing colour, placement or other details"
              onChange={resetConfirmation}
            />
          </label>
        </section>

        <section className={section}>
          <h3 className="text-lg font-semibold tracking-tight">
            Your details
          </h3>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Full name *
              <input
                name="full_name"
                autoComplete="name"
                required
                maxLength={150}
                className={field}
                onChange={resetConfirmation}
              />
            </label>

            <label className="text-sm font-medium">
              Phone number *
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                maxLength={40}
                className={field}
                onChange={resetConfirmation}
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Email *
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                className={field}
                onChange={resetConfirmation}
              />
            </label>

            <label className="text-sm font-medium sm:col-span-2">
              Delivery or pickup *
              <select
                name="delivery_method"
                value={delivery}
                className={field}
                onChange={(event) => {
                  setDelivery(event.target.value);
                  resetConfirmation();
                }}
              >
                <option value="pickup">
                  I will arrange pickup
                </option>
                <option value="delivery">
                  Deliver to me
                </option>
              </select>
            </label>

            {delivery === "delivery" ? (
              <>
                <label className="text-sm font-medium">
                  State *
                  <input
                    name="state"
                    required
                    maxLength={100}
                    autoComplete="address-level1"
                    className={field}
                    onChange={resetConfirmation}
                  />
                </label>

                <label className="text-sm font-medium">
                  City *
                  <input
                    name="city"
                    required
                    maxLength={100}
                    autoComplete="address-level2"
                    className={field}
                    onChange={resetConfirmation}
                  />
                </label>

                <label className="text-sm font-medium sm:col-span-2">
                  Address *
                  <textarea
                    name="address"
                    required
                    maxLength={500}
                    rows={3}
                    autoComplete="street-address"
                    className={field}
                    onChange={resetConfirmation}
                  />
                </label>
              </>
            ) : (
              <>
                <input
                  type="hidden"
                  name="state"
                  value=""
                />
                <input
                  type="hidden"
                  name="city"
                  value=""
                />
                <input
                  type="hidden"
                  name="address"
                  value=""
                />
              </>
            )}
          </div>
        </section>
      </fieldset>

      <aside className="min-w-0 rounded-2xl border border-black/10 bg-white p-5 sm:p-7 xl:sticky xl:top-48">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8379]">
          Review your selection
        </p>

        <h3 className="mt-2 text-xl font-semibold tracking-tight">
          Your jersey order
        </h3>

        <dl className="mt-6 space-y-3 text-sm">
          {[
            ["Team", team || "Choose a team"],
            ["Season", season || "-"],
            ["Kit", product ? kitLabel(product.kit) : "-"],
            ["Size", size || "Choose a size"],
            ["Quantity", quantityValid ? quantity : "-"],
            [
              "Printed name",
              wantName
                ? printedName.trim() || "Enter a name"
                : "None",
            ],
            [
              "Printed number",
              wantNumber
                ? printedNumber || "Enter a number"
                : "None",
            ],
            [
              "Fulfillment",
              delivery === "pickup" ? "Pickup" : "Delivery",
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4"
            >
              <dt className="shrink-0 text-[#746E65]">
                {label}
              </dt>
              <dd className="min-w-0 break-words text-right font-medium">
                {value}
              </dd>
            </div>
          ))}

          <div className="space-y-3 border-t border-black/10 pt-4">
            {[
              [
                "Jersey each",
                product ? money(product.priceMinor) : "-",
              ],
              ["Name each", money(nameCharge)],
              ["Number each", money(numberCharge)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4"
              >
                <dt className="text-[#746E65]">
                  {label}
                </dt>
                <dd className="text-right">{value}</dd>
              </div>
            ))}
          </div>

          <div className="flex items-baseline justify-between gap-4 border-t border-black/10 pt-4">
            <dt className="font-semibold">
              Jersey total
            </dt>
            <dd className="text-right text-2xl font-semibold tracking-tight">
              {product && quantityValid
                ? money(unitMinor * quantityNumber)
                : "-"}
            </dd>
          </div>
        </dl>

        <input
          type="hidden"
          name="expected_unit_minor"
          value={unitMinor}
        />

        <p className="mt-4 text-xs leading-6 text-[#746E65]">
          Delivery is excluded. We will confirm availability
          and your final total before payment. Submitting
          this form creates an order for review.
        </p>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-[#F7F6F2] p-4 text-xs leading-6">
          <input
            name="confirmed"
            type="checkbox"
            required
            checked={confirmed}
            disabled={locked}
            onChange={(event) => {
              setConfirmed(event.target.checked);
              setError("");
            }}
            className="mt-1 h-4 w-4 shrink-0 accent-[#181818]"
          />
          <span>
            I have checked the team, season, kit, size,
            quantity, spelling, capitalisation and number.
          </span>
        </label>

        {error && (
          <p
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            className="mt-4 rounded-xl bg-red-50 p-4 text-sm leading-6 text-red-800 focus:outline-none"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={
            locked ||
            !product ||
            !size ||
            !quantityValid ||
            !confirmed
          }
          className="mt-6 inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full bg-[#181818] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#363636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitted
            ? "Opening your order..."
            : submitting
              ? "Submitting your order..."
              : "Submit jersey order"}

          {submitted ? (
            <Check size={17} aria-hidden="true" />
          ) : (
            <ArrowUpRight size={17} aria-hidden="true" />
          )}
        </button>

        {submitted && (
          <p role="status" className="mt-4 text-xs leading-6">
            Your order has been saved.{" "}
            <Link
              href="/shop/order"
              className="underline underline-offset-4"
            >
              View your orders
            </Link>
          </p>
        )}

        <p className="mt-4 text-center text-xs leading-6 text-[#746E65]">
          An account is required to submit.{" "}
          <Link
            href="/login?next=%2Fshop%2Fjerseys"
            className="font-medium text-[#181818] underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </aside>
    </form>
  );
}