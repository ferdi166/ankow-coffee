import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Props = {
  name: string;
  price: number;
  quantity: number;
  isLast?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItem({
  name,
  price,
  quantity,
  isLast = false,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const subtotal = price * quantity;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold">{name}</h3>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Rp {price.toLocaleString("id-ID")} / menu
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`Hapus ${name}`}
          onClick={onRemove}>
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Kurangi jumlah ${name}`}
            onClick={onDecrease}>
            <Minus />
          </Button>

          <span className="w-6 text-center text-sm font-semibold">
            {quantity}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={`Tambah jumlah ${name}`}
            onClick={onIncrease}>
            <Plus />
          </Button>
        </div>

        <span className="text-sm font-semibold">
          Rp {subtotal.toLocaleString("id-ID")}
        </span>
      </div>

      {!isLast && <Separator />}
    </div>
  );
}
