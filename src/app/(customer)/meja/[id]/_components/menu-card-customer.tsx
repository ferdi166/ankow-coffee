import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "@/validations/menu-validation";

type Props = {
  item: Menu;
  onAdd: () => void;
};

export default function MenuCardCustomer({ item, onAdd }: Props) {
  const formattedPrice = `Rp ${item.price.toLocaleString("id-ID")}`;

  return (
    <Card
      className={`overflow-hidden rounded-2xl border-border py-0 shadow-sm ${
        !item.is_available ? "opacity-60" : ""
      }`}>
      <CardContent className="flex gap-3.5 p-3.5">
        <div className="relative size-[88px] shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image
            src={item.image_url}
            alt={item.name}
            loading="eager"
            fill
            sizes="88px"
            className={`object-cover ${!item.is_available ? "grayscale" : ""}`}
          />

          {!item.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
              <span className="rounded-full bg-background px-2 py-1 text-[10px] font-semibold">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate text-sm font-semibold">{item.name}</h3>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Favoritkan ${item.name}`}
                disabled={!item.is_available}>
                <Heart className="size-4" />
              </Button>
            </div>

            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-start text-muted-foreground">
              {item.description}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2 border-t pt-2">
            <span className="text-sm font-bold">{formattedPrice}</span>

            {item.is_available ? (
              <Button
                type="button"
                size="sm"
                className="rounded-full px-3"
                onClick={onAdd}>
                <Plus />
                Tambah
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="rounded-full px-3"
                disabled>
                Habis
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
