import PageTitle from "@/components/common/page-title";
import type { OrdersWithItems } from "@/validations/orders-validation";
import MetricCards from "./metric-cards";
import DailySalesChart from "./daily-sales-chart";
import MonthlySalesChart from "./monthly-sales-chart";

type MonthlySale = {
  month: string;
  amount: number;
};

type DashboardProps = {
  orders: OrdersWithItems[];
  monthlyRevenue: number;
  monthlySales: MonthlySale[];
};

export default function Dashboard({
  orders,
  monthlyRevenue,
  monthlySales,
}: DashboardProps) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-4">
      <PageTitle
        title="Ringkasan Operasional Kafe"
        description="Pantau performa omzet dan transaksi kedai secara realtime."
      />

      <MetricCards orders={orders} monthlyRevenue={monthlyRevenue} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DailySalesChart orders={orders} />

        <MonthlySalesChart monthlySales={monthlySales} />
      </div>
    </div>
  );
}
