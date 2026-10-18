import { PDFDocument, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { documentFont } from "./font";
import { minor, type DocumentData, type DocumentKind } from "./model";
const titles = {
  summary: "Order summary",
  invoice: "Invoice",
  receipt: "Payment receipt",
  design: "Design project summary",
};
const ink = rgb(0.094, 0.094, 0.094),
  muted = rgb(0.39, 0.365, 0.335),
  accent = rgb(1, 107 / 255, 0),
  rule = rgb(0.87, 0.86, 0.84);
export function money(value: unknown) {
  const amount = minor(value);
  return amount === null
    ? "Not confirmed"
    : `NGN ${(amount / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function date(value: string | null) {
  if (!value) return "Not provided";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "Not provided"
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Africa/Lagos",
      });
}
function readableStatus(status: string, design: boolean) {
  if (design)
    return (
      (
        {
          "under-review": "Under review",
          "awaiting-payment": "Awaiting payment",
          confirmed: "In design",
          "in-production": "In design",
          completed: "Ready",
        } as Record<string, string>
      )[status] ?? status.replaceAll("-", " ")
    );
  return status.replaceAll("-", " ");
}
export async function renderDocument(
  kind: DocumentKind,
  data: DocumentData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(Buffer.from(documentFont, "base64"), {
    subset: true,
  });
  pdf.setTitle(`${titles[kind]} | ${data.order.order_number}`);
  pdf.setAuthor("NewJersey.ng");
  pdf.setCreator("NewJersey.ng");
  pdf.setCreationDate(new Date(data.generatedAt));
  const width = 595.28,
    height = 841.89,
    left = 44,
    right = 551.28,
    bodyWidth = right - left;
  let page: PDFPage;
  let y = 0;
  const supported = new Set(font.getCharacterSet());
  const clean = (value: unknown) =>
    String(value ?? "")
      .normalize("NFC")
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
      .replace(/\t/g, "    ");
  // Never silently change a customer name, number or brief if the font lacks a glyph.
  function checked(value: unknown) {
    const s = clean(value);
    if (
      [...s].some(
        (c) => c !== "\n" && c !== "\r" && !supported.has(c.codePointAt(0)!),
      )
    )
      throw new Error(
        "This document contains a character the PDF font cannot display. Please contact support.",
      );
    return s;
  }
  function draw(text: string, x: number, yy: number, size = 10, color = ink) {
    page.drawText(text, { x, y: yy, size, font, color });
  }
  function newPage() {
    page = pdf.addPage([width, height]);
    y = height - 48;
    draw("newjersey.ng", left, y, 19, accent);
    draw(titles[kind], left, y - 25, 10, muted);
    page.drawLine({
      start: { x: left, y: y - 39 },
      end: { x: right, y: y - 39 },
      thickness: 0.6,
      color: rule,
    });
    y -= 65;
  }
  function ensure(h: number) {
    if (y - h < 62) newPage();
  }
  function lines(value: unknown, size: number, maxWidth: number) {
    const text = checked(value).replace(/\r\n?/g, "\n");
    const output: string[] = [];
    for (const paragraph of text.split("\n")) {
      let current = "";
      for (const word of paragraph.split(/ +/)) {
        if (!word) continue;
        const test = current ? current + " " + word : word;
        if (font.widthOfTextAtSize(test, size) <= maxWidth) {
          current = test;
          continue;
        }
        if (current) {
          output.push(current);
          current = "";
        }
        let fragment = "";
        for (const c of word) {
          if (
            fragment &&
            font.widthOfTextAtSize(fragment + c, size) > maxWidth
          ) {
            output.push(fragment);
            fragment = "";
          }
          fragment += c;
        }
        current = fragment;
      }
      output.push(current);
    }
    return output;
  }
  function text(
    value: unknown,
    size = 10,
    color = ink,
    maxWidth = bodyWidth,
    x = left,
  ) {
    for (const line of lines(value, size, maxWidth)) {
      ensure(size + 6);
      if (line) draw(line, x, y, size, color);
      y -= size + 5;
    }
    y -= 4;
  }
  function heading(value: string) {
    ensure(72);
    y -= 11;
    draw(value.toUpperCase(), left, y, 9, accent);
    y -= 21;
  }
  function pair(label: string, value: unknown) {
    const labels = lines(label, 9, 130),
      values = lines(value, 10, bodyWidth - 145);
    for (let i = 0; i < Math.max(labels.length, values.length); i++) {
      ensure(18);
      if (labels[i]) draw(labels[i], left, y, 9, muted);
      if (values[i]) draw(values[i], left + 145, y, 10);
      y -= 16;
    }
    y -= 2;
  }
  function total(label: string, value: unknown, big = false) {
    ensure(35);
    draw(label, left, y, big ? 12 : 10, big ? accent : muted);
    const s = money(value);
    draw(
      s,
      right - font.widthOfTextAtSize(s, big ? 15 : 10),
      y,
      big ? 15 : 10,
      big ? accent : ink,
    );
    y -= big ? 30 : 23;
  }
  const o = data.order;
  newPage();
  text(o.order_number, 16);
  text(o.project_name || "Your NewJersey order", 11);
  pair("Order placed", date(o.created_at));
  pair("Order status", readableStatus(o.status, o.design_service));
  pair("Document generated", date(data.generatedAt));
  heading(kind === "receipt" ? "Received from" : "Customer");
  text(o.customer_full_name, 12);
  if (o.customer_organization) text(o.customer_organization);
  text(o.customer_email, 10, muted);
  text(o.customer_phone, 10, muted);
  if (kind === "receipt") {
    const p = data.payment!;
    heading("Payment verified");
    total("Amount received", p.amount, true);
    pair("Payment reference", p.reference);
    pair(
      "Payment method",
      p.method === "bank-transfer" ? "Bank transfer" : p.method,
    );
    if (p.reviewed_at) pair("Verified on", date(p.reviewed_at));
    if (p.transfer_reference) pair("Transfer reference", p.transfer_reference);
    text(
      "This receipt acknowledges the verified payment recorded against the order above. It is not a bank-issued transfer confirmation.",
      9,
      muted,
    );
    heading("What this payment covers");
    text(o.project_name || "Confirmed order");
  } else if (kind === "design") {
    const d = data.design!;
    heading("Design brief");
    pair("Studio designer", d.designer.toUpperCase());
    pair("Project type", d.project_type);
    text(d.brief);
    heading("Scope and deliverables");
    text(
      d.scope ||
        "Under review. Scope, price and delivery date have not been confirmed.",
    );
    pair("Delivery date", date(d.due_date));
    if (d.scope) {
      pair("Included revisions", String(d.included_revisions));
      pair("Revisions used", String(d.revisions_used));
      total("Confirmed design price", o.final_total, true);
    }
    if (d.revision_notes) {
      heading("Latest revision request");
      text(d.revision_notes);
    }
    text(
      "Digital design files only. Printing and physical delivery are separate. This project summary is not proof of payment.",
      9,
      muted,
    );
  } else {
    heading("Order items");
    if (!data.items.length) text("No item details are recorded.");
    data.items.forEach((item, index) => {
      ensure(65);
      text(`${index + 1}. ${item.product_name}`, 11);
      pair("Quantity", String(item.quantity));
      pair("Unit production price", money(item.unit_price));
      pair("Production line total", money(item.total_price));
      if ((minor(item.design_fee) ?? 0) > 0)
        pair("Design assistance (job)", money(item.design_fee));
      if (Array.isArray(item.selections))
        for (const entry of item.selections) {
          if (entry && typeof entry === "object") {
            const e = entry as Record<string, unknown>;
            const label = String(e.optionLabel ?? "Option");
            const value = e.choiceLabel ?? e.choiceId;
            if (value !== undefined && value !== null)
              pair(label, String(value));
          }
        }
      y -= 6;
    });
    ensure(145);
    heading(kind === "invoice" ? "Confirmed charges" : "Order totals");
    total(
      o.design_service ? "Design service" : "Production subtotal",
      o.subtotal,
    );
    total("Design assistance", o.design_fee);
    total(
      "Delivery",
      o.design_service || o.delivery_method === "pickup" ? 0 : o.delivery_fee,
    );
    if (o.final_total !== null) total("Confirmed total", o.final_total, true);
    else {
      const estimate = (minor(o.subtotal) ?? 0) + (minor(o.design_fee) ?? 0);
      total("Estimated subtotal", estimate / 100, true);
      text(
        "Final pricing and delivery charges are not confirmed. This is not an invoice or proof of payment.",
        9,
        muted,
      );
    }
    if (!o.design_service) {
      heading("Fulfilment");
      if (o.delivery_method === "pickup")
        text(
          "Customer pickup. Collection arrangements are confirmed with your order.",
        );
      else
        text(
          [o.delivery_address, o.delivery_city, o.delivery_state]
            .filter(Boolean)
            .join(", ") || "Delivery address not recorded.",
        );
    }
    if (kind === "summary" && o.production_instructions) {
      heading("Customer instructions");
      text(o.production_instructions);
    }
    if (o.design_service && data.design?.scope) {
      heading("Agreed design scope");
      text(data.design.scope);
      pair("Delivery date", date(data.design.due_date));
      pair("Included revisions", String(data.design.included_revisions));
    }
    if (kind === "invoice") {
      text(
        "This invoice records the confirmed order charges. It is not proof of payment. Use your secure NewJersey payment page for bank details and payment instructions.",
        9,
        muted,
      );
    }
  }
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawLine({
      start: { x: left, y: 43 },
      end: { x: right, y: 43 },
      thickness: 0.5,
      color: rule,
    });
    p.drawText("NewJersey.ng | " + o.order_number, {
      x: left,
      y: 28,
      font,
      size: 8,
      color: muted,
    });
    p.drawText("hello@newjersey.ng | +234 808 957 0493 | Nigeria", {
      x: left,
      y: 15,
      font,
      size: 7,
      color: muted,
    });
    const n = `${i + 1} / ${pages.length}`;
    p.drawText(n, {
      x: right - font.widthOfTextAtSize(n, 8),
      y: 28,
      font,
      size: 8,
      color: muted,
    });
  });
  return pdf.save();
}
