import { loadApparel } from "@/app/lib/newjersey/storefront/load";
import ProductGrid from "./storefront/ProductGrid";
export default async function ApparelTileGrid({ limit }: { limit?: number }) {
  const products = await loadApparel();
  return (
    <ProductGrid
      products={limit ? products.slice(0, limit) : products}
      department="apparel"
      preview={!!limit}
    />
  );
}
