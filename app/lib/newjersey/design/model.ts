export const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const field =
  "mt-2 block min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base";
export const button =
  "inline-flex min-h-12 items-center justify-center rounded-full bg-[#FF6B00] px-6 text-sm font-semibold text-[#181818] disabled:opacity-50";
export function designStatus(status: string) {
  return (
    (
      {
        "under-review": "Under review",
        "awaiting-payment": "Awaiting payment",
        confirmed: "In design",
        "in-production": "In design",
        completed: "Ready",
      } as Record<string, string>
    )[status] ?? status
  );
}
export function naira(value: unknown) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(Number(value));
}
