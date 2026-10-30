import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import CustomerOrderPage from "./customer-order-page";
import { Menu } from "@/validations/menu-validation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PesananMeja({ params }: Props) {
  const { id: tableNumber } = await params;
  const supabase = await createClient();

  const { data: table, error } = await supabase
    .from("tables")
    .select("id, table_number, area_zone, is_active")
    .eq("table_number", tableNumber)
    .single();

  if (error || !table || !table.is_active) {
    notFound();
  }

  const { data: menu, error: menuError } = await supabase
    .from("menu_items")
    .select(
      "id, categories!menu_items_category_id_fkey(id, name), name, description, price, image_url, is_available",
    )
    .overrideTypes<Menu[], { merge: false }>();

  if (menuError) {
    throw menuError;
  }

  return (
    <main className="min-h-screen bg-background">
      <CustomerOrderPage
        tableId={table.id}
        tableNumber={table.table_number}
        menu={menu ?? []}
      />
    </main>
  );
}
