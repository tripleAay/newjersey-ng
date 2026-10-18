import { FileDown } from "lucide-react";
import { loadDocument } from "@/app/lib/newjersey/documents/load";
import {
  invoiceAvailable,
  consistentTotals,
  type DocumentKind,
} from "@/app/lib/newjersey/documents/model";
export default async function DocumentDownloads({
  orderId,
}: {
  orderId: string;
}) {
  let data;
  try {
    data = await loadDocument(orderId, "summary");
  } catch {
    return (
      <p className="my-5 text-xs text-[#625D55]">
        PDF downloads are temporarily unavailable. Refresh this page to try
        again.
      </p>
    );
  }
  const links: { kind: DocumentKind; label: string }[] = [
    { kind: "summary", label: "Order summary" },
  ];
  if (invoiceAvailable(data.order) && consistentTotals(data.order))
    links.push({ kind: "invoice", label: "Invoice" });
  // Receipt eligibility is checked again by the download route; do not rely on button visibility.
  let receipt = false;
  if (invoiceAvailable(data.order))
    try {
      await loadDocument(orderId, "receipt");
      receipt = true;
    } catch {
      /* Unverified payments never expose a receipt link. */
    }
  if (receipt) links.push({ kind: "receipt", label: "Payment receipt" });
  if (data.order.design_service && data.design)
    links.push({ kind: "design", label: "Design summary" });
  return (
    <section
      aria-label="Download your documents"
      className="my-6 rounded-xl border border-black/10 bg-white p-4"
    >
      <p className="text-xs font-semibold text-[#625D55]">Your documents</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <a
            key={link.kind}
            href={`/api/order-documents/${orderId}/${link.kind}`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/15 px-4 text-xs font-medium text-[#FF6B00] transition-colors hover:bg-[#F0EFEB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00]"
          >
            <FileDown size={15} aria-hidden="true" />
            {link.label}
            <span className="sr-only"> (PDF download)</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#625D55]">
        Invoices appear after pricing is confirmed. Payment receipts appear
        after verification.
      </p>
    </section>
  );
}
