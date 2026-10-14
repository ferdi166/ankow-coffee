import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";

type SelectedItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
};

type Props = {
  items: SelectedItem[];
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onNotesChange: (id: string, notes: string) => void;
};

export default function SelectedItems({
  items,
  onIncrease,
  onDecrease,
  onRemove,
  onNotesChange,
}: Props) {
  return (
    <section className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold">Item Terpilih ({items.length})</h3>

        <Button type="button" variant="ghost" size="sm">
          Hapus Semua
        </Button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border p-2.5">
            <div className="flex justify-between gap-3">
              <div className="min-w-0">
                <h4 className="truncate text-xs font-bold">{item.name}</h4>
                <p className="text-[11px] text-muted-foreground">
                  {item.quantity}x @Rp {item.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>

                <div className="mt-1 flex items-center justify-end gap-1">
                  <Button
                    type="button"
                    size="icon-xs"
                    variant="secondary"
                    onClick={() => onDecrease(item.id)}>
                    <Minus />
                  </Button>

                  <span className="w-5 text-center text-xs font-bold">
                    {item.quantity}
                  </span>

                  <Button
                    type="button"
                    size="icon-xs"
                    variant="secondary"
                    onClick={() => onIncrease(item.id)}>
                    <Plus />
                  </Button>

                  <Button
                    type="button"
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => onRemove(item.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>

            <Input
              value={item.notes}
              onChange={(event) => onNotesChange(item.id, event.target.value)}
              className="mt-2 h-8 text-xs"
              placeholder="Catatan item..."
            />
          </div>
        ))}
      </div>
    </section>
  );
}
