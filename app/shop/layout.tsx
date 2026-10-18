import type { ReactNode } from "react";

import ShopExperience from "@/app/components/newjersey/experience/ShopExperience";
import ShopSideNav from "@/app/components/newjersey/ShopSideNav";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ShopSideNav />
      <ShopExperience />
    </>
  );
}
