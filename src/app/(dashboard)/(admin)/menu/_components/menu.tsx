import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function Menu() {
  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Manajemen Menu & Stok"
          description="Kelola katalog menu, harga, dan ketersediaan stok real-time."
        />
        <Dialog>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                Tambah Menu
              </Button>
            }
          />
        </Dialog>
      </div>
    </div>
  );
}
