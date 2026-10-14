import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import DialogTambahMeja from "../../meja/_components/dialog-tambah-meja";

export default function Pesanan() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Pesanan"
          description="Pantau semua transaksi masuk, status pembayaran, dan progres dapur secara real-time."
        />
        <Dialog>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                Buat Pesanan Baru
              </Button>
            }
          />
        </Dialog>
      </div>
    </div>
  );
}
