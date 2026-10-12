"use client";

import PageTitle from "@/components/common/page-title";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import MenuTable from "./menu-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Menu } from "@/validations/menu-validation";

const menuItems = [
  {
    id: "1",
    name: "Kopi Susu Ankow",
    description: "Double shot espresso, fresh milk, gula aren murni",
    category: "Espresso Based",
    price: 18000,
    imageUrl: "/images/kopi-susu.jpg",
    isAvailable: true,
  },
];

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
        );

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const menuItems = (menu ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    category: item.categories?.name ?? "Tanpa Kategori",
    price: Number(item.price),
    imageUrl: item.image_url ?? undefined,
    isAvailable: item.is_available,
  }));

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
      <MenuTable items={menuItems} />
    </div>
  );
}
