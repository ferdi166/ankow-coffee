import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Clock } from "lucide-react";
import { OrdersWithItems } from "@/validations/orders-validation";

type Props = {
  order: OrdersWithItems;
};

export function KdsOrderCard({ order }: Props) {
  const location =
    order.order_type === "Takeaway"
      ? "Takeaway"
      : `Meja ${order.tables?.table_number ?? "-"}`;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="h-1 bg-blue-600" />

      <CardHeader className="px-6 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold">{location}</h3>
            <p className="text-xs text-muted-foreground">
              #{order.order_number}
            </p>
          </div>

          <Badge variant="outline">
            <Clock className="mr-1 size-3" />
            {new Date(order.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-6 py-4">
        <div className="space-y-2 border-t pt-3">
          {order.order_items.map((item) => (
            <label key={item.id} className="flex items-start gap-2">
              {/* <Checkbox className="mt-0.5" /> */}
              <span className="text-sm font-medium">
                {item.quantity}x {item.menu_items.name}
                {item.notes && (
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Catatan: {item.notes}
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>

        {order.notes && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
            Catatan: {order.notes}
          </div>
        )}

        <Button className="w-full">
          <ArrowRight />
          {order.order_status === "received" && "Mulai Memasak"}
          {order.order_status === "in_progress" && "Siap Diantar"}
          {order.order_status === "ready" && "Konfirmasi Selesai"}
          {order.order_status === "completed" && "Selesai"}
        </Button>
      </CardContent>
    </Card>
  );
}
