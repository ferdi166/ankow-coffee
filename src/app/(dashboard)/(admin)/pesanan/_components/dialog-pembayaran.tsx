"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/common/form-input";
import {
  OrdersWithItems,
  PaymentForm,
  PaymentSchemaForm,
} from "@/validations/orders-validation";
import {
  INITIAL_PAYMENT,
  INITIAL_STATE_PAYMENT,
} from "@/constants/orders-constant";
import { Check } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { pembayaran } from "../action";

type Props = {
  pesanan: OrdersWithItems;
  onSuccess: () => void;
  isLoading?: boolean;
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export default function DialogPembayaran({ pesanan, onSuccess }: Props) {
  const form = useForm<PaymentForm>({
    resolver: zodResolver(PaymentSchemaForm),
    defaultValues: INITIAL_PAYMENT,
  });

  const [pembayaranState, pembayaranAction, isPendingPembayaran] =
    useActionState(pembayaran, INITIAL_STATE_PAYMENT);

  const receivedAmount = Number(form.watch("received_amount") || 0);
  const totalAmount = pesanan.total_amount;
  const change = Math.max(receivedAmount - totalAmount, 0);
  const isEnough = receivedAmount >= totalAmount;

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    formData.append("received_amount", String(data.received_amount));
    formData.append("id", pesanan.id);

    startTransition(() => {
      pembayaranAction(formData);
    });
  });

  useEffect(() => {
    if (pembayaranState.status === "success") {
      onSuccess();
    }

    if (pembayaranState.status === "error") {
      form.setError("received_amount", {
        type: "server",
        message: pembayaranState.errors?._form?.[0],
      });
    }
  }, [pembayaranState, form, onSuccess]);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[520px]">
      <DialogHeader className="border-b px-6 py-5">
        <DialogTitle className="text-xl font-bold">
          Proses Pembayaran - #{pesanan.order_number}
        </DialogTitle>

        <DialogDescription>
          Masukkan uang yang diterima untuk menyelesaikan transaksi.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit}>
        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
            <div>
              <span className="block text-xs text-muted-foreground">
                Total Tagihan
              </span>

              <strong className="mt-1 block text-2xl">
                {formatRupiah(totalAmount)}
              </strong>
            </div>

            <div className="rounded-full border bg-background px-3 py-1.5 text-xs">
              {pesanan.order_items.length} Item{" • "}
              {pesanan.order_type === "Takeaway"
                ? "Takeaway"
                : `Dine In - Meja ${pesanan.tables?.table_number ?? "-"}`}
            </div>
          </div>

          <FormInput
            form={form}
            name="received_amount"
            label="Uang Diterima"
            type="number"
            placeholder="Masukkan nominal uang..."
          />

          <div className="flex flex-wrap gap-2">
            {[totalAmount, 50000, 100000].map((amount) => (
              <Button
                key={amount}
                type="button"
                variant={receivedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  form.setValue("received_amount", String(amount), {
                    shouldValidate: true,
                  })
                }>
                {amount === totalAmount
                  ? `Uang Pas (${formatRupiah(amount)})`
                  : formatRupiah(amount)}
              </Button>
            ))}
          </div>

          <div
            className={
              isEnough
                ? "flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-800"
                : "flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-amber-800"
            }>
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Check className="size-4" />
              {isEnough ? "Uang Kembalian" : "Uang masih kurang"}
            </span>

            <strong>
              {isEnough
                ? formatRupiah(change)
                : formatRupiah(totalAmount - receivedAmount)}
            </strong>
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0">
          <DialogClose render={<Button variant="outline">Batal</Button>} />

          <Button type="submit" disabled={!isEnough || isPendingPembayaran}>
            <Check />
            {isPendingPembayaran ? "Memproses..." : "Konfirmasi & Pelunasan"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
