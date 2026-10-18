"use client";
import Link from "next/link";
import { useShopIdentity } from "@/app/components/newjersey/experience/useShopIdentity";
import { useState } from "react";
import { useCart } from "@/app/contexts/cartContext";
import type {
  NewJerseyProduct,
  SelectedProductOption,
} from "@/app/types/commerce";
export default function ApparelPurchase({
  product,
}: {
  product: NewJerseyProduct;
}) {
  const { addItem, hydrated } = useCart();
  const identity = useShopIdentity();
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState("1");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  const price = product.pricing.basePrice ?? 0;
  const qty = Number(quantity);
  const valid = Number.isInteger(qty) && qty >= 1 && qty <= 1000;
  const money = (v: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(v);
  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const selections: SelectedProductOption[] = [];
    for (const option of product.options ?? []) {
      const choice = option.choices.find((x) => x.id === choices[option.id]);
      if (!choice) {
        setError(`Choose ${option.label.toLowerCase()}.`);
        return;
      }
      selections.push({
        optionId: option.id,
        optionLabel: option.label,
        choiceId: choice.id,
        choiceLabel: choice.label,
        priceModifier: 0,
      });
    }
    if (!valid || !hydrated) return;
    try {
      addItem({
        cartItemId: "",
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        quantity: qty,
        basePrice: price,
        optionsTotal: 0,
        unitPrice: price,
        totalPrice: Math.round(price * qty * 100) / 100,
        selections,
        artwork: { type: "not-required", designFee: 0 },
      });
      setAdded(true);
    } catch {
      setError("Unable to add this product. Please try again.");
    }
  }
  const field =
    "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#F58220]";
  return (
    <form
      onSubmit={add}
      className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
    >
      <p className="text-xs text-[#625D55]">Price per piece</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {money(price)}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {product.options?.map((option) => (
          <label key={option.id} className="text-sm font-medium">
            {option.label}
            <select
              required
              value={choices[option.id] ?? ""}
              className={field}
              onChange={(e) => {
                setChoices({ ...choices, [option.id]: e.target.value });
                setAdded(false);
              }}
            >
              <option value="">Choose {option.label.toLowerCase()}</option>
              {option.choices.map((choice) => (
                <option key={choice.id} value={choice.id}>
                  {choice.label}
                </option>
              ))}
            </select>
          </label>
        ))}
        <label className="text-sm font-medium">
          Quantity
          <input
            type="number"
            min={1}
            max={1000}
            step={1}
            required
            value={quantity}
            className={field}
            onChange={(e) => {
              setQuantity(e.target.value);
              setAdded(false);
            }}
          />
        </label>
      </div>
      <div className="mt-6 flex justify-between border-t border-black/10 pt-5 text-sm">
        <span>Total before delivery</span>
        <strong>{valid ? money(price * qty) : "-"}</strong>
      </div>
      <p className="mt-4 text-xs leading-6 text-[#625D55]">
        You are buying the design shown. No artwork upload is required.
      </p>
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        disabled={!hydrated || !valid}
        className="mt-5 min-h-12 w-full rounded-full bg-[#181818] px-5 text-sm font-semibold text-white disabled:opacity-40"
      >
        {added ? "Add another" : "Add to cart"}
      </button>
      {added && identity === null && <aside className="mt-4 rounded-xl bg-[#FFF3E8] p-4 text-xs leading-6">
        <p className="font-semibold">Your item is in your cart.</p>
        <p>Create an account to place your order and follow its progress. Your cart stays in this browser while you browse.</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1"><Link href="/register?next=%2Fshop%2Fcart" className="inline-flex min-h-11 items-center font-semibold underline">Create account</Link><Link href="/login?next=%2Fshop%2Fcart" className="inline-flex min-h-11 items-center underline">Sign in</Link><Link href="/shop/cart" className="inline-flex min-h-11 items-center underline">View cart</Link></div>
      </aside>}
      {added && (
        <p role="status" className="mt-4 text-sm">
          Added to your cart.{" "}
          <Link href="/shop/cart" className="underline">
            View cart
          </Link>
        </p>
      )}
      <Link
        href="/shop/custom"
        className="mt-5 inline-flex min-h-11 items-center text-xs text-[#625D55] underline underline-offset-4"
      >
        Need your own logo or design? Explore Custom
      </Link>
    </form>
  );
}
