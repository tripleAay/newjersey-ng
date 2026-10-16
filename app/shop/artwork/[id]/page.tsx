import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import type { ReactNode } from "react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";

import ArtworkUpload from "@/app/components/newjersey/order/ArtworkUpload";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function PageShell({
  children,
}: {
  children: ReactNode;
}) {
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

      {children}

      <Footer />
    </div>
  );
}

function artworkMessage(status: string) {
  switch (status) {
    case "pending":
      return "Upload your production-ready artwork below.";

    case "uploaded":
      return "Your file has been received and is awaiting review.";

    case "reviewing":
      return "We’re checking your artwork for production readiness.";

    case "approved":
      return "Your artwork has been approved. Production and payment arrangements are confirmed separately.";

    case "revision-required":
      return "Please update your artwork using the feedback below.";

    case "rejected":
      return "This artwork was rejected. Please contact us with your order reference to discuss the next step.";

    default:
      return "Artwork status is currently unavailable.";
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Awaiting upload";

    case "uploaded":
      return "Awaiting review";

    case "reviewing":
      return "Under review";

    case "approved":
      return "Approved";

    case "revision-required":
      return "Changes requested";

    case "rejected":
      return "Rejected";

    default:
      return status.replaceAll("-", " ");
  }
}

export default async function OrderArtworkPage({
  params,
}: Props) {
  const { id } = await params;

  if (typeof id !== "string" || !UUID.test(id)) {
    notFound();
  }

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return (
      <PageShell>
        <main className="mx-auto flex min-h-[55vh] max-w-lg items-center justify-center px-5 py-12 text-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to access your artwork.
            </h1>

            <p className="mt-3 text-sm leading-7 text-[#625D55]">
              Use the account that placed this order,
              then reopen this page.
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#F58220] px-5 text-sm font-semibold transition-colors hover:bg-[#D96B0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220] focus-visible:ring-offset-2"
            >
              Back to shop
            </Link>
          </div>
        </main>
      </PageShell>
    );
  }

  const supabase = getSupabaseAdmin();

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("[Artwork order lookup]", orderError);
    throw new Error("Unable to load your order.");
  }

  if (!order) {
    notFound();
  }

  const [itemsResult, artworksResult] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, product_name")
      .eq("order_id", order.id)
      .eq("artwork_type", "customer-supplied"),

    supabase
      .from("order_artworks")
      .select(
        "id, order_item_id, status, file_name, notes, updated_at"
      )
      .eq("order_id", order.id)
      .order("created_at", { ascending: true }),
  ]);

  if (itemsResult.error || artworksResult.error) {
    console.error("[Artwork details lookup]", {
      itemsError: itemsResult.error,
      artworksError: artworksResult.error,
    });

    throw new Error("Unable to load artwork details.");
  }

  const itemNames = new Map<string, string>();

  for (const item of itemsResult.data ?? []) {
    itemNames.set(item.id, item.product_name);
  }

  const customerArtworks = (
    artworksResult.data ?? []
  ).filter(
    (artwork) =>
      typeof artwork.order_item_id === "string" &&
      itemNames.has(artwork.order_item_id)
  );

  const uploadsOpen = [
    "submitted",
    "under-review",
    "awaiting-artwork",
  ].includes(order.status);

  const revisionsRequested = customerArtworks.some(
    (artwork) =>
      artwork.status === "revision-required"
  );

  return (
    <PageShell>
      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 rounded-sm text-xs font-semibold text-[#625D55] transition-colors hover:text-[#181818] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
          NewJersey.ng
          <span className="px-2 text-[#F58220]">/</span>
          Order artwork
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          {revisionsRequested
            ? "Update your artwork."
            : "Your order artwork."}
        </h1>

        <p className="mt-3 break-all text-sm font-semibold">
          {order.order_number}
        </p>

        <p className="mt-4 text-sm leading-7 text-[#625D55]">
          {revisionsRequested
            ? "Review the requested changes below and upload your corrected file when ready."
            : "Upload your finished designs and check their review status here."}
        </p>

        {!uploadsOpen && (
          <p className="mt-5 rounded-xl border border-black/10 bg-white p-4 text-sm leading-7 text-[#625D55]">
            New uploads are currently closed for this
            order. Its status is{" "}
            <span className="font-medium capitalize text-[#181818]">
              {order.status.replaceAll("-", " ")}
            </span>
            .
          </p>
        )}

        <div className="mt-8 space-y-5">
          {customerArtworks.length === 0 ? (
            <section className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="text-lg font-semibold">
                No artwork requests available.
              </h2>

              <p className="mt-2 text-sm leading-7 text-[#625D55]">
                If you selected customer-supplied artwork,
                contact us with your order reference.
              </p>
            </section>
          ) : (
            customerArtworks.map((artwork) => {
              const revisionRequired =
                artwork.status === "revision-required";

              const canUpload =
                uploadsOpen &&
                ["pending", "revision-required"].includes(
                  artwork.status
                );

              const reviewNotes =
                typeof artwork.notes === "string"
                  ? artwork.notes.trim()
                  : "";

              return (
                <section
                  key={artwork.id}
                  className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold tracking-tight">
                      {itemNames.get(artwork.order_item_id)}
                    </h2>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F58220]/10 px-3 py-1 text-xs font-medium">
                      {artwork.status === "approved" && (
                        <CheckCircle2
                          size={14}
                          aria-hidden="true"
                        />
                      )}

                      {statusLabel(artwork.status)}
                    </span>
                  </div>

                  {artwork.file_name && (
                    <p className="mt-3 break-all text-sm text-[#625D55]">
                      {revisionRequired
                        ? "Previous file: "
                        : "File: "}
                      {artwork.file_name}
                    </p>
                  )}

                  <p className="mt-4 text-sm leading-7 text-[#625D55]">
                    {artworkMessage(artwork.status)}
                  </p>

                  {reviewNotes && (
                    <div className="mt-5 rounded-xl border border-[#F58220]/20 bg-[#F58220]/5 p-4 sm:p-5">
                      <h3 className="flex items-center gap-2 text-sm font-semibold">
                        <MessageSquare
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-[#F58220]"
                        />

                        {revisionRequired
                          ? "What needs changing"
                          : "Review feedback"}
                      </h3>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#625D55]">
                        {reviewNotes}
                      </p>
                    </div>
                  )}

                  {revisionRequired && !reviewNotes && (
                    <p className="mt-4 rounded-xl bg-[#F4F1E9] p-4 text-sm leading-7 text-[#625D55]">
                      Please contact us with your order
                      reference for the required changes
                      before uploading another file.
                    </p>
                  )}

                  {canUpload && (
                    <div className="mt-5 border-t border-black/10 pt-1">
                      {revisionRequired && (
                        <p className="mt-4 text-xs leading-6 text-[#625D55]">
                          Your corrected file will be
                          submitted for another review.
                        </p>
                      )}

                      <ArtworkUpload
                        key={`${artwork.id}:${artwork.updated_at}`}
                        orderId={order.id}
                        artworkId={artwork.id}
                      />
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>
      </main>
    </PageShell>
  );
}