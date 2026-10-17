import { OrdersWithItems } from "@/validations/orders-validation";
import { KdsColumn } from "./kds-column";

const columns = [
  { status: "received", title: "Pesanan Masuk" },
  { status: "in_progress", title: "Diproses" },
  { status: "ready", title: "Siap Diantar" },
  { status: "completed", title: "Selesai" },
] as const;

export function KdsBoard({ orders }: { orders: OrdersWithItems[] }) {
  return (
    <div className="grid min-w-[1100px] grid-cols-4 gap-4">
      {columns.map((column) => (
        <KdsColumn
          key={column.status}
          title={column.title}
          orders={orders.filter(
            (order) => order.order_status === column.status,
          )}
        />
      ))}
    </div>
  );
}
