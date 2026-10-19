import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrdersWithItems } from "@/validations/orders-validation";
import OrderSummary from "../../../../../components/common/order-summary";
import { Button } from "@/components/ui/button";

type Props = {
  pesanan: OrdersWithItems;
  onProcessPayment: (pesanan: OrdersWithItems) => void;
};

export default function DialogDetailPesanan({
  pesanan,
  onProcessPayment,
}: Props) {
  const items = pesanan.order_items.map((item) => ({
    id: item.id,
    name: item.menu_items.name,
    price: item.unit_price,
    quantity: item.quantity,
    notes: item.notes ?? "",
  }));

  const location =
    pesanan.order_type === "Takeaway"
      ? "Takeaway"
      : `Meja ${pesanan.tables?.table_number ?? "-"}${
          pesanan.tables?.area_zone ? ` (${pesanan.tables.area_zone})` : ""
        }`;

  return (
    <DialogContent className="max-h-[90vh] p-0 sm:max-w-2xl">
      <DialogHeader className="border-b px-6 py-5">
        <DialogTitle className="text-xl font-bold">
          Detail Pesanan - #{pesanan.order_number}
        </DialogTitle>

        <DialogDescription render={<div className="flex items-center gap-2" />}>
          <div>
            {new Date(pesanan.created_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            •{" "}
            {new Date(pesanan.created_at).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </div>
          <div>
            {pesanan.payment_status === "unpaid" && (
              <span className="mt-2 w-fit rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Belum Bayar
              </span>
            )}
            {pesanan.payment_status === "paid" && (
              <span className="mt-2 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Lunas ({pesanan.payment_method})
              </span>
            )}
          </div>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-8 px-6 pb-5 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Tipe & Lokasi
            </p>
            <p className="mt-1 text-sm font-semibold">{location}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Pemesan
            </p>
            <p className="mt-1 text-sm font-semibold">
              {pesanan.customer_name}
            </p>
          </div>
        </div>

        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
            Rincian Item Pesanan
          </h3>

          <div className="divide-y rounded-xl border overflow-y-auto">
            {pesanan.order_items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {item.quantity}x {item.menu_items.name}
                  </p>

                  {item.notes && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Catatan: {item.notes}
                    </p>
                  )}
                </div>

                <p className="shrink-0 text-sm font-bold">
                  Rp {item.subtotal.toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <OrderSummary items={items} />
      </div>
      {pesanan.payment_status === "unpaid" && (
        <DialogFooter className="mx-0 mb-0">
          <DialogClose render={<Button variant="outline">Batal</Button>} />

          <Button
            type="button"
            className="shrink-0"
            onClick={() => onProcessPayment(pesanan)}>
            Proses Pembayaran
          </Button>
        </DialogFooter>
      )}
    </DialogContent>
  );
}
