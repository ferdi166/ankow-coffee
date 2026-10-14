import FormImage from "@/components/common/form-image";
import FormInput from "@/components/common/form-input";
import FormSelect from "@/components/common/form-select";
import FormSwitch from "@/components/common/form-switch";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Preview } from "@/types/general";
import { Menu } from "@/validations/menu-validation";
import { OrdersWithItems } from "@/validations/orders-validation";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, Loader2, Search } from "lucide-react";
import {
  FieldValues,
  Path,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import MenuCard from "./menu-card";
import OrderTypeSelector from "./order-type-selector";
import CustomerField from "./customer-field";
import SelectedItems from "./selected-items";
import OrderSummary from "./order-summary";
import TableField from "./table-field";
import { Table } from "@/validations/table-validation";

export default function FormPesanan<T extends FieldValues>({
  form,
  pesanan,
  type,
  preview,
  setPreview,
  onSubmit,
  isLoading,
}: {
  form: UseFormReturn<T>;
  pesanan?: OrdersWithItems;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Tambah" | "Edit";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  const supabase = createClient();
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");

      if (error) {
        throw error;
      }

      return data;
    },
  });

  const { data: menu } = useQuery({
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
  const { data: tables } = useQuery({
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

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items" as never,
  });

  return (
    <DialogContent className="flex h-[90vh] max-h-[90vh] flex-col sm:max-w-6xl">
      <DialogHeader className="mx-2 mt-2">
        <DialogTitle className="font-semibold">
          {type === "Tambah"
            ? "Buat Pesanan Baru"
            : `Edit Menu - ${pesanan?.order_number}`}
        </DialogTitle>
        <DialogDescription>
          {type === "Tambah"
            ? "Input pesanan langsung dari meja kasir untuk Takeaway atau Dine-In."
            : "Perbarui item, catatan, atau meja untuk pesanan ini."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 md:grid-cols-[1.35fr_1fr]">
          <section className="min-h-0 overflow-y-auto border-r p-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                className="pl-9"
                placeholder="Cari menu kopi, non-kopi, atau pastry..."
              />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto">
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  size="sm">
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              {menu?.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAdd={() => {
                    const existingIndex = fields.findIndex(
                      (field) => field.menu_item_id === item.id,
                    );

                    if (existingIndex !== -1) {
                      update(existingIndex, {
                        ...fields[existingIndex],
                        quantity: fields[existingIndex].quantity + 1,
                      });

                      return;
                    }

                    append({
                      menu_item_id: item.id,
                      quantity: 1,
                      notes: "",
                    });
                  }}
                />
              ))}
            </div>
          </section>

          <section className="flex min-h-0 flex-col overflow-hidden p-5">
            <OrderTypeSelector form={form} />
            <div className="mt-3 grid shrink-0 gap-3 sm:grid-cols-2">
              {form.watch("order_type" as Path<T>) === "Dine-In" && (
                <TableField form={form} tables={tables ?? []} />
              )}

              <CustomerField form={form} />
            </div>

            <SelectedItems
              form={form}
              fields={fields}
              menu={menu ?? []}
              onIncrease={(id) => {
                const index = fields.findIndex((field) => field.id === id);

                if (index !== -1) {
                  update(index, {
                    ...fields[index],
                    quantity: fields[index].quantity + 1,
                  });
                }
              }}
              onDecrease={(id) => {
                const index = fields.findIndex((field) => field.id === id);

                if (index !== -1 && fields[index].quantity > 1) {
                  update(index, {
                    ...fields[index],
                    quantity: fields[index].quantity - 1,
                  });
                }
              }}
              onRemove={(id) => {
                const index = fields.findIndex((field) => field.id === id);

                if (index !== -1) {
                  remove(index);
                }
              }}
              onClear={() => remove(fields.map((_, index) => index))}
            />

            <OrderSummary items={[]} />
          </section>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Batal</Button>} />
          <Button type="submit" className="shrink-0">
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2Icon />
            )}
            {isLoading ? "Menyimpan..." : "Simpan Menu"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
