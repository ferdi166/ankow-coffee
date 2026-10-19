import {
  Coffee,
  Menu as MenuIcon,
  ReceiptText,
  ShoppingBag,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MenuCardCustomer from "./menu-card-customer";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import CustomerOrderForm from "./customer-order-page";
import CustomerOrderPage from "./customer-order-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PesananMeja({ params }: Props) {
  const { id: tableId } = await params;
  const supabase = await createClient();

  const { data: table, error } = await supabase
    .from("tables")
    .select("id, table_number, area_zone, is_active")
    .eq("id", tableId)
    .single();

  if (error || !table || !table.is_active) {
    notFound();
  }

  const { data: menu, error: menuError } = await supabase
    .from("menu_items")
    .select(
      "id, categories!menu_items_category_id_fkey(id, name), name, description, price, image_url, is_available",
    )
    .eq("is_available", true);

  if (menuError) {
    throw menuError;
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-espresso px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-latte/20 text-latte">
            <Coffee className="size-4" />
          </div>

          <span className="font-heading text-base font-bold">Ankow Coffee</span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-latte px-3 py-1.5 text-xs font-semibold">
          <span className="size-1.5 rounded-full bg-white" />
          Meja {table.table_number}
        </div>
      </header>

      {/* Konten */}
      <section className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 py-4">
        {/* Search sementara */}
        <div className="rounded-full border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Cari menu kopi, pastry, beans...
        </div>

        {/* Kategori sementara */}
        <div className="flex gap-2 overflow-x-auto">
          <Button size="sm">Semua</Button>
          <Button size="sm" variant="outline">
            Espresso Based
          </Button>
          <Button size="sm" variant="outline">
            Manual Brew
          </Button>
          <Button size="sm" variant="outline">
            Non-Coffee
          </Button>
          <Button size="sm" variant="outline">
            Pastry
          </Button>
        </div>

        {/* Header daftar menu */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="h-4 w-2 rounded-full bg-primary" />
            <h1 className="font-heading text-lg font-semibold">Daftar Menu</h1>
          </div>

          <span className="text-xs text-muted-foreground">0 Menu Tersedia</span>
        </div>

        {/* Placeholder menu */}
        <div className="rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          <CustomerOrderPage
            tableId={table.id}
            tableNumber={table.table_number}
            menu={menu ?? []}
          />
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 shadow-[0_-2px_12px_rgba(30,16,18,0.08)] backdrop-blur">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          <Button
            variant="ghost"
            className="flex h-12 flex-col gap-1 text-primary">
            <MenuIcon className="size-5" />
            <span className="text-[10px]">Menu</span>
          </Button>

          <Button
            variant="ghost"
            className="flex h-12 flex-col gap-1 text-muted-foreground">
            <ReceiptText className="size-5" />
            <span className="text-[10px]">Pesanan</span>
          </Button>

          <Button
            variant="ghost"
            className="flex h-12 flex-col gap-1 text-muted-foreground">
            <Utensils className="size-5" />
            <span className="text-[10px]">Panggil</span>
          </Button>

          <Button
            variant="ghost"
            className="flex h-12 flex-col gap-1 text-muted-foreground">
            <ShoppingBag className="size-5" />
            <span className="text-[10px]">Keranjang</span>
          </Button>
        </div>
      </nav>
    </main>
  );
}
