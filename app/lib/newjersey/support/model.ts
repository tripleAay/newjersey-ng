export type SupportMessage = {
  id: string;
  sender_role: "customer" | "admin";
  body: string;
  created_at: string;
};
export type SupportThread = {
  id: string;
  customer_id: string;
  customer_name: string;
  status: "open" | "closed";
  updated_at: string;
  customer_read_at: string | null;
  admin_read_at: string | null;
  last_customer_at: string | null;
  last_admin_at: string | null;
};
export type SupportPayload = {
  viewerId: string;
  thread: SupportThread | null;
  messages: SupportMessage[];
  hasOlder: boolean;
  cursor: string | null;
};
export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function messageText(value: unknown): string {
  if (
    typeof value !== "string" ||
    value.length > 3000 ||
    !value.trim() ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)
  )
    throw new Error("Write a message of 1 to 3,000 characters.");
  return value.trim();
}
export function parseCursor(value: string | null) {
  if (!value) return null;
  const [date, id, ...rest] = value.split("|");
  if (
    rest.length ||
    !UUID.test(id ?? "") ||
    !date ||
    !Number.isFinite(Date.parse(date))
  )
    throw new Error("Invalid page reference.");
  return { date: new Date(date).toISOString(), id };
}
export function mergeMessages(
  current: SupportMessage[],
  incoming: SupportMessage[],
) {
  return Array.from(
    new Map([...current, ...incoming].map((item) => [item.id, item])).values(),
  ).sort(
    (a, b) =>
      a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id),
  );
}
