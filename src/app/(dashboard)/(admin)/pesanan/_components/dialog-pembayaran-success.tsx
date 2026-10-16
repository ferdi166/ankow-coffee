"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Printer } from "lucide-react";
import { OrdersWithItems } from "@/validations/orders-validation";
import { PaymentSuccessData } from "@/types/orders";

type Props = {
  pesanan: OrdersWithItems;
  payment: PaymentSuccessData;
};

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

const formatDate = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "short",
    timeStyle: "short",
  });

function printReceipt(pesanan: OrdersWithItems, payment: PaymentSuccessData) {
  const receiptWindow = window.open("", "_blank");

  if (!receiptWindow) return;

  const subtotal = pesanan.order_items.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const items = pesanan.order_items
    .map(
      (item) => `
        <div class="row">
          <span>${item.menu_items.name} x ${item.quantity}</span>
          <span>${formatRupiah(item.subtotal)}</span>
        </div>
      `,
    )
    .join("");

  receiptWindow.document.write(`
    <!doctype html>
    <html lang="id">
      <head>
        <title>Struk ${pesanan.order_number}</title>
        <style>
          body {
            width: 80mm;
            margin: 0 auto;
            padding: 16px;
            color: #111;
            font-family: Arial, sans-serif;
            font-size: 13px;
          }

          h1 {
            margin: 0 0 16px;
            text-align: center;
            font-size: 20px;
          }

          .line {
            border-top: 1px dashed #999;
            margin: 12px 0;
          }

          .meta {
            margin: 4px 0;
            line-height: 1.35;
          }

          .row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin: 9px 0;
            line-height: 1.4;
          }

          .summary {
            margin-top: 14px;
          }

          .summary .row {
            margin: 8px 0;
          }

          .row span:last-child {
            white-space: nowrap;
          }

          .total {
            margin-top: 12px;
            font-weight: bold;
            font-size: 15px;
          }

          .center {
            text-align: center;
          }

          @media print {
            body {
              width: 80mm;
            }
          }
        </style>
      </head>
      <body>
        <h1>Ankow Coffee</h1>

        <div class="line"></div>

        <div class="meta">Bill No: <strong>${pesanan.order_number}</strong></div>
        <div class="meta">Table: ${
          pesanan.order_type === "Takeaway"
            ? "Takeaway"
            : `Meja ${pesanan.tables?.table_number ?? "-"}`
        }</div>
        <div class="meta">Customer: <strong>${pesanan.customer_name}</strong></div>
        <div class="meta">Date: ${formatDate(pesanan.created_at)}</div>

        <div class="line"></div>

        ${items}

        <div class="line"></div>

        <div class="summary">
          <div class="row">
            <span>Subtotal</span>
            <span>Rp 54.000</span>
          </div>

          <div class="row">
            <span>Pajak (10%)</span>
            <span>Rp 5.400</span>
          </div>

          <div class="row total">
            <span>Total</span>
            <span>Rp 59.400</span>
          </div>
        </div>

        <div class="line"></div>
        <div class="center">Terima kasih</div>
      </body>
    </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();
}

export default function DialogPembayaranSuccess({ pesanan, payment }: Props) {
  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[480px]">
      <div className="p-6 text-center sm:p-7">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <Check className="size-8" strokeWidth={2.5} />
        </div>

        <DialogTitle className="text-2xl font-bold">
          Pembayaran Berhasil!
        </DialogTitle>

        <DialogDescription className="mt-1">
          Transaksi #{pesanan.order_number} telah dilunasi.
        </DialogDescription>

        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4">
          <span className="block text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Uang Kembalian
          </span>

          <strong className="mt-1 block text-3xl text-emerald-700">
            {formatRupiah(payment.change_amount)}
          </strong>
        </div>

        <div className="mt-4 space-y-3 rounded-xl border bg-muted/20 p-4 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Metode Pembayaran</span>

            <span className="flex items-center gap-1.5 font-semibold">
              <CreditCard className="size-4 text-primary" />
              Tunai
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Total Tagihan</span>

            <strong>{formatRupiah(pesanan.total_amount)}</strong>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Uang Diterima</span>

            <strong>{formatRupiah(payment.received_amount)}</strong>
          </div>

          <div className="border-t pt-3 text-xs text-muted-foreground">
            Kasir / Waktu
            <span className="float-right">Kasir</span>
          </div>
        </div>
      </div>

      <DialogFooter className="mx-0 mb-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => printReceipt(pesanan, payment)}>
          <Printer />
          Cetak Ulang Struk
        </Button>

        <DialogClose render={<Button type="button" />}>
          <Check />
          Selesai
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
