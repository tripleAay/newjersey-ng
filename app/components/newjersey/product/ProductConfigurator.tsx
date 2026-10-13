"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  FileCheck2,
  Palette,
  ShoppingBag,
} from "lucide-react";

import { useCart } from "@/app/contexts/cartContext";

import type {
  NewJerseyProduct,
  SelectedProductOption,
} from "@/app/types/commerce";

type ProductConfiguratorProps = {
  product: NewJerseyProduct;
  quoteRequestHref?: string;
};

type ArtworkType =
  | "customer-supplied"
  | "design-needed";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

const focus =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2";

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function isMoney(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER / 100
  );
}

function createCartItemId(
  productId: string,
  selections: SelectedProductOption[],
  artworkType: ArtworkType
) {
  const signature = selections
    .map(
      (selection) =>
        `${encodeURIComponent(selection.optionId)}:${encodeURIComponent(
          selection.choiceId
        )}`
    )
    .sort()
    .join("|");

  return `${encodeURIComponent(productId)}__${signature}__${artworkType}`;
}

export default function ProductConfigurator(
  props: ProductConfiguratorProps
) {
  return (
    <ConfiguratorContent
      key={`${props.product.id}:${props.product.designFee ?? "unset"}`}
      {...props}
    />
  );
}

function ConfiguratorContent({
  product,
  quoteRequestHref,
}: ProductConfiguratorProps) {
  const { addItem, hydrated } = useCart();

  const [selections, setSelections] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};

    for (const option of product.options ?? []) {
      if (option.required && option.choices[0]) {
        initial[option.id] = option.choices[0].id;
      }
    }

    return initial;
  });

  const [artworkType, setArtworkType] =
    useState<ArtworkType>("customer-supplied");

  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const selectedOptions = useMemo<
    SelectedProductOption[]
  >(() => {
    const result: SelectedProductOption[] = [];

    for (const option of product.options ?? []) {
      const choice = option.choices.find(
        (candidate) =>
          candidate.id === selections[option.id]
      );

      if (!choice) continue;

      result.push({
        optionId: option.id,
        optionLabel: option.label,
        choiceId: choice.id,
        choiceLabel: choice.label,
        priceModifier: choice.priceModifier ?? 0,
      });
    }

    return result;
  }, [product.options, selections]);

  const basePrice = product.pricing.basePrice ?? 0;

  const optionsTotal = roundMoney(
    selectedOptions.reduce(
      (sum, option) => sum + option.priceModifier,
      0
    )
  );

  // Production cost for one configured job.
  const unitPrice = roundMoney(basePrice + optionsTotal);

  const designAvailable = isMoney(product.designFee);

  const designFee =
    artworkType === "design-needed" && designAvailable
      ? roundMoney(product.designFee!)
      : 0;

  const estimatedTotal = roundMoney(
    unitPrice + designFee
  );

  const pricingValid =
    isMoney(product.pricing.basePrice) &&
    selectedOptions.every((option) =>
      isMoney(option.priceModifier)
    ) &&
    isMoney(optionsTotal) &&
    isMoney(unitPrice) &&
    isMoney(estimatedTotal);

  const artworkValid =
    artworkType === "customer-supplied" ||
    designAvailable;

  function resetFeedback() {
    setAdded(false);
    setError("");
  }

  function chooseOption(
    optionId: string,
    choiceId?: string
  ) {
    setSelections((current) => {
      const next = { ...current };

      if (choiceId === undefined) {
        delete next[optionId];
      } else {
        next[optionId] = choiceId;
      }

      return next;
    });

    resetFeedback();
  }

  function chooseArtwork(type: ArtworkType) {
    setArtworkType(type);
    resetFeedback();
  }

  function handleAddToOrder() {
    resetFeedback();

    if (!hydrated) {
      setError("Your order is still loading.");
      return;
    }

    if (
      product.published === false ||
      product.pricing.type === "quote"
    ) {
      setError("This product is unavailable for purchase.");
      return;
    }

    const missing = (product.options ?? []).find(
      (option) =>
        option.required &&
        !option.choices.some(
          (choice) =>
            choice.id === selections[option.id]
        )
    );

    if (missing) {
      setError(`Choose an option for ${missing.label}.`);
      return;
    }

    if (!pricingValid || !artworkValid) {
      setError(
        "Pricing is unavailable for these selections."
      );
      return;
    }

    try {
      addItem({
        cartItemId: createCartItemId(
          product.id,
          selectedOptions,
          artworkType
        ),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image || product.images?.[0] || "",
        quantity: 1,
        basePrice: roundMoney(basePrice),
        optionsTotal,

        // Keep production totals separate from artwork.
        unitPrice,
        totalPrice: unitPrice,

        selections: selectedOptions,
        artwork: {
          type: artworkType,
          designFee,
        },
      });

      setAdded(true);
    } catch {
      setError(
        "Unable to add this item. Please try again."
      );
    }
  }

  if (product.pricing.type === "quote") {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
        <h2 className="text-xl font-semibold tracking-tight">
          Custom production
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#625D55]">
          This product requires pricing based on your
          specifications.
        </p>

        {quoteRequestHref ? (
          <Link
            href={quoteRequestHref}
            className={`mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#F58220] px-5 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#D96B0D] ${focus}`}
          >
            Request a quote
          </Link>
        ) : (
          <p className="mt-4 text-sm text-[#625D55]">
            Online purchasing is currently unavailable
            for this product.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <div className="p-5 sm:p-7">
        <div className="border-b border-black/10 pb-6">
          <p className="text-xs font-medium text-[#625D55]">
            {product.pricing.type === "starting-from"
              ? "Starting from"
              : "Production price"}
          </p>

          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {isMoney(product.pricing.basePrice)
                ? currency.format(basePrice)
                : "Price unavailable"}
            </p>

            {isMoney(product.pricing.oldPrice) &&
              isMoney(product.pricing.basePrice) &&
              product.pricing.oldPrice > basePrice && (
                <span className="text-sm text-[#625D55] line-through">
                  {currency.format(product.pricing.oldPrice)}
                </span>
              )}
          </div>

          {product.pricing.baseQuantity != null && (
            <p className="mt-2 text-xs leading-6 text-[#625D55]">
              For{" "}
              <strong className="font-semibold text-[#181818]">
                {product.pricing.baseQuantity.toLocaleString(
                  "en-NG"
                )}{" "}
                {product.pricing.unit || "pieces"}
              </strong>
            </p>
          )}
        </div>

        {(product.options ?? []).map((option) => (
          <fieldset
            key={option.id}
            className="min-w-0 border-b border-black/10 pb-6"
          >
            <legend className="w-full pt-6">
              <span className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">
                  {option.label}
                </span>

                <span className="text-[10px] font-medium uppercase tracking-wide text-[#625D55]">
                  {option.required ? "Required" : "Optional"}
                </span>
              </span>
            </legend>

            <div className="flex flex-wrap gap-2">
              {!option.required && (
                <button
                  type="button"
                  aria-pressed={!selections[option.id]}
                  onClick={() => chooseOption(option.id)}
                  className={`min-h-11 rounded-xl border px-4 py-3 text-xs font-semibold transition-colors ${focus} ${
                    !selections[option.id]
                      ? "border-[#F58220] bg-[#F58220]/10"
                      : "border-black/15 hover:border-[#F58220]"
                  }`}
                >
                  None
                </button>
              )}

              {option.choices.map((choice) => {
                const selected =
                  selections[option.id] === choice.id;

                const modifier = choice.priceModifier ?? 0;
                const available = isMoney(modifier);

                return (
                  <button
                    key={choice.id}
                    type="button"
                    aria-pressed={selected}
                    disabled={!available}
                    onClick={() =>
                      chooseOption(option.id, choice.id)
                    }
                    className={`min-h-11 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${focus} ${
                      selected
                        ? "border-[#F58220] bg-[#F58220]/10"
                        : "border-black/15 hover:border-[#F58220]"
                    }`}
                  >
                    <span className="block text-xs font-semibold">
                      {choice.label}
                    </span>

                    {available && modifier > 0 && (
                      <span className="mt-1 block text-xs text-[#625D55]">
                        +{currency.format(modifier)}
                      </span>
                    )}

                    {!available && (
                      <span className="mt-1 block text-xs text-[#625D55]">
                        Unavailable
                      </span>
                    )}

                    {choice.description && (
                      <span className="mt-1 block max-w-48 text-xs leading-5 text-[#625D55]">
                        {choice.description}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <fieldset className="min-w-0">
          <legend className="pt-6 text-sm font-semibold">
            Artwork
          </legend>

          <p className="mt-1 text-xs leading-6 text-[#625D55]">
            Supply your finished design or add design
            assistance.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  type: "customer-supplied",
                  label: "I have my artwork",
                  description:
                    "Provide your production-ready design.",
                  Icon: FileCheck2,
                },
                {
                  type: "design-needed",
                  label: "I need design help",
                  description:
                    "We’ll create artwork from your brief.",
                  Icon: Palette,
                },
              ] as const
            ).map(({ type, label, description, Icon }) => {
              const selected = artworkType === type;

              const unavailable =
                type === "design-needed" &&
                !designAvailable;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  disabled={unavailable}
                  onClick={() => chooseArtwork(type)}
                  className={`rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${focus} ${
                    selected
                      ? "border-[#F58220] bg-[#F58220]/10"
                      : "border-black/15 hover:border-[#F58220]"
                  }`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <Icon
                      size={20}
                      aria-hidden="true"
                      className="text-[#F58220]"
                    />

                    {selected && (
                      <Check
                        size={17}
                        aria-hidden="true"
                        className="text-[#181818]"
                      />
                    )}
                  </span>

                  <span className="mt-4 block text-sm font-semibold">
                    {label}
                  </span>

                  <span className="mt-1 block text-xs leading-6 text-[#625D55]">
                    {description}
                  </span>

                  <span className="mt-3 block text-sm font-semibold">
                    {type === "customer-supplied"
                      ? "No design fee"
                      : designAvailable
                        ? product.designFee === 0
                          ? "Design included"
                          : `+${currency.format(product.designFee!)}`
                        : "Currently unavailable"}
                  </span>
                </button>
              );
            })}
          </div>

          {artworkType === "design-needed" && (
            <p className="mt-3 text-xs leading-6 text-[#625D55]">
              One design fee applies to this configured
              design in your order. Adding identical jobs
              does not multiply the design fee.
            </p>
          )}
        </fieldset>
      </div>

      <div className="border-t border-black/10 bg-[#F4F1E9]/60 p-5 sm:p-7">
        {pricingValid && (
          <dl className="space-y-3 border-b border-black/10 pb-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#625D55]">
                Base production
              </dt>
              <dd className="font-medium">
                {currency.format(basePrice)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-[#625D55]">
                Product options
              </dt>
              <dd className="font-medium">
                {currency.format(optionsTotal)}
              </dd>
            </div>

            <div className="flex justify-between gap-4">
              <dt className="text-[#625D55]">
                {artworkType === "design-needed"
                  ? "Design assistance · once"
                  : "Customer-supplied artwork"}
              </dt>
              <dd className="font-medium">
                {currency.format(designFee)}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-[#625D55]">
              {product.pricing.type === "starting-from"
                ? "Estimated total for one job"
                : "Total for one job"}
            </p>

            <p className="mt-1 text-3xl font-bold tracking-tight">
              {pricingValid && artworkValid
                ? currency.format(estimatedTotal)
                : "Unavailable"}
            </p>
          </div>

          <span className="rounded-full bg-white px-3 py-1.5 text-xs text-[#625D55]">
            Before delivery
          </span>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleAddToOrder}
          disabled={
            !hydrated ||
            !pricingValid ||
            !artworkValid ||
            product.published === false
          }
          className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F58220] px-5 py-4 text-sm font-semibold text-[#181818] transition-colors hover:bg-[#D96B0D] disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}
        >
          {added ? (
            <Check size={18} aria-hidden="true" />
          ) : (
            <ShoppingBag size={18} aria-hidden="true" />
          )}

          {!hydrated
            ? "Loading your order…"
            : added
              ? "Add another identical job"
              : "Add to order"}
        </button>

        <div
          role="status"
          aria-live="polite"
          className="mt-3 text-center text-xs leading-6"
        >
          {added && (
            <>
              Added to your order.{" "}
              <Link
                href="/shop/cart"
                className={`rounded-sm font-semibold underline decoration-[#F58220] underline-offset-4 ${focus}`}
              >
                View cart
              </Link>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs leading-6 text-[#625D55]">
          {product.pricing.type === "starting-from"
            ? "Your selected specifications determine the production estimate. Delivery is calculated separately."
            : "Production and selected design assistance are shown above. Delivery is calculated separately."}
        </p>
      </div>
    </div>
  );
}