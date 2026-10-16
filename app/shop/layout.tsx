import type { ReactNode } from "react";

import ShopSideNav from "@/app/components/newjersey/ShopSideNav";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <ShopSideNav />
    </>
  );
}