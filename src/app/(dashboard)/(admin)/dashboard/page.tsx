import { createClient } from "@/lib/supabase/server";
import { OrdersWithItemsSchema } from "@/validations/orders-validation";
import Dashboard from "./_components/dashboard";

export const metadata = {
  title: "Dashboard | Ankow Coffee",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      table_id,
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
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: false });

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const startOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1,
  );

  const { data: monthlyOrders, error: monthlyOrdersError } = await supabase
    .from("orders")
    .select("total_amount")
    .gte("created_at", startOfMonth.toISOString())
    .lt("created_at", startOfNextMonth.toISOString());

  if (monthlyOrdersError) {
    throw new Error(
      `Gagal mengambil omzet bulanan: ${monthlyOrdersError.message}`,
    );
  }

  const monthlyRevenue = (monthlyOrders ?? []).reduce(
    (total, order) => total + order.total_amount,
    0,
  );

  const chartStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

  const chartEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const { data: chartOrders, error: chartError } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .gte("created_at", chartStartDate.toISOString())
    .lt("created_at", chartEndDate.toISOString());

  if (chartError) {
    throw new Error(
      `Gagal mengambil data grafik bulanan: ${chartError.message}`,
    );
  }

  const monthlyTotals = new Map<string, number>();

  (chartOrders ?? []).forEach((order) => {
    const date = new Date(order.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    monthlyTotals.set(key, (monthlyTotals.get(key) ?? 0) + order.total_amount);
  });

  const monthlySales = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - 5 + index, 1);

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    return {
      month: date.toLocaleDateString("id-ID", {
        month: "short",
      }),
      amount: monthlyTotals.get(key) ?? 0,
    };
  });

  if (error) {
    throw new Error(`Gagal mengambil data dashboard: ${error.message}`);
  }

  const orders = OrdersWithItemsSchema.array().parse(data ?? []);

  return (
    <Dashboard
      orders={orders}
      monthlyRevenue={monthlyRevenue}
      monthlySales={monthlySales}
    />
  );
}
