import { notFound } from "next/navigation";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { JERSEY_FIELDS, type JerseyRow } from "@/app/lib/newjersey/jerseys/catalogue";
import JerseyEditor from "../JerseyEditor";
export const dynamic = "force-dynamic";
export default async function EditJerseyPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireStoreAdmin();
  const { id } = await params;
  if (!/^[1-9]\d{0,18}$/.test(id) || BigInt(id) > 9223372036854775807n) notFound();
  const { data, error } = await getSupabaseAdmin().from("products").select(JERSEY_FIELDS).eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load this jersey.");
  if (!data) notFound();
  const query = await searchParams;
  return <JerseyEditor product={data as unknown as JerseyRow} error={typeof query.error === "string" ? query.error : undefined} saved={query.saved === "1"} />;
}
