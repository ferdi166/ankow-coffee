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

type MonthlySale = {
  month: string;
  amount: number;
};

type MonthlySalesChartProps = {
  monthlySales: MonthlySale[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MonthlySalesChart({
  monthlySales,
}: MonthlySalesChartProps) {
  const highestMonth = monthlySales.reduce((highest, current) =>
    current.amount > highest.amount ? current : highest,
  );

  const totalRevenue = monthlySales.reduce(
    (total, sale) => total + sale.amount,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Penjualan Bulanan</CardTitle>
        <CardDescription>
          Perbandingan omzet enam bulan terakhir
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
          <span className="font-semibold">Penjualan tertinggi:</span>{" "}
          {highestMonth.amount > 0
            ? `${highestMonth.month} dengan omzet ${formatCurrency(
                highestMonth.amount,
              )}`
            : "Belum ada transaksi"}
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySales}
              margin={{
                top: 8,
                right: 8,
                left: 8,
                bottom: 8,
              }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="month"
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
                labelFormatter={(label) => `Bulan ${label}`}
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
          <span>Total omzet enam bulan</span>

          <span className="font-semibold text-foreground">
            {formatCurrency(totalRevenue)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
