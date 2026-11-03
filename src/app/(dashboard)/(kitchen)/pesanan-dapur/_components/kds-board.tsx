import { OrdersWithItems } from "@/validations/orders-validation";
import { KdsColumn } from "./kds-column";

const columns = [
  { status: "received", title: "Pesanan Masuk", color: "blue" },
  { status: "in_progress", title: "Diproses", color: "amber" },
  { status: "ready", title: "Siap Diantar", color: "emerald" },
  { status: "completed", title: "Selesai", color: "slate" },
] as const;

type Props = {
  orders: OrdersWithItems[];
  onStatusUpdated: () => void;
};

export function KdsBoard({ orders, onStatusUpdated }: Props) {
  return (
    <div className="grid min-w-[1100px] grid-cols-4 gap-4">
      {columns.map((column) => (
        <KdsColumn
          key={column.status}
          title={column.title}
          color={column.color}
          onStatusUpdated={onStatusUpdated}
          orders={orders.filter(
            (order) => order.order_status === column.status,
          )}
        />
      ))}
    </div>
  );
}
