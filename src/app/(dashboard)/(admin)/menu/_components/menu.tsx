"use client";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import MenuTable from "./menu-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Menu } from "@/validations/menu-validation";
import DialogTambahMenu from "./dialog-tambah-menu";
import { useCallback, useState } from "react";

export default function Menu() {
  const supabase = createClient();
  const {
    data: menu,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select(
          "id, categories!menu_items_category_id_fkey (id, name), name, description, price, image_url, is_available",
        )
        .overrideTypes<Menu[], { merge: false }>();

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

  const menuItems = (menu ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    category: item.categories?.name ?? "Tanpa Kategori",
    price: Number(item.price),
    image_url: item.image_url ?? undefined,
    is_available: item.is_available,
  }));

  console.log(menu);

  return (
    <div className="p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Manajemen Menu & Stok"
          description="Kelola katalog menu, harga, dan ketersediaan stok real-time."
        />
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus />
                Tambah Menu
              </Button>
            }
          />
          <DialogTambahMenu refetch={refetch} onSuccess={handleCreateSuccess} />
        </Dialog>
      </div>
      <MenuTable items={menu ?? []} />
    </div>
  );
}
