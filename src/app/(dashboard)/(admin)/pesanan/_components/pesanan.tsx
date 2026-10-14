"use client";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { OrdersWithItems } from "@/validations/orders-validation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import PesananTable from "./pesanan-table";
import DialogTambahPesanan from "./dialog-tambah-pesanan";
import { useCallback, useState } from "react";

export default function Pesanan() {
  const supabase = createClient();
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
            id,
            order_number,
            customer_name,
            order_type,
            total_amount,
            order_status,
            payment_status,
            payment_method,
            created_at,
            tables!orders_table_id_fkey (
            id,
            table_number,
            area_zone
            ),
            order_items!order_items_order_id_fkey (
            id,
            quantity,
            unit_price,
            subtotal,
            notes,
            menu_items!order_items_menu_item_id_fkey (
                id,
                name
            )
            )
        `,
        )
        .overrideTypes<OrdersWithItems[], { merge: false }>();

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const handleCreateSuccess = useCallback(() => {
    setIsCreateDialogOpen(false);
  }, []);

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Pesanan"
          description="Pantau semua transaksi masuk, status pembayaran, dan progres dapur secara real-time."
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                Buat Pesanan Baru
              </Button>
            }
          />
          <DialogTambahPesanan
            refetch={refetch}
            onSuccess={handleCreateSuccess}
          />
        </Dialog>
      </div>

      <PesananTable items={orders ?? []} />
    </div>
  );
}
