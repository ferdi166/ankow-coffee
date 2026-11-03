import { OrdersWithItems } from "@/validations/orders-validation";
import { KdsOrderCard } from "./kds-order-card";

type Props = {
  title: string;
  orders: OrdersWithItems[];
  color: "blue" | "amber" | "emerald" | "slate";
  onStatusUpdated: () => void;
};

export function KdsColumn({ title, orders, color, onStatusUpdated }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <span>{orders.length}</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <KdsOrderCard
            key={order.id}
            color={color}
            order={order}
            onStatusUpdated={onStatusUpdated}
          />
        ))}
      </div>
    </section>
  );
}
