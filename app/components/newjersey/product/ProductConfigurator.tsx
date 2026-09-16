"use client";

import {
  Check,
  FileCheck2,
  Palette,
  ShoppingBag,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useCart } from "@/app/contexts/cartContext";

import type {
  NewJerseyProduct,
  ProductOptionChoice,
  SelectedProductOption,
} from "@/app/types/commerce";

type ProductConfiguratorProps = {
  product: NewJerseyProduct;
};

type ArtworkType =
  | "customer-supplied"
  | "design-needed";

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function createCartItemId(
  productId: string,
  selections: SelectedProductOption[],
  artworkType: ArtworkType
) {
  const optionSignature = selections
    .map(
      (selection) =>
        `${selection.optionId}:${selection.choiceId}`
    )
    .sort()
    .join("|");

  return `${productId}__${optionSignature}__${artworkType}`;
}

export default function ProductConfigurator({
  product,
}: ProductConfiguratorProps) {
  const { addItem } = useCart();

  const initialSelections =
    useMemo<Record<string, string>>(() => {
      const defaults: Record<string, string> = {};

      for (
        const option of product.options ?? []
      ) {
        const firstChoice =
          option.choices[0];

        if (firstChoice) {
          defaults[option.id] =
            firstChoice.id;
        }
      }

      return defaults;
    }, [product.options]);

  const [selections, setSelections] =
    useState<Record<string, string>>(
      initialSelections
    );

  const [artworkType, setArtworkType] =
    useState<ArtworkType>(
      "customer-supplied"
    );

  const [added, setAdded] =
    useState(false);

  const selectedOptions =
    useMemo<SelectedProductOption[]>(
      () => {
        const result: SelectedProductOption[] =
          [];

        for (
          const option of
            product.options ?? []
        ) {
          const selectedId =
            selections[option.id];

          const choice =
            option.choices.find(
              (item) =>
                item.id === selectedId
            );

          if (!choice) continue;

          result.push({
            optionId: option.id,
            optionLabel: option.label,

            choiceId: choice.id,
            choiceLabel: choice.label,

            priceModifier:
              choice.priceModifier ?? 0,
          });
        }

        return result;
      },
      [product.options, selections]
    );

  const basePrice =
    product.pricing.basePrice ?? 0;

  const optionsTotal =
    selectedOptions.reduce(
      (total, option) =>
        total + option.priceModifier,
      0
    );

  /*
   * We intentionally keep the design fee at 0 for now.
   *
   * Design pricing should eventually come from
   * NewJersey's real design/service pricing rather
   * than inventing a random charge here.
   */
  const designFee = 0;

  const unitPrice =
    basePrice +
    optionsTotal +
    designFee;

  const estimatedTotal = unitPrice;

  function selectOption(
    optionId: string,
    choice: ProductOptionChoice
  ) {
    setSelections((current) => ({
      ...current,
      [optionId]: choice.id,
    }));

    setAdded(false);
  }

  function handleArtworkChange(
    type: ArtworkType
  ) {
    setArtworkType(type);
    setAdded(false);
  }

  function handleAddToOrder() {
    if (
      product.pricing.type === "quote"
    ) {
      return;
    }

    const cartItemId =
      createCartItemId(
        product.id,
        selectedOptions,
        artworkType
      );

    addItem({
      cartItemId,

      productId: product.id,
      slug: product.slug,

      name: product.name,
      image: product.image,

      quantity: 1,

      basePrice,
      optionsTotal,
      unitPrice,
      totalPrice: unitPrice,

      selections: selectedOptions,

      artwork: {
        type: artworkType,
        designFee,
      },
    });

    setAdded(true);
  }

  /*
  |--------------------------------------------------------------------------
  | QUOTE PRODUCTS
  |--------------------------------------------------------------------------
  */

  if (
    product.pricing.type === "quote"
  ) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm sm:p-7">
        <span className="inline-flex rounded-full bg-[#fff2e8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF6B00]">
          Custom production
        </span>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-[#222]">
          Let&apos;s price this properly.
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#777]">
          This product needs a custom
          production quote based on your
          quantity, dimensions, materials,
          finishing and artwork.
        </p>

        {product.pricing
          .baseQuantity ? (
          <div className="mt-6 rounded-2xl bg-[#f7f7f5] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#aaa]">
              Quantity reference
            </p>

            <p className="mt-2 text-sm font-semibold text-[#333]">
              {product.pricing.baseQuantity.toLocaleString()}{" "}
              {product.pricing.unit ?? ""}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          className="mt-6 w-full rounded-xl bg-[#222] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
        >
          Start quote request
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm">
      {/* PRICE */}

      <div className="p-5 sm:p-7">
        <div className="border-b border-black/10 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#999]">
            {product.pricing.type ===
            "starting-from"
              ? "Starting from"
              : "Price"}
          </p>

          <div className="mt-2 flex items-baseline gap-3">
            <p className="text-3xl font-bold tracking-[-0.04em] text-[#222] sm:text-4xl">
              {formatNaira(
                basePrice
              )}
            </p>

            {product.pricing
              .oldPrice ? (
              <span className="text-sm text-[#aaa] line-through">
                {formatNaira(
                  product.pricing
                    .oldPrice
                )}
              </span>
            ) : null}
          </div>

          {product.pricing
            .baseQuantity ? (
            <p className="mt-2 text-xs text-[#888]">
              Base price for{" "}
              <strong className="font-semibold text-[#555]">
                {product.pricing.baseQuantity.toLocaleString()}{" "}
                {product.pricing.unit}
              </strong>
            </p>
          ) : null}
        </div>

        {/* PRODUCT OPTIONS */}

        {(product.options ?? []).map(
          (option) => (
            <div
              key={option.id}
              className="border-b border-black/10 py-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#222]">
                  {option.label}
                </h3>

                {option.required ? (
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#aaa]">
                    Required
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {option.choices.map(
                  (choice) => {
                    const selected =
                      selections[
                        option.id
                      ] === choice.id;

                    return (
                      <button
                        key={
                          choice.id
                        }
                        type="button"
                        aria-pressed={
                          selected
                        }
                        onClick={() =>
                          selectOption(
                            option.id,
                            choice
                          )
                        }
                        className={[
                          "rounded-xl border px-4 py-3 text-left transition",
                          selected
                            ? "border-[#FF6B00] bg-[#fff5ed]"
                            : "border-black/10 bg-white hover:border-black/30",
                        ].join(
                          " "
                        )}
                      >
                        <span
                          className={[
                            "block text-xs font-semibold",
                            selected
                              ? "text-[#d85b00]"
                              : "text-[#444]",
                          ].join(
                            " "
                          )}
                        >
                          {
                            choice.label
                          }
                        </span>

                        {(choice.priceModifier ??
                          0) >
                        0 ? (
                          <span className="mt-1 block text-[10px] text-[#999]">
                            +
                            {formatNaira(
                              choice.priceModifier ??
                                0
                            )}
                          </span>
                        ) : null}

                        {choice.description ? (
                          <span className="mt-1 block max-w-[180px] text-[10px] leading-4 text-[#999]">
                            {
                              choice.description
                            }
                          </span>
                        ) : null}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )
        )}

        {/* ARTWORK */}

        <div className="pt-6">
          <div>
            <p className="text-sm font-semibold text-[#222]">
              Artwork
            </p>

            <p className="mt-1 text-xs leading-5 text-[#888]">
              Tell us whether your
              artwork is already ready
              for production.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                handleArtworkChange(
                  "customer-supplied"
                )
              }
              className={[
                "rounded-2xl border p-4 text-left transition",
                artworkType ===
                "customer-supplied"
                  ? "border-[#FF6B00] bg-[#fff5ed]"
                  : "border-black/10 hover:border-black/30",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#FF6B00]">
                  <FileCheck2
                    size={17}
                  />
                </div>

                {artworkType ===
                "customer-supplied" ? (
                  <Check
                    size={17}
                    className="text-[#FF6B00]"
                  />
                ) : null}
              </div>

              <p className="mt-4 text-xs font-bold text-[#333]">
                I have my artwork
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#888]">
                You&apos;ll provide
                production-ready artwork
                for this order.
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                handleArtworkChange(
                  "design-needed"
                )
              }
              className={[
                "rounded-2xl border p-4 text-left transition",
                artworkType ===
                "design-needed"
                  ? "border-[#FF6B00] bg-[#fff5ed]"
                  : "border-black/10 hover:border-black/30",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#FF6B00]">
                  <Palette
                    size={17}
                  />
                </div>

                {artworkType ===
                "design-needed" ? (
                  <Check
                    size={17}
                    className="text-[#FF6B00]"
                  />
                ) : null}
              </div>

              <p className="mt-4 text-xs font-bold text-[#333]">
                I need design help
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#888]">
                NewJersey will review
                your design requirements
                before confirming the
                design fee.
              </p>
            </button>
          </div>

          {artworkType ===
          "design-needed" ? (
            <div className="mt-3 rounded-xl bg-[#f7f7f5] px-4 py-3 text-[10px] leading-4 text-[#777]">
              Design charges are not
              included in this estimate.
              We&apos;ll confirm them
              after reviewing your
              brief.
            </div>
          ) : null}
        </div>
      </div>

      {/* ORDER SUMMARY */}

      <div className="border-t border-black/10 bg-[#f7f7f5] p-5 sm:p-7">
        {optionsTotal > 0 ? (
          <div className="mb-4 space-y-2 border-b border-black/10 pb-4">
            <div className="flex justify-between text-xs">
              <span className="text-[#888]">
                Base production
              </span>

              <span className="font-medium text-[#555]">
                {formatNaira(
                  basePrice
                )}
              </span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-[#888]">
                Product options
              </span>

              <span className="font-medium text-[#555]">
                +
                {formatNaira(
                  optionsTotal
                )}
              </span>
            </div>
          </div>
        ) : null}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#999]">
              Estimated total
            </p>

            <p className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[#222]">
              {formatNaira(
                estimatedTotal
              )}
            </p>
          </div>

          <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-[#777]">
            Before delivery
          </span>
        </div>

        <button
          type="button"
          onClick={
            handleAddToOrder
          }
          className={[
            "mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm font-semibold text-white transition",
            added
              ? "bg-[#2e7d32]"
              : "bg-[#222] hover:bg-[#FF6B00]",
          ].join(" ")}
        >
          {added ? (
            <>
              <Check size={17} />
              Added to order
            </>
          ) : (
            <>
              <ShoppingBag
                size={17}
              />
              Add to order
            </>
          )}
        </button>

        <p className="mt-4 text-center text-[10px] leading-4 text-[#999]">
          Final production pricing is
          confirmed after specifications
          and artwork review.
        </p>
      </div>
    </div>
  );
}