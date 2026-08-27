import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  ShoppingCart,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  Boxes,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Boxes,
    },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Suppliers",
    url: "/suppliers",
    icon: Truck,
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ShoppingCart,
  },
  {
    title: "Purchases",
    url: "/purchases",
    icon: Receipt,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];