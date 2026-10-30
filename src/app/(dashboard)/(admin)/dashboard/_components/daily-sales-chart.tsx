"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  const peakHour = hourlySales.reduce((highest, current) =>
    current.amount > highest.amount ? current : highest,
  );

  const totalRevenue = hourlySales.reduce(
    (total, sale) => total + sale.amount,
    0,
  );

  return (
    <Card>
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

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={hourlySales}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 8,
              }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />

              <YAxis
                width={38}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${Number(value) / 1000}k`}
              />

              <Tooltip
                cursor={{ fill: "var(--color-muted)" }}
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Jam ${label}`}
              />

              <Bar
                dataKey="amount"
                name="Omzet"
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Total omzet hari ini</span>

          <span className="font-semibold text-foreground">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
