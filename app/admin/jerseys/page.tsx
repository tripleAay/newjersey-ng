import Image from "next/image";
import Link from "next/link";
import { requireStoreAdmin } from "@/app/lib/newjersey/auth/admin";
import { getSupabaseAdmin } from "@/app/lib/newjersey/supabase/admin";
import { JERSEY_FIELDS, imagesFor, jerseyIssues, type JerseyRow } from "@/app/lib/newjersey/jerseys/catalogue";
export const dynamic = "force-dynamic";

export default async function JerseysAdminPage() {
  await requireStoreAdmin();
  const { data, error } = await getSupabaseAdmin().from("products").select(JERSEY_FIELDS).order("created_at", { ascending: false }).limit(500);
  if (error) { console.error("[Jersey catalogue admin]", error); throw new Error("Unable to load jerseys. Check that the jersey migration has been applied."); }
  const rows = (data ?? []) as unknown as JerseyRow[];
  const jerseys = rows.filter(row => row.jersey_enabled || row.jersey_team || row.category === "Jerseys");
  const visible = jerseys.filter(row => !jerseyIssues(row).length).length;
  return <main className="mx-auto max-w-6xl p-5 sm:p-8">
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs font-semibold uppercase tracking-widest text-[#625D55]">Catalogue</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Jerseys</h1><p className="mt-3 text-sm leading-7 text-[#625D55]">{jerseys.length} configured · {visible} visible in the shop. Manage photographs, kits, sizes and printing prices together.</p></div>
      <Link href="/admin/jerseys/new" className="inline-flex min-h-12 items-center rounded-full bg-[#181818] px-6 text-sm font-semibold text-white">Add jersey</Link>
    </div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {jerseys.map(row => { const images = imagesFor(row); const issues = jerseyIssues(row); return <article key={String(row.id)} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
        <div className="relative aspect-[4/3] bg-[#F0EFEB]">{images[0] ? <Image src={images[0]} alt={row.name} fill unoptimized sizes="(max-width: 640px) 100vw, 400px" className="object-contain p-4" /> : <p className="flex h-full items-center justify-center text-sm text-[#625D55]">No image yet</p>}</div>
        <div className="p-5"><h2 className="font-semibold">{row.name}</h2><p className="mt-2 text-xs capitalize text-[#625D55]">{[row.jersey_team, row.jersey_season, row.jersey_kit].filter(Boolean).join(" · ")}</p><p className={`mt-4 text-xs leading-6 ${issues.length ? "text-amber-800" : "text-green-800"}`}>{issues.length ? `Not visible: ${issues.join("; ")}` : "Visible in the jersey shop"}</p><Link href={`/admin/jerseys/${row.id}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">Edit jersey</Link></div>
      </article>; })}
    </div>
    {!jerseys.length && <section className="mt-7 rounded-2xl border border-dashed border-black/20 p-8"><h2 className="text-lg font-semibold">Add your first jersey</h2><p className="mt-3 max-w-xl text-sm leading-7 text-[#625D55]">Upload photographs and enter the team, season, kit and prices. You can save a draft before publishing.</p></section>}
    <details className="mt-8 rounded-xl border border-black/10 bg-white p-5"><summary className="cursor-pointer text-sm font-semibold">Use an existing product as a jersey</summary><p className="mt-3 text-xs leading-6 text-[#625D55]">Choose only a product that represents a jersey. Saving converts its category and pricing to jersey settings.</p><div className="mt-3 flex flex-col items-start">{rows.filter(row => !jerseys.includes(row)).map(row => <Link key={String(row.id)} href={`/admin/jerseys/${row.id}`} className="inline-flex min-h-11 items-center text-sm underline">{row.name}</Link>)}</div></details>
    <Link href="/shop/jerseys" className="mt-6 inline-flex min-h-11 items-center text-sm underline">View jersey shop</Link>
  </main>;
}
