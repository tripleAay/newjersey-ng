export type DocumentKind = "summary" | "invoice" | "receipt" | "design";
export type OrderRecord = {
  id: string;
  customer_id: string;
  order_number: string;
  project_name: string | null;
  status: string;
  customer_full_name: string;
  customer_email: string;
  customer_phone: string;
  customer_organization: string | null;
  delivery_method: string;
  delivery_state: string | null;
  delivery_city: string | null;
  delivery_address: string | null;
  subtotal: string | number;
  design_fee: string | number;
  delivery_fee: string | number | null;
  final_total: string | number | null;
  production_instructions: string | null;
  preferred_deadline: string | null;
  created_at: string;
  design_service: boolean;
};
export type PaymentRecord = {
  id: string;
  order_id: string;
  customer_id: string;
  reference: string;
  amount: string | number;
  currency: string;
  status: string;
  method: string;
  reviewed_at: string | null;
  created_at: string;
  transfer_reference: string | null;
};
export type ItemRecord = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  design_fee: string | number;
  selections: unknown;
};
export type DesignRecord = {
  designer: string;
  project_type: string;
  brief: string;
  scope: string | null;
  due_date: string | null;
  included_revisions: number;
  revisions_used: number;
  revision_notes: string | null;
  updated_at: string;
};
export type DocumentData = {
  order: OrderRecord;
  items: ItemRecord[];
  payment: PaymentRecord | null;
  design: DesignRecord | null;
  generatedAt: string;
};
export const kinds: DocumentKind[] = [
  "summary",
  "invoice",
  "receipt",
  "design",
];
export const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function minor(value: unknown): number | null {
  if (
    (typeof value !== "number" && typeof value !== "string") ||
    String(value).trim() === ""
  )
    return null;
  const amount = Number(value);
  return Number.isFinite(amount) &&
    amount >= 0 &&
    Number.isSafeInteger(Math.round(amount * 100))
    ? Math.round(amount * 100)
    : null;
}
export function invoiceAvailable(order: OrderRecord) {
  const total = minor(order.final_total);
  return (
    total !== null &&
    total > 0 &&
    !["cancelled", "canceled", "refunded"].includes(order.status)
  );
}
export function matchingPayment(order: OrderRecord, p: PaymentRecord) {
  return (
    invoiceAvailable(order) &&
    p.order_id === order.id &&
    p.customer_id === order.customer_id &&
    p.currency === "NGN" &&
    p.status === "verified" &&
    minor(p.amount) === minor(order.final_total)
  );
}
export function consistentTotals(order: OrderRecord) {
  const parts = [
    minor(order.subtotal),
    minor(order.design_fee),
    minor(order.delivery_fee),
  ];
  return (
    parts.every((p) => p !== null) &&
    parts.reduce<number>((sum, p) => sum + (p ?? 0), 0) ===
      minor(order.final_total)
  );
}

export function consistentItems(order: OrderRecord, items: ItemRecord[]) {
  if (!items.length) return false;
  let subtotal = 0,
    fees = 0;
  for (const item of items) {
    const unit = minor(item.unit_price),
      line = minor(item.total_price),
      fee = minor(item.design_fee);
    if (
      unit === null ||
      line === null ||
      fee === null ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      unit * item.quantity !== line
    )
      return false;
    subtotal += line;
    fees += fee;
  }
  return subtotal === minor(order.subtotal) && fees === minor(order.design_fee);
}
