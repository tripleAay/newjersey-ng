"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

type SubmissionResult = {
  error?: string;
  orderId?: string;
};

type JerseyValues = {
  productId: string;
  quantity: number;
  printedName: string;
  printedNumber: string;
  fullName: string;
  phone: string;
  email: string;
  deliveryMethod: "pickup" | "delivery";
  state: string;
  city: string;
  address: string;
  size: string;
  instructions: string;
  expectedUnitMinor: number;
};

function text(
  form: FormData,
  key: string,
  max: number
): string {
  const value = form.get(key);

  if (typeof value !== "string" || value.length > max) {
    throw new Error(`Invalid ${key.replaceAll("_", " ")}.`);
  }

  return value.trim();
}

function money(value: unknown): number {
  if (
    (typeof value !== "string" && typeof value !== "number") ||
    String(value).trim() === ""
  ) {
    throw new Error("Pricing is not configured for this jersey.");
  }

  const amount = Number(value);

  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    amount > 99999999.99
  ) {
    throw new Error("Pricing is not configured for this jersey.");
  }

  return Math.round(amount * 100);
}

export async function submitJersey(
  form: FormData
): Promise<SubmissionResult> {
  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return {
      error: "Please sign in before submitting your jersey order.",
    };
  }

  let values: JerseyValues;

  try {
    const productId = text(form, "product_id", 19);

    if (
      !/^[1-9]\d*$/.test(productId) ||
      BigInt(productId) > 9223372036854775807n
    ) {
      throw new Error("Choose a valid jersey.");
    }

    const rawQuantity = text(form, "quantity", 3);

    if (!/^\d{1,3}$/.test(rawQuantity)) {
      throw new Error("Choose a quantity between 1 and 100.");
    }

    const quantity = Number(rawQuantity);

    if (quantity < 1 || quantity > 100) {
      throw new Error("Choose a quantity between 1 and 100.");
    }

    const printedName = text(form, "printed_name", 30);
    const printedNumber = text(form, "printed_number", 3);

    if (/[\u0000-\u001f\u007f]/.test(printedName)) {
      throw new Error("Enter a valid printed name.");
    }

    if (
      printedNumber &&
      !/^\d{1,3}$/.test(printedNumber)
    ) {
      throw new Error(
        "Enter a jersey number containing 1 to 3 digits."
      );
    }

    const fullName = text(form, "full_name", 150);
    const phone = text(form, "phone", 40);
    const email = text(form, "email", 254).toLowerCase();

    if (
      !fullName ||
      !phone ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw new Error(
        "Enter your name, phone number and a valid email."
      );
    }

    if (form.get("confirmed") !== "on") {
      throw new Error(
        "Confirm that you have checked your jersey details."
      );
    }

    const deliveryMethod = text(form, "delivery_method", 10);

    if (
      deliveryMethod !== "pickup" &&
      deliveryMethod !== "delivery"
    ) {
      throw new Error("Choose delivery or pickup.");
    }

    const state = text(form, "state", 100);
    const city = text(form, "city", 100);
    const address = text(form, "address", 500);
    const size = text(form, "size", 15);

    if (!size) {
      throw new Error("Choose your jersey size.");
    }

    if (
      deliveryMethod === "delivery" &&
      (!state || !city || !address)
    ) {
      throw new Error(
        "Enter your delivery state, city and address."
      );
    }

    const expectedPrice = text(
      form,
      "expected_unit_minor",
      15
    );

    if (!/^\d+$/.test(expectedPrice)) {
      throw new Error(
        "Refresh this page to review the current price."
      );
    }

    const expectedUnitMinor = Number(expectedPrice);

    if (!Number.isSafeInteger(expectedUnitMinor)) {
      throw new Error("Invalid order amount.");
    }

    values = {
      productId,
      quantity,
      printedName,
      printedNumber,
      fullName,
      phone,
      email,
      deliveryMethod,
      state,
      city,
      address,
      size,
      instructions: text(form, "instructions", 2000),
      expectedUnitMinor,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Check your jersey details.",
    };
  }

  const supabase = getSupabaseAdmin();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
      price,
      currency,
      sale_mode,
      image_url,
      jersey_team,
      jersey_season,
      jersey_kit,
      jersey_sizes,
      jersey_name_fee,
      jersey_number_fee
    `)
    .eq("id", values.productId)
    .eq("jersey_enabled", true)
    .eq("publication_status", "published")
    .maybeSingle();

  if (productError) {
    console.error("[Jersey product lookup]", productError);

    return {
      error: "Unable to load this jersey. Please try again.",
    };
  }

  if (!product) {
    return {
      error: "This jersey is currently unavailable.",
    };
  }

  if (
    product.currency !== "NGN" ||
    product.sale_mode !== "fixed" ||
    !product.slug ||
    !product.jersey_team ||
    !product.jersey_season ||
    !["home", "away", "third"].includes(product.jersey_kit) ||
    !Array.isArray(product.jersey_sizes) ||
    !product.jersey_sizes.includes(values.size)
  ) {
    return {
      error:
        "This jersey or size is unavailable. Refresh the page.",
    };
  }

  let base: number;
  let nameCharge: number;
  let numberCharge: number;

  try {
    base = money(product.price);

    nameCharge = values.printedName
      ? money(product.jersey_name_fee)
      : 0;

    numberCharge = values.printedNumber
      ? money(product.jersey_number_fee)
      : 0;

    if (base <= 0) {
      throw new Error("Jersey pricing is unavailable.");
    }

    if (
      values.expectedUnitMinor !==
      base + nameCharge + numberCharge
    ) {
      throw new Error(
        "The price has changed. Refresh this page to review the current price."
      );
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Pricing is unavailable.",
    };
  }

  const unitMinor = base + nameCharge + numberCharge;
  const totalMinor = unitMinor * values.quantity;

  if (!Number.isSafeInteger(totalMinor)) {
    return { error: "The order amount is too large." };
  }

  const total = totalMinor / 100;

  const selectionRows: Array<
    [string, string, string, number]
  > = [
    ["team", "Team", product.jersey_team, 0],
    ["season", "Season", product.jersey_season, 0],
    ["kit", "Kit", product.jersey_kit, 0],
    ["size", "Size", values.size, 0],
    [
      "printed-name",
      "Printed name",
      values.printedName || "None",
      nameCharge / 100,
    ],
    [
      "printed-number",
      "Printed number",
      values.printedNumber || "None",
      numberCharge / 100,
    ],
  ];

  const selections = selectionRows.map(
    ([id, label, value, modifier]) => ({
      optionId: id,
      optionLabel: label,
      choiceId: value,
      choiceLabel: value,
      priceModifier: modifier,
    })
  );

  const date = new Date()
    .toISOString()
    .slice(2, 10)
    .replaceAll("-", "");

  const reference = randomUUID()
    .replaceAll("-", "")
    .slice(0, 16)
    .toUpperCase();

  const orderNumber = `NJ-${date}-${reference}`;

  const { data, error } = await supabase.rpc(
    "create_jersey_order",
    {
      p_order: {
        customer_id: user.id,
        order_number: orderNumber,
        customer_full_name: values.fullName,
        customer_phone: values.phone,
        customer_email: values.email,
        customer_organization: null,
        delivery_method: values.deliveryMethod,
        delivery_state:
          values.deliveryMethod === "delivery"
            ? values.state
            : null,
        delivery_city:
          values.deliveryMethod === "delivery"
            ? values.city
            : null,
        delivery_address:
          values.deliveryMethod === "delivery"
            ? values.address
            : null,
        delivery_landmark: null,
        project_name:
          `${product.jersey_team} ${product.jersey_season} ${product.jersey_kit} jerseys`,
        preferred_deadline: null,
        production_instructions: [
          "JERSEY ORDER",
          "Customer confirmed spelling, capitalisation, number, kit and size.",
          "Preserve the exact printed name and number shown in selections.",
          values.quantity > 1
            ? "All pieces have the same size and personalisation."
            : "",
          values.instructions,
        ]
          .filter(Boolean)
          .join("\n"),
        item_count: values.quantity,
        subtotal: total,
        design_fee: 0,
        status: "under-review",
      },

      p_items: [
        {
          cart_item_id: `jersey-${randomUUID()}`,
          product_id: String(product.id),
          product_slug: product.slug,
          product_name: product.name,
          product_image: product.image_url || null,
          quantity: values.quantity,
          base_price: base / 100,
          options_total:
            (nameCharge + numberCharge) / 100,
          unit_price: unitMinor / 100,
          total_price: total,
          selections,

          // Compatibility with the existing artwork_type values.
          // create_jersey_order sets review_mode = "jersey".
          artwork_type: "design-needed",
          design_fee: 0,
        },
      ],
    }
  );

  if (error) {
    console.error("[Jersey order creation]", error);

    return {
      error: "Your order could not be saved. Please try again.",
    };
  }

  if (
    !data ||
    typeof data !== "object" ||
    typeof data.id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      data.id
    )
  ) {
    return {
      error:
        "The order was submitted, but its confirmation could not be read. Check your orders before submitting again.",
    };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/shop/order");

  return { orderId: data.id };
}