import type { MetadataRoute } from "next";

import {
  loadApparel,
  loadDepartment,
} from "@/app/lib/newjersey/storefront/load";
import { productHref } from "@/app/lib/newjersey/storefront/catalogue";

export const dynamic = "force-dynamic";

const SITE_URL = "https://newjersey.ng";

const publicRoutes = [
  "/",
  "/about",
  "/contact",
  "/products",
  "/apparel",
  "/branding",
  "/business-stationery",
  "/print",
  "/shop",
  "/shop/jerseys",
  "/hire-a-designer",
  "/training",
  "/payment-options",
  "/print-guidelines",
  "/shipping",
  "/returns",
  "/privacy-policy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [apparel, prints, branding] = await Promise.all([
    loadApparel(),
    loadDepartment("print"),
    loadDepartment("branding"),
  ]);

  const productRoutes = [...apparel, ...prints, ...branding]
    .filter((product) => Boolean(product.slug?.trim()))
    .map((product) => productHref(product));

  const routes = [...new Set([...publicRoutes, ...productRoutes])];

  return routes.map((route) => ({
    url: new URL(route, SITE_URL).toString(),
  }));
}