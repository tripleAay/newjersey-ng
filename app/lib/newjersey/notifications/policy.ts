export type SoundEvent = { id: string; title: string; created_at: string; read_at: string | null; category?: string };
export function freshSoundEvents(items: SoundEvent[], seen: Set<string> | null, scope: "customer" | "admin", now: number): SoundEvent[] {
 if (!seen) return [];
 return items.filter(item => {
  const age = now - Date.parse(item.created_at);
  const important = scope === "admin" ? ["order", "payment", "design"].includes(item.category ?? "") : /payment.*verified|verified.*payment|order.*ready|design.*ready|new.*(?:message|reply)/i.test(item.title);
  return !seen.has(item.id) && item.read_at === null && Number.isFinite(age) && age >= -5000 && age < 60000 && important;
 });
}
