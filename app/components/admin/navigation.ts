import {
  Mail,
  Boxes,
  ClipboardList,
  FileImage,
  Landmark,
  MessageCircle,
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
    group: "Overview",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "All products",
    href: "/admin/products",
    icon: ShoppingBag,
    group: "Catalogue",
    roles: ["owner", "admin"],
  },
  {
    name: "Print & branding",
    href: "/admin/catalogue",
    icon: ShoppingBag,
    group: "Catalogue",
    roles: ["owner", "admin"],
  },
  {
    name: "Catalogue enquiries",
    href: "/admin/catalogue/enquiries",
    icon: ClipboardList,
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
    name: "Design requests",
    href: "/admin/design",
    icon: FileImage,
    group: "Creative",
    roles: ["owner", "admin"],
  },
  {
    name: "Support inbox",
    href: "/admin/support",
    icon: MessageCircle,
    group: "Orders",
    roles: ["owner", "admin"],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ClipboardList,
    group: "Orders",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Customer artwork",
    href: "/admin/artworks",
    icon: FileImage,
    group: "Creative",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Payments",
    href: "/admin/payments",
    icon: Landmark,
    group: "Orders",
    roles: ["owner", "admin"],
  },
  {
    name: "Production",
    href: "/admin/production",
    icon: Boxes,
    group: "Orders",
    roles: ["owner", "admin", "production"],
  },
  {
    name: "Delivery",
    href: "/admin/delivery",
    icon: Truck,
    group: "Orders",
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
    name: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    group: "Settings",
    roles: ["owner", "admin"],
  },
  {
    name: "General",
    href: "/admin/settings",
    icon: Settings,
    group: "Settings",
    roles: ["owner", "admin"],
  },
];
export function navigationFor(role: AdminRole) {
  return adminNavigation.filter((item) => item.roles.includes(role));
}

export const adminGroups = [
  {
    name: "Catalogue",
    icon: ShoppingBag,
    description: "Products and selling options",
  },
  {
    name: "Orders",
    icon: ClipboardList,
    description: "Payments, production and delivery",
  },
  {
    name: "Creative",
    icon: FileImage,
    description: "Design requests and customer files",
  },
  { name: "Settings", icon: Settings, description: "Store configuration" },
] as const;
