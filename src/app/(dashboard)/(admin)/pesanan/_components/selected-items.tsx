import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu } from "@/validations/menu-validation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: {
    id: string;
    menu_item_id: string;
    quantity: number;
    notes?: string;
  }[];
  menu: Menu[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export default function SelectedItems<T extends FieldValues>({
  form,
  fields,
  menu,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: Props<T>) {
  return (
    <section className="mt-4 flex min-h-0 flex-1 flex-col">
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <h3 className="text-xs font-bold">Item Terpilih ({fields.length})</h3>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={fields.length === 0}>
          Hapus Semua
        </Button>
      </div>

      <ScrollArea className="min-h-0 flex-1 pr-3">
        <div className="space-y-2">
          {fields.map((field, index) => {
            const selectedMenu = menu.find(
              (item) => item.id === field.menu_item_id,
            );

            if (!selectedMenu) {
              return null;
            }

            return (
              <div key={field.id} className="rounded-xl border p-2.5">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-xs font-bold">
                      {selectedMenu.name}
                    </h4>

                    <p className="text-[11px] text-muted-foreground">
                      {field.quantity}x @Rp{" "}
                      {selectedMenu.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold">
                      Rp{" "}
                      {(selectedMenu.price * field.quantity).toLocaleString(
                        "id-ID",
                      )}
                    </p>

                    <div className="mt-1 flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        size="icon-xs"
                        variant="secondary"
                        onClick={() => onDecrease(field.id)}>
                        <Minus />
                      </Button>

                      <span className="w-5 text-center text-xs font-bold">
                        {field.quantity}
                      </span>

                      <Button
                        type="button"
                        size="icon-xs"
                        variant="secondary"
                        onClick={() => onIncrease(field.id)}>
                        <Plus />
                      </Button>

                      <Button
                        type="button"
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => onRemove(field.id)}>
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>

                <FormInput
                  form={form}
                  name={`items.${index}.notes` as Path<T>}
                  label=""
                  placeholder="Catatan item..."
                />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
