"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  FileCheck2,
  Mail,
  MapPin,
  PackageCheck,
  Palette,
  Phone,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

import { useCart } from "@/app/contexts/cartContext";

type Step =
  | "customer"
  | "artwork"
  | "delivery"
  | "brief"
  | "review";

type DeliveryMethod = "delivery" | "pickup";

type CustomerDetails = {
  fullName: string;
  phone: string;
  email: string;
  organization: string;
};

type DeliveryDetails = {
  method: DeliveryMethod;
  state: string;
  city: string;
  address: string;
  landmark: string;
};

type ProductionBrief = {
  deadline: string;
  projectName: string;
  instructions: string;
};

type FieldErrors = Record<string, string>;

type CreateOrderResponse = {
  success: boolean;
  message?: string;
  order?: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    createdAt: string;
  };
};

const STEPS: {
  id: Step;
  number: string;
  label: string;
}[] = [
  {
    id: "customer",
    number: "01",
    label: "Customer",
  },
  {
    id: "artwork",
    number: "02",
    label: "Artwork",
  },
  {
    id: "delivery",
    number: "03",
    label: "Delivery",
  },
  {
    id: "brief",
    number: "04",
    label: "Brief",
  },
  {
    id: "review",
    number: "05",
    label: "Review",
  },
];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function NewOrderPage() {
  const router = useRouter();

  const {
    items,
    itemCount,
    subtotal,
    hydrated,
    clearCart,
  } = useCart();

  const [step, setStep] =
    useState<Step>("customer");

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  const [customer, setCustomer] =
    useState<CustomerDetails>({
      fullName: "",
      phone: "",
      email: "",
      organization: "",
    });

  const [delivery, setDelivery] =
    useState<DeliveryDetails>({
      method: "delivery",
      state: "",
      city: "",
      address: "",
      landmark: "",
    });

  const [brief, setBrief] =
    useState<ProductionBrief>({
      deadline: "",
      projectName: "",
      instructions: "",
    });

  const currentStepIndex =
    STEPS.findIndex(
      (item) => item.id === step
    );

  const progress =
    ((currentStepIndex + 1) /
      STEPS.length) *
    100;

  const artworkSummary =
    useMemo(() => {
      const supplied = items.filter(
        (item) =>
          item.artwork?.type ===
          "customer-supplied"
      ).length;

      const designNeeded = items.filter(
        (item) =>
          item.artwork?.type ===
          "design-needed"
      ).length;

      return {
        supplied,
        designNeeded,
      };
    }, [items]);

  function clearFieldError(field: string) {
    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];

      return next;
    });
  }

  function updateCustomer(
    field: keyof CustomerDetails,
    value: string
  ) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    clearFieldError(field);
    setSubmitError("");
  }

  function updateDelivery(
    field: keyof DeliveryDetails,
    value: string
  ) {
    setDelivery((current) => ({
      ...current,
      [field]: value,
    }));

    clearFieldError(field);
    setSubmitError("");
  }

  function updateBrief(
    field: keyof ProductionBrief,
    value: string
  ) {
    setBrief((current) => ({
      ...current,
      [field]: value,
    }));

    clearFieldError(field);
    setSubmitError("");
  }

  function validateCustomer() {
    const nextErrors: FieldErrors = {};

    if (!customer.fullName.trim()) {
      nextErrors.fullName =
        "Enter your full name.";
    }

    if (!customer.phone.trim()) {
      nextErrors.phone =
        "Enter a phone number.";
    }

    if (!customer.email.trim()) {
      nextErrors.email =
        "Enter an email address.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        customer.email.trim()
      )
    ) {
      nextErrors.email =
        "Enter a valid email address.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function validateDelivery() {
    if (delivery.method === "pickup") {
      setErrors({});
      return true;
    }

    const nextErrors: FieldErrors = {};

    if (!delivery.state.trim()) {
      nextErrors.state =
        "Enter your state.";
    }

    if (!delivery.city.trim()) {
      nextErrors.city =
        "Enter your city.";
    }

    if (!delivery.address.trim()) {
      nextErrors.address =
        "Enter the delivery address.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function validateBrief() {
    const nextErrors: FieldErrors = {};

    if (!brief.projectName.trim()) {
      nextErrors.projectName =
        "Give this order a project name.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function goNext() {
    setSubmitError("");

    if (step === "customer") {
      if (!validateCustomer()) return;

      setStep("artwork");
      return;
    }

    if (step === "artwork") {
      setErrors({});
      setStep("delivery");
      return;
    }

    if (step === "delivery") {
      if (!validateDelivery()) return;

      setStep("brief");
      return;
    }

    if (step === "brief") {
      if (!validateBrief()) return;

      setStep("review");
    }
  }

  function goBack() {
    setErrors({});
    setSubmitError("");

    if (step === "artwork") {
      setStep("customer");
      return;
    }

    if (step === "delivery") {
      setStep("artwork");
      return;
    }

    if (step === "brief") {
      setStep("delivery");
      return;
    }

    if (step === "review") {
      setStep("brief");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (step !== "review") {
      goNext();
      return;
    }

    if (submitting) return;

    if (items.length === 0) {
      setSubmitError(
        "Your order no longer contains any items."
      );
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            customer: {
              fullName:
                customer.fullName.trim(),
              phone: customer.phone.trim(),
              email: customer.email
                .trim()
                .toLowerCase(),
              organization:
                customer.organization.trim(),
            },
            delivery: {
              method: delivery.method,
              state: delivery.state.trim(),
              city: delivery.city.trim(),
              address:
                delivery.address.trim(),
              landmark:
                delivery.landmark.trim(),
            },
            brief: {
              projectName:
                brief.projectName.trim(),
              deadline: brief.deadline,
              instructions:
                brief.instructions.trim(),
            },
            items,
            subtotal,
          }),
        }
      );

      const data =
        (await response.json()) as CreateOrderResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {
        throw new Error(
          data.message ||
            "Unable to submit production request."
        );
      }

      const orderNumber =
        data.order.orderNumber;

      clearCart();

      router.push(
        `/shop/order/success?order=${encodeURIComponent(
          orderNumber
        )}`
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your production request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#f7f7f5]">
        <div className="mx-auto w-[92%] max-w-[1440px] py-10">
          <div className="h-8 w-44 animate-pulse rounded-lg bg-black/10" />

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
        <div className="mx-auto flex min-h-[80vh] w-[92%] max-w-[1200px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <ShoppingBag
                size={25}
                className="text-[#FF6B00]"
              />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
              NewJersey Order
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em]">
              Your order is empty.
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#777]">
              Configure at least one
              product before starting
              your production brief.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#222] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
            >
              Browse products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#222]">
      <div className="mx-auto w-[92%] max-w-[1440px] py-7 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/shop/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#FF6B00]"
          >
            <ArrowLeft size={15} />
            Back to cart
          </Link>

          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#aaa]">
            Production brief
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF6B00]">
            NewJersey.ng
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
            Tell us what we need to
            produce your order.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#777]">
            We&apos;ll use these details
            to review your artwork,
            production requirements and
            delivery before final
            confirmation.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-black/[0.06] bg-white">
          <div className="h-1 bg-black/[0.05]">
            <div
              className="h-full bg-[#FF6B00] transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-5">
            {STEPS.map(
              (item, index) => {
                const active =
                  item.id === step;

                const completed =
                  index <
                  currentStepIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (
                        index <=
                        currentStepIndex
                      ) {
                        setStep(item.id);
                        setErrors({});
                        setSubmitError("");
                      }
                    }}
                    className="min-w-0 px-2 py-4 text-center sm:px-4"
                  >
                    <span
                      className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold ${
                        active
                          ? "bg-[#FF6B00] text-white"
                          : completed
                            ? "bg-[#222] text-white"
                            : "bg-[#f1f1ef] text-[#999]"
                      }`}
                    >
                      {completed ? (
                        <Check size={12} />
                      ) : (
                        item.number
                      )}
                    </span>

                    <span
                      className={`mt-2 hidden text-[10px] font-semibold sm:block ${
                        active
                          ? "text-[#222]"
                          : "text-[#999]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_370px]"
        >
          <section className="rounded-[28px] border border-black/[0.06] bg-white p-5 sm:p-7 lg:p-8">
            {step === "customer" && (
              <div>
                <StepHeading
                  eyebrow="01 — Customer"
                  title="Who is placing this order?"
                  description="Use details we can reach you with during artwork review, production and delivery."
                />

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label="Full name"
                    required
                    icon={
                      <UserRound
                        size={17}
                      />
                    }
                    value={
                      customer.fullName
                    }
                    onChange={(value) =>
                      updateCustomer(
                        "fullName",
                        value
                      )
                    }
                    placeholder="Your full name"
                    error={
                      errors.fullName
                    }
                  />

                  <InputField
                    label="Phone number"
                    required
                    icon={
                      <Phone size={17} />
                    }
                    value={
                      customer.phone
                    }
                    onChange={(value) =>
                      updateCustomer(
                        "phone",
                        value
                      )
                    }
                    placeholder="e.g. 080..."
                    error={errors.phone}
                    type="tel"
                  />

                  <InputField
                    label="Email address"
                    required
                    icon={
                      <Mail size={17} />
                    }
                    value={
                      customer.email
                    }
                    onChange={(value) =>
                      updateCustomer(
                        "email",
                        value
                      )
                    }
                    placeholder="you@example.com"
                    error={errors.email}
                    type="email"
                  />

                  <InputField
                    label="Business / organisation"
                    icon={
                      <Building2
                        size={17}
                      />
                    }
                    value={
                      customer.organization
                    }
                    onChange={(value) =>
                      updateCustomer(
                        "organization",
                        value
                      )
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
            )}

            {step === "artwork" && (
              <div>
                <StepHeading
                  eyebrow="02 — Artwork"
                  title="Let's confirm your artwork."
                  description="Artwork requirements are attached to each configured print job."
                />

                <div className="mt-8 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="rounded-2xl border border-black/[0.07] p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f5f3]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold">
                            {item.name}
                          </p>

                          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#f7f7f5] px-3 py-1.5">
                            {item.artwork
                              ?.type ===
                            "design-needed" ? (
                              <Palette
                                size={13}
                                className="text-[#FF6B00]"
                              />
                            ) : (
                              <FileCheck2
                                size={13}
                                className="text-[#FF6B00]"
                              />
                            )}

                            <span className="text-[10px] font-semibold text-[#666]">
                              {item.artwork
                                ?.type ===
                              "design-needed"
                                ? "Design support required"
                                : "Artwork will be supplied"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {item.artwork
                        ?.type ===
                        "customer-supplied" && (
                        <div className="mt-4 rounded-xl bg-[#fff8f2] p-4">
                          <p className="text-xs font-semibold text-[#444]">
                            Artwork upload
                            comes next.
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-[#888]">
                            Your artwork
                            will be linked
                            to this order
                            after the order
                            is created.
                          </p>
                        </div>
                      )}

                      {item.artwork
                        ?.type ===
                        "design-needed" && (
                        <div className="mt-4 rounded-xl bg-[#f7f7f5] p-4">
                          <p className="text-xs font-semibold text-[#444]">
                            Design charge
                            pending.
                          </p>

                          <p className="mt-1 text-[10px] leading-4 text-[#888]">
                            Design
                            requirements
                            will be reviewed
                            before the final
                            price is
                            confirmed.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === "delivery" && (
              <div>
                <StepHeading
                  eyebrow="03 — Delivery"
                  title="How should the finished job reach you?"
                  description="Choose delivery or pickup. Delivery charges are confirmed separately."
                />

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <ChoiceCard
                    active={
                      delivery.method ===
                      "delivery"
                    }
                    icon={
                      <Truck size={19} />
                    }
                    title="Deliver my order"
                    description="Send the finished production to my address."
                    onClick={() =>
                      updateDelivery(
                        "method",
                        "delivery"
                      )
                    }
                  />

                  <ChoiceCard
                    active={
                      delivery.method ===
                      "pickup"
                    }
                    icon={
                      <Store size={19} />
                    }
                    title="I'll pick it up"
                    description="Collect the completed job when it is ready."
                    onClick={() =>
                      updateDelivery(
                        "method",
                        "pickup"
                      )
                    }
                  />
                </div>

                {delivery.method ===
                  "delivery" && (
                  <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <InputField
                      label="State"
                      required
                      value={
                        delivery.state
                      }
                      onChange={(value) =>
                        updateDelivery(
                          "state",
                          value
                        )
                      }
                      placeholder="State"
                      error={errors.state}
                    />

                    <InputField
                      label="City"
                      required
                      value={delivery.city}
                      onChange={(value) =>
                        updateDelivery(
                          "city",
                          value
                        )
                      }
                      placeholder="City / area"
                      error={errors.city}
                    />

                    <div className="sm:col-span-2">
                      <InputField
                        label="Delivery address"
                        required
                        icon={
                          <MapPin
                            size={17}
                          />
                        }
                        value={
                          delivery.address
                        }
                        onChange={(value) =>
                          updateDelivery(
                            "address",
                            value
                          )
                        }
                        placeholder="Full delivery address"
                        error={
                          errors.address
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputField
                        label="Landmark"
                        value={
                          delivery.landmark
                        }
                        onChange={(value) =>
                          updateDelivery(
                            "landmark",
                            value
                          )
                        }
                        placeholder="Optional landmark"
                      />
                    </div>
                  </div>
                )}

                {delivery.method ===
                  "pickup" && (
                  <div className="mt-7 rounded-2xl bg-[#f7f7f5] p-5">
                    <div className="flex gap-3">
                      <Store
                        size={18}
                        className="mt-0.5 shrink-0 text-[#FF6B00]"
                      />

                      <div>
                        <p className="text-sm font-semibold">
                          Pickup selected
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#777]">
                          Pickup details
                          will be confirmed
                          when the job is
                          ready.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "brief" && (
              <div>
                <StepHeading
                  eyebrow="04 — Production brief"
                  title="Give the job some context."
                  description="Add a project name, preferred deadline and anything production should know."
                />

                <div className="mt-8 space-y-5">
                  <InputField
                    label="Project / order name"
                    required
                    value={
                      brief.projectName
                    }
                    onChange={(value) =>
                      updateBrief(
                        "projectName",
                        value
                      )
                    }
                    placeholder="e.g. September Product Launch"
                    error={
                      errors.projectName
                    }
                  />

                  <InputField
                    label="Preferred deadline"
                    value={
                      brief.deadline
                    }
                    onChange={(value) =>
                      updateBrief(
                        "deadline",
                        value
                      )
                    }
                    type="date"
                  />

                  <div>
                    <label
                      htmlFor="production-instructions"
                      className="text-xs font-semibold text-[#444]"
                    >
                      Production notes
                    </label>

                    <textarea
                      id="production-instructions"
                      value={
                        brief.instructions
                      }
                      onChange={(event) =>
                        updateBrief(
                          "instructions",
                          event.target
                            .value
                        )
                      }
                      rows={7}
                      placeholder="Colours, packaging, special finishing, delivery timing or anything else we should know..."
                      className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-[#333] outline-none transition placeholder:text-[#aaa] focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10"
                    />

                    <p className="mt-2 text-[10px] text-[#999]">
                      A preferred deadline
                      is not a confirmed
                      production date.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === "review" && (
              <div>
                <StepHeading
                  eyebrow="05 — Review"
                  title="Review before submitting."
                  description="Nothing is charged yet. This creates the production request we will confirm before payment."
                />

                <div className="mt-8 space-y-4">
                  <ReviewSection
                    title="Customer"
                    onEdit={() =>
                      setStep("customer")
                    }
                  >
                    <ReviewRow
                      label="Name"
                      value={
                        customer.fullName
                      }
                    />

                    <ReviewRow
                      label="Phone"
                      value={
                        customer.phone
                      }
                    />

                    <ReviewRow
                      label="Email"
                      value={
                        customer.email
                      }
                    />

                    {customer.organization && (
                      <ReviewRow
                        label="Organisation"
                        value={
                          customer.organization
                        }
                      />
                    )}
                  </ReviewSection>

                  <ReviewSection
                    title="Delivery"
                    onEdit={() =>
                      setStep("delivery")
                    }
                  >
                    <ReviewRow
                      label="Method"
                      value={
                        delivery.method ===
                        "delivery"
                          ? "Delivery"
                          : "Pickup"
                      }
                    />

                    {delivery.method ===
                      "delivery" && (
                      <>
                        <ReviewRow
                          label="Location"
                          value={`${delivery.city}, ${delivery.state}`}
                        />

                        <ReviewRow
                          label="Address"
                          value={
                            delivery.address
                          }
                        />

                        {delivery.landmark && (
                          <ReviewRow
                            label="Landmark"
                            value={
                              delivery.landmark
                            }
                          />
                        )}
                      </>
                    )}
                  </ReviewSection>

                  <ReviewSection
                    title="Production brief"
                    onEdit={() =>
                      setStep("brief")
                    }
                  >
                    <ReviewRow
                      label="Project"
                      value={
                        brief.projectName
                      }
                    />

                    <ReviewRow
                      label="Deadline"
                      value={
                        brief.deadline ||
                        "Not specified"
                      }
                    />

                    {brief.instructions && (
                      <ReviewRow
                        label="Notes"
                        value={
                          brief.instructions
                        }
                      />
                    )}
                  </ReviewSection>

                  <div className="rounded-2xl border border-black/[0.07] p-5">
                    <p className="text-sm font-bold">
                      Production
                    </p>

                    <div className="mt-4 space-y-4">
                      {items.map((item) => (
                        <div
                          key={
                            item.cartItemId
                          }
                          className="flex gap-3 border-t border-black/[0.06] pt-4 first:border-t-0 first:pt-0"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3]">
                            <Image
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              fill
                              sizes="48px"
                              className="object-contain p-1.5"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold">
                              {item.name}
                            </p>

                            <p className="mt-1 text-[10px] text-[#888]">
                              {item.selections
                                .map(
                                  (
                                    selection
                                  ) =>
                                    selection.choiceLabel
                                )
                                .join(" · ")}
                            </p>
                          </div>

                          <p className="shrink-0 text-xs font-bold">
                            {formatNaira(
                              item.totalPrice
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-[#fff7f0] p-5">
                    <div className="flex gap-3">
                      <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 text-[#FF6B00]"
                      />

                      <div>
                        <p className="text-xs font-bold">
                          Review required
                          before payment
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-[#777]">
                          Artwork,
                          specifications,
                          design work and
                          delivery can
                          affect the final
                          amount.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold text-red-700">
                  {submitError}
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/[0.07] pt-6">
              {step === "customer" ? (
                <Link
                  href="/shop/cart"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#222]"
                >
                  <ChevronLeft
                    size={15}
                  />
                  Cart
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={goBack}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] transition hover:text-[#222] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft
                    size={15}
                  />
                  Back
                </button>
              )}

              {step !== "review" ? (
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#222] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
                >
                  Continue
                  <ArrowRight
                    size={16}
                  />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#222] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PackageCheck
                    size={17}
                  />

                  {submitting
                    ? "Submitting..."
                    : "Submit production request"}
                </button>
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-5 sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF6B00]">
                Your order
              </p>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 border-b border-black/[0.06] pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#f5f5f3]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1.5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold">
                        {item.name}
                      </p>

                      <p className="mt-1 text-[9px] text-[#999]">
                        {
                          item.selections
                            .length
                        }{" "}
                        production{" "}
                        {item.selections
                          .length === 1
                          ? "option"
                          : "options"}
                      </p>
                    </div>

                    <p className="shrink-0 text-xs font-bold">
                      {formatNaira(
                        item.totalPrice
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-black/[0.07] pt-5">
                <SummaryRow
                  label="Configured jobs"
                  value={String(
                    itemCount
                  )}
                />

                <SummaryRow
                  label="Artwork supplied"
                  value={String(
                    artworkSummary.supplied
                  )}
                />

                <SummaryRow
                  label="Design support"
                  value={String(
                    artworkSummary.designNeeded
                  )}
                />
              </div>

              <div className="mt-5 border-t border-black/[0.07] pt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#999]">
                  Estimated production
                </p>

                <p className="mt-1 text-2xl font-bold tracking-[-0.04em]">
                  {formatNaira(subtotal)}
                </p>

                <p className="mt-2 text-[9px] leading-4 text-[#999]">
                  Delivery and
                  unconfirmed design
                  charges are not
                  included.
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-[#222] p-5 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF8A33]">
                What happens next?
              </p>

              <p className="mt-3 text-xs font-semibold">
                We review before we
                produce.
              </p>

              <p className="mt-2 text-[10px] leading-5 text-white/60">
                Your specifications,
                artwork and delivery
                details are checked
                before final pricing and
                production are
                confirmed.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function StepHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#FF6B00]">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-[-0.035em] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#777]">
        {description}
      </p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-[#444]">
        {label}

        {required && (
          <span className="ml-1 text-[#FF6B00]">
            *
          </span>
        )}
      </label>

      <div
        className={`mt-2 flex h-12 items-center rounded-xl border bg-white transition focus-within:ring-2 ${
          error
            ? "border-red-400 focus-within:ring-red-100"
            : "border-black/10 focus-within:border-[#FF6B00] focus-within:ring-[#FF6B00]/10"
        }`}
      >
        {icon && (
          <div className="ml-4 shrink-0 text-[#999]">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-4 text-sm text-[#333] outline-none placeholder:text-[#aaa]"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-[10px] font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function ChoiceCard({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        active
          ? "border-[#FF6B00] bg-[#fff7f0]"
          : "border-black/10 bg-white hover:border-black/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            active
              ? "bg-white text-[#FF6B00]"
              : "bg-[#f5f5f3] text-[#777]"
          }`}
        >
          {icon}
        </div>

        {active && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00] text-white">
            <Check size={12} />
          </div>
        )}
      </div>

      <p className="mt-5 text-sm font-bold">
        {title}
      </p>

      <p className="mt-2 text-[10px] leading-4 text-[#888]">
        {description}
      </p>
    </button>
  );
}

function ReviewSection({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: ReactNode;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-black/[0.07] p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold">
          {title}
        </p>

        <button
          type="button"
          onClick={onEdit}
          className="text-[10px] font-bold text-[#FF6B00]"
        >
          Edit
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[130px_1fr]">
      <span className="text-[10px] font-semibold text-[#999]">
        {label}
      </span>

      <span className="break-words text-xs font-medium text-[#444]">
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-3 flex justify-between text-xs first:mt-0">
      <span className="text-[#777]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}