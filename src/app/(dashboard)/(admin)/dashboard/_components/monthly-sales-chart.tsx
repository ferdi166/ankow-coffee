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
  const maximumSale = Math.max(...monthlySales.map((sale) => sale.amount), 1);

  const highestMonth = monthlySales.reduce((highest, current) =>
    current.amount > highest.amount ? current : highest,
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

        <div className="flex h-64 items-end gap-4 border-b pb-2">
          {monthlySales.map((sale) => {
            const barHeight =
              sale.amount > 0
                ? Math.max((sale.amount / maximumSale) * 100, 8)
                : 2;

            return (
              <div
                key={sale.month}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="group relative flex h-full w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-primary transition-colors group-hover:bg-primary/80"
                    style={{ height: `${barHeight}%` }}
                    title={`${sale.month}: ${formatCurrency(sale.amount)}`}
                  />
                </div>

                <span className="text-xs text-muted-foreground">
                  {sale.month}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
