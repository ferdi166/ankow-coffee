import { Banknote, ClipboardList, Coffee, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrdersWithItems } from "@/validations/orders-validation";

type MetricCardsProps = {
  orders: OrdersWithItems[];
  monthlyRevenue: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MetricCards({
  orders,
  monthlyRevenue,
}: MetricCardsProps) {
  const totalRevenue = orders.reduce(
    (total, order) => total + order.total_amount,
    0,
  );

  const totalItems = orders.reduce(
    (total, order) =>
      total +
      order.order_items.reduce(
        (itemTotal, item) => itemTotal + item.quantity,
        0,
      ),
    0,
  );

  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  const metrics = [
    {
      title: "Total Omzet Hari Ini",
      value: formatCurrency(totalRevenue),
      description: `${orders.length} transaksi`,
      icon: Banknote,
    },
    {
      title: "Omzet Bulan Ini",
      value: formatCurrency(monthlyRevenue),
      description: "Total penjualan bulan berjalan",
      icon: Banknote,
    },
    {
      title: "Total Pesanan",
      value: `${orders.length} Pesanan`,
      description: `${totalItems} item terjual`,
      icon: ClipboardList,
    },
    {
      title: "Rata-rata Transaksi",
      value: formatCurrency(averageOrderValue),
      description: "Nilai rata-rata pesanan",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>

              <Icon className="size-4 text-primary" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>

              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
