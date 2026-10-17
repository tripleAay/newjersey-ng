import Link from "next/link";
import ProductImageUpload from "@/app/components/admin/ProductImageUpload";
import { imagesFor, jerseyIssues, type JerseyRow } from "@/app/lib/newjersey/jerseys/catalogue";
import { saveJersey } from "./actions";

const field = "mt-2 min-h-12 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#F58220]";
const section = "rounded-2xl border border-black/10 bg-white p-5 sm:p-7";

export default function JerseyEditor({ product, error, saved }: { product?: JerseyRow; error?: string; saved?: boolean }) {
  const issues = product ? jerseyIssues(product) : [];
  return <main className="mx-auto max-w-5xl p-5 sm:p-8">
    <Link href="/admin/jerseys" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">Back to jerseys</Link>
    <h1 className="mt-5 text-3xl font-semibold tracking-tight">{product ? "Edit jersey" : "Add a jersey"}</h1>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#625D55]">One product represents one team, season and kit. Add its photographs, available sizes and printing charges here.</p>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {saved && <p role="status" className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-800">Jersey saved. {issues.length ? `Not visible in the shop: ${issues.join("; ")}.` : "Visible in the jersey shop."}</p>}
    <form action={saveJersey} className="mt-7 space-y-6">
      <input type="hidden" name="product_id" value={product ? String(product.id) : ""} />
      <input type="hidden" name="expected_updated_at" value={product?.updated_at ?? ""} />
      <section className={section}>
        <h2 className="text-lg font-semibold">Jersey details</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium sm:col-span-2">Product name<input name="name" required maxLength={160} defaultValue={product?.name ?? ""} placeholder="Arsenal 2026/27 Home Jersey" className={field} /></label>
          <label className="text-sm font-medium sm:col-span-2">Unique URL name<input name="slug" required maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={product?.slug ?? ""} placeholder="arsenal-2026-27-home" className={field} /></label>
          <label className="text-sm font-medium">Team<input name="team" required maxLength={100} defaultValue={product?.jersey_team ?? ""} placeholder="Arsenal" className={field} /></label>
          <label className="text-sm font-medium">Season<input name="season" required maxLength={40} defaultValue={product?.jersey_season ?? ""} placeholder="2026/27" className={field} /></label>
          <label className="text-sm font-medium">Kit<select name="kit" defaultValue={product?.jersey_kit ?? "home"} className={field}><option value="home">Home</option><option value="away">Away</option><option value="third">Third</option></select></label>
          <label className="text-sm font-medium">Available sizes<input name="sizes" required maxLength={200} defaultValue={(product?.jersey_sizes ?? ["S", "M", "L", "XL", "XXL"]).join(", ")} className={field} /><span className="mt-2 block text-xs font-normal text-[#625D55]">Separate sizes with commas. Only list sizes you can supply.</span></label>
          <label className="text-sm font-medium sm:col-span-2">Description<textarea name="description" rows={4} maxLength={10000} defaultValue={product?.description ?? ""} placeholder="Fit, material, what is included and any important details." className={field} /></label>
        </div>
      </section>
      <section className={section}><h2 className="mb-5 text-lg font-semibold">Photographs</h2><ProductImageUpload key={product?.updated_at ?? "new"} initialImages={product ? imagesFor(product) : []} /></section>
      <section className={section}>
        <h2 className="text-lg font-semibold">Pricing per jersey</h2>
        <p className="mt-2 text-sm leading-6 text-[#625D55]">Name and number charges are separate. Enter 0 when included; leave a personalisation charge blank to disable that option.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <label className="text-sm font-medium">Jersey (NGN)<input name="price" type="number" min="0.01" max="99999999.99" step="0.01" required defaultValue={product?.price ?? ""} className={field} /></label>
          <label className="text-sm font-medium">Printed name (NGN)<input name="name_fee" type="number" min="0" max="99999999.99" step="0.01" defaultValue={product?.jersey_name_fee ?? ""} className={field} /></label>
          <label className="text-sm font-medium">Printed number (NGN)<input name="number_fee" type="number" min="0" max="99999999.99" step="0.01" defaultValue={product?.jersey_number_fee ?? ""} className={field} /></label>
        </div>
      </section>
      <section className={section}>
        <h2 className="text-lg font-semibold">Availability and publishing</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">Fulfillment<select name="fulfillment_type" defaultValue={product?.fulfillment_type ?? "made_to_order"} className={field}><option value="made_to_order">Made to order</option><option value="in_stock">In stock</option><option value="preorder">Preorder</option></select></label>
          <label className="text-sm font-medium">Publication<select name="publication_status" defaultValue={product?.publication_status ?? "draft"} className={field}><option value="draft">Draft</option><option value="published">Published</option></select></label>
          <label className="flex min-h-11 items-center gap-3 text-sm"><input name="enabled" type="checkbox" defaultChecked={product?.jersey_enabled ?? true} className="h-5 w-5" />Enable jersey sales</label>
          <label className="flex min-h-11 items-center gap-3 text-sm"><input name="featured" type="checkbox" defaultChecked={product?.featured ?? false} className="h-5 w-5" />Feature this product</label>
        </div>
        <p className="mt-4 text-xs leading-6 text-[#625D55]">A published jersey needs at least one image. Turning off jersey sales hides it from the jersey form without changing existing orders.</p>
      </section>
      <div className="flex flex-wrap gap-4"><button type="submit" className="min-h-12 rounded-full bg-[#181818] px-7 text-sm font-semibold text-white">Save jersey</button><Link href="/shop/jerseys" className="inline-flex min-h-12 items-center px-3 text-sm underline">View jersey shop</Link></div>
    </form>
  </main>;
}
