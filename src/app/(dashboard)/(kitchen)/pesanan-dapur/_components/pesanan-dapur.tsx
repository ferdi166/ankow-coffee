"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { OrdersWithItems } from "@/validations/orders-validation";
import { KdsOrderCard } from "./kds-order-card";
import PageTitle from "@/components/common/page-title";

type KitchenOrderStatus =
  | "received"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

const columns = [
  {
    status: "received" satisfies KitchenOrderStatus,
    title: "Pesanan Masuk",
    color: "blue",
  },
  {
    status: "in_progress" satisfies KitchenOrderStatus,
    title: "Diproses",
    color: "amber",
  },
  {
    status: "ready" satisfies KitchenOrderStatus,
    title: "Siap Diantar",
    color: "emerald",
  },
  {
    status: "completed" satisfies KitchenOrderStatus,
    title: "Selesai",
    color: "slate",
  },
] as const;

export default function PesananDapur() {
  const supabase = createClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["kitchen-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          customer_name,
          order_type,
          total_amount,
          received_amount,
          change_amount,
          order_status,
          payment_status,
          payment_method,
          notes,
          created_at,
          tables!orders_table_id_fkey (
            id,
            table_number,
            area_zone
          ),
          order_items!order_items_order_id_fkey (
            id,
            quantity,
            unit_price,
            subtotal,
            notes,
            menu_items!order_items_menu_item_id_fkey (
              id,
              name
            )
          )
        `,
        )
        .order("created_at", { ascending: true })
        .overrideTypes<OrdersWithItems[], { merge: false }>();

      if (error) throw error;

      return data;
    },
  });

  return (
    <div className="p-4 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      <PageTitle
        title="Kitchen Display System"
        description="Pantau dan proses pesanan dapur."
      />

      <div className="grid grid-cols-4 gap-4 overflow-x-auto">
        {columns.map((column) => {
          const columnOrders = orders.filter(
            (order) => order.order_status === column.status,
          );

          return (
            <section key={column.status} className="min-w-0">
              <div className="mb-3 flex items-center justify-between rounded-lg border bg-muted/40 p-3">
                <h2 className="font-semibold">{column.title}</h2>
                <span className="rounded-md bg-background px-2 py-1 text-xs font-bold">
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <KdsOrderCard key={order.id} order={order} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
