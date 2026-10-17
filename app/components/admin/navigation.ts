import {
  Boxes,
  ClipboardList,
  FileImage,
  Landmark,
  LayoutDashboard,
  Settings,
  Shirt,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { AdminRole } from "@/app/lib/newjersey/auth/admin";

// Only implemented routes belong here. Page/action guards enforce access too.
export const adminNavigation = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    group: "Workspace",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
    group: "Catalogue",
    roles: ["owner", "admin"],
  },
  {
    name: "Apparel",
    href: "/admin/apparel",
    icon: Shirt,
    group: "Catalogue",
    roles: ["owner", "admin"],
  },
  {
    name: "Jerseys",
    href: "/admin/jerseys",
    icon: Shirt,
    group: "Catalogue",
    roles: ["owner", "admin"],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
    group: "Operations",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Artwork",
    href: "/admin/artworks",
    icon: FileImage,
    group: "Operations",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: Landmark,
    group: "Operations",
    roles: ["owner", "admin"],
  },
  {
    name: "Production",
    href: "/admin/production",
    icon: Boxes,
    group: "Operations",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
    group: "Operations",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Payment settings",
    href: "/admin/settings/payments",
    icon: Landmark,
    group: "Settings",
    roles: ["owner", "admin"],
  },
  {
    name: "Store settings",
    href: "/admin/settings",
    icon: Settings,
    group: "Settings",
    roles: ["owner", "admin"],
  },
];
export function navigationFor(role: AdminRole) {
  return adminNavigation.filter((item) => item.roles.includes(role));
}
