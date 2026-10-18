import { notFound } from "next/navigation";
import { loadStoreProduct } from "@/app/lib/newjersey/storefront/load";
import StoreDetail from "@/app/components/newjersey/storefront/StoreDetail";
export const dynamic = "force-dynamic";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await loadStoreProduct("print", slug);
  if (!product) notFound();
  return <StoreDetail product={product} />;
}
