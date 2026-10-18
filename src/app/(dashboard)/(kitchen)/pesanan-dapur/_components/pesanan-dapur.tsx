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

const columnStyles = {
  blue: {
    header: "border-blue-200 bg-blue-50",
    title: "text-blue-900",
    count: "bg-blue-600 text-white",
  },
  amber: {
    header: "border-amber-200 bg-amber-50",
    title: "text-amber-900",
    count: "bg-amber-600 text-white",
  },
  emerald: {
    header: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    count: "bg-emerald-600 text-white",
  },
  slate: {
    header: "border-slate-200 bg-slate-100",
    title: "text-slate-900",
    count: "bg-slate-600 text-white",
  },
} as const;

export default function PesananDapur() {
  const supabase = createClient();

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
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

          const styles = columnStyles[column.color];

          return (
            <section key={column.status} className="min-w-0">
              <div
                className={`mb-3 flex items-center justify-between rounded-lg border p-3 ${styles.header}`}>
                <h2 className={`font-semibold ${styles.title}`}>
                  {column.title}
                </h2>

                <span
                  className={`rounded-md px-2 py-1 text-xs font-bold ${styles.count}`}>
                  {columnOrders.length}
                </span>
              </div>

              <div className="space-y-3">
                {columnOrders.map((order) => (
                  <KdsOrderCard
                    key={order.id}
                    order={order}
                    color={column.color}
                    onStatusUpdated={refetch}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
