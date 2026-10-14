import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu } from "@/validations/menu-validation";

type Props = {
  item: Menu;
  onAdd: () => void;
};

export default function MenuCard({ item, onAdd }: Props) {
  return (
    <Card className="gap-0 overflow-hidden rounded-xl py-0 shadow-none">
      <CardContent className="flex gap-3 p-3">
        <img
          src={item.image_url}
          alt={item.name}
          className="size-16 shrink-0 rounded-lg object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="truncate text-xs font-bold">{item.name}</h3>
            <p className="truncate text-[11px] text-muted-foreground">
              {item.description}
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-xs font-bold">
              Rp {item.price.toLocaleString("id-ID")}
            </span>

            <Button type="button" size="sm" onClick={onAdd}>
              + Tambah
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
