import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import DashboardHeader from "@/app/components/dashboard components/mainheader";
import TopNav from "@/app/components/dashboard components/topnav";
import Footer from "@/app/components/Footer";
import ArtworkUpload from "@/app/components/newjersey/order/ArtworkUpload";

import { createClient } from "@/app/lib/newjersey/supabase/server";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderArtworkPage({ params }: Props) {
  const { id } = await params;

  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    notFound();
  }

  const auth = await createClient();

  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser();

  if (authError || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F4F1E9] px-5 text-[#181818]">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold">
            Sign in to access your artwork.
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#625D55]">
            Use the account that placed this order, then
            reopen this page.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-[#F58220] px-5 text-sm font-semibold"
          >
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, order_number, status")
    .eq("id", id)
    .eq("customer_id", user.id)
    .maybeSingle();

  if (orderError) throw new Error("Unable to load your order.");
  if (!order) notFound();

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_name")
    .eq("order_id", order.id)
    .eq("artwork_type", "customer-supplied");

  const { data: artworks, error: artworksError } = await supabase
    .from("order_artworks")
    .select("id, order_item_id, status, file_name")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError || artworksError) {
    throw new Error("Unable to load artwork details.");
  }

  const itemNames = new Map(
    (items ?? []).map((item) => [item.id, item.product_name])
  );

  const customerArtworks = (artworks ?? []).filter(
    (artwork) => itemNames.has(artwork.order_item_id)
  );

  const uploadsOpen = [
    "submitted",
    "under-review",
    "awaiting-artwork",
  ].includes(order.status);

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

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[#625D55] hover:text-[#181818]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to shop
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#625D55]">
          Order artwork
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
          Send your artwork.
        </h1>

        <p className="mt-3 break-all text-sm font-medium">
          {order.order_number}
        </p>

        <p className="mt-4 text-sm leading-7 text-[#625D55]">
          Attach the finished design for each item below.
          We’ll review it before production begins.
        </p>

        <div className="mt-8 space-y-5">
          {customerArtworks.length === 0 ? (
            <p className="rounded-2xl border border-black/10 bg-white p-6 text-sm leading-7 text-[#625D55]">
              No customer artwork uploads are available for this order.
            </p>
          ) : (
            customerArtworks.map((artwork) => {
              const canUpload =
                uploadsOpen &&
                ["pending", "revision-required"].includes(artwork.status);

              return (
                <section
                  key={artwork.id}
                  className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold">
                      {itemNames.get(artwork.order_item_id)}
                    </h2>

                    <span className="rounded-full bg-[#F58220]/10 px-3 py-1 text-xs font-medium capitalize">
                      {artwork.status.replaceAll("-", " ")}
                    </span>
                  </div>

                  {artwork.file_name && (
                    <p className="mt-3 break-all text-sm text-[#625D55]">
                      File: {artwork.file_name}
                    </p>
                  )}

                  {canUpload ? (
                    <ArtworkUpload
                      orderId={order.id}
                      artworkId={artwork.id}
                    />
                  ) : (
                    <p className="mt-4 text-sm leading-7 text-[#625D55]">
                      {artwork.status === "uploaded"
                        ? "Your file has been received and is awaiting review."
                        : artwork.status === "approved"
                          ? "Your artwork has been approved."
                          : artwork.status === "reviewing"
                            ? "Your artwork is being reviewed."
                            : "Uploads are currently closed for this artwork."}
                    </p>
                  )}
                </section>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}