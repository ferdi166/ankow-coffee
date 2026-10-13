"use client";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Table } from "@/validations/table-validation";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useState } from "react";
import MejaDisplay from "./meja-display";
import DialogTambahMeja from "./dialog-tambah-meja";

export default function Meja() {
  const supabase = createClient();
  const {
    data: tables,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tables")
        .select("id, table_number, area_zone, capacity, qr_code_url, is_active")
        .overrideTypes<Table[], { merge: false }>();

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
          title="Manajemen Meja & QR Code"
          description="Kelola nomor meja, kapasitas tempat duduk, lokasi spot, dan cetak QR Code ordering."
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                Tambah Meja
              </Button>
            }
          />
          <DialogTambahMeja refetch={refetch} onSuccess={handleCreateSuccess} />
        </Dialog>
      </div>
      <MejaDisplay items={tables ?? []} refetch={refetch} />
    </div>
  );
}
