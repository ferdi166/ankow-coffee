import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrdersWithItems } from "@/validations/orders-validation";

type DailySalesChartProps = {
  orders: OrdersWithItems[];
};

type HourlySale = {
  hour: string;
  amount: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getHourlySales(orders: OrdersWithItems[]): HourlySale[] {
  const salesByHour = new Map<number, number>();

  orders.forEach((order) => {
    const orderDate = new Date(order.created_at);
    const hour = orderDate.getHours();

    salesByHour.set(hour, (salesByHour.get(hour) ?? 0) + order.total_amount);
  });

  return Array.from({ length: 15 }, (_, index) => {
    const hour = index + 8;

    return {
      hour: `${String(hour).padStart(2, "0")}:00`,
      amount: salesByHour.get(hour) ?? 0,
    };
  });
}

export default function DailySalesChart({ orders }: DailySalesChartProps) {
  const hourlySales = getHourlySales(orders);
  const maximumSale = Math.max(...hourlySales.map((sale) => sale.amount), 1);

  const peakHour = hourlySales.reduce((highest, current) =>
    current.amount > highest.amount ? current : highest,
  );

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Grafik Penjualan Harian</CardTitle>
        <CardDescription>Tren omzet berdasarkan jam transaksi</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
          <span className="font-semibold">Jam tersibuk:</span>{" "}
          {peakHour.amount > 0
            ? `${peakHour.hour} dengan omzet ${formatCurrency(peakHour.amount)}`
            : "Belum ada transaksi hari ini"}
        </div>

        <div className="flex h-64 items-end gap-2 overflow-x-auto border-b pb-2">
          {hourlySales.map((sale) => {
            const barHeight =
              sale.amount > 0
                ? Math.max((sale.amount / maximumSale) * 100, 8)
                : 2;

            return (
              <div
                key={sale.hour}
                className="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2">
                <div className="group relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary transition-colors group-hover:bg-primary/80"
                    style={{ height: `${barHeight}%` }}
                    title={`${sale.hour}: ${formatCurrency(sale.amount)}`}
                  />
                </div>

                <span className="text-[10px] text-muted-foreground">
                  {sale.hour}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total omzet</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(
              hourlySales.reduce((total, sale) => total + sale.amount, 0),
            )}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
