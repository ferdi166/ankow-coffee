import {
  ClipboardList,
  Images,
  LayoutDashboard,
  QrCode,
  SquareMenu,
  Store,
  Users,
} from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profil Kafe",
      url: "/profile-cafe",
      icon: Store,
    },
    {
      title: "Galeri Spot",
      url: "/galeri-spot",
      icon: Images,
    },
    {
      title: "Menu & Stok",
      url: "/menu",
      icon: SquareMenu,
    },
    {
      title: "Meja & QR Code",
      url: "/meja",
      icon: QrCode,
    },
    {
      title: "Pesanan",
      url: "/pesanan",
      icon: ClipboardList,
    },
    {
      title: "User & Staff",
      url: "/users",
      icon: Users,
    },
  ],
  kitchen: [
    {
      title: "Pesanan Dapur",
      url: "/pesanan-dapur",
      icon: ClipboardList,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
