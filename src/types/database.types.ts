import { UserRole } from "@/constants/user-roles";

export type OrderType = "Dine In" | "Takeaway";
export type OrderStatus =
  | "diterima"
  | "diproses"
  | "siap"
  | "selesai"
  | "dibatalkan";
export type PaymentStatus = "UNPAID" | "PAID" | "VOID";

export interface ProfileUser {
  id: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileCafe {
  id: string;
  cafe_name: string;
  tagline: string | null;
  description: string | null;
  address: string | null;
  google_maps_url: string | null;
  phone_number: string | null;
  open_time: string | null;
  close_time: string | null;
  wifi_speed: string | null;
  total_outlets: string | null;
  rating_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  category_tag: string;
  capacity_text: string;
  features: string[];
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface TableQR {
  id: string;
  table_number: string;
  area_zone: string;
  qr_code_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface MenuItem {
  id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  badge_label: string | null;
  is_available: boolean;
  station: "Barista" | "Kitchen";
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_code: string;
  table_number: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  notes: string | null;
  selected_modifiers: any[];
  is_item_ready: boolean;
}
