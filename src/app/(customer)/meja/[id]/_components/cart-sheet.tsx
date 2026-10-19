"use client";

import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import CartItem from "./cart-item";

type CartItemData = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  items: CartItemData[];
  customerName: string;
  total: number;
  onCustomerNameChange: (value: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export default function CartSheet({
  items,
  customerName,
  total,
  onCustomerNameChange,
  onIncrease,
  onDecrease,
  onRemove,
  onSubmit,
  isSubmitting = false,
}: Props) {
  const totalItems = items.reduce(
    (totalQuantity, item) => totalQuantity + item.quantity,
    0,
  );

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            type="button"
            className="fixed right-4 bottom-20 z-40 rounded-full shadow-lg"
          />
        }>
        <ShoppingBag />
        Keranjang
        {totalItems > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-white text-xs text-primary">
            {totalItems}
          </span>
        )}
      </SheetTrigger>

      <SheetContent side="bottom" className="mx-auto max-h-[90vh] max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Keranjang Pesanan
          </SheetTitle>

          <SheetDescription>
            Periksa pesanan sebelum dikirim ke dapur.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Keranjang masih kosong.
            </div>
          ) : (
            <>
              <div className="space-y-4 rounded-xl border bg-card p-4">
                {items.map((item, index) => (
                  <CartItem
                    key={item.id}
                    name={item.name}
                    price={item.price}
                    quantity={item.quantity}
                    isLast={index === items.length - 1}
                    onIncrease={() => onIncrease(item.id)}
                    onDecrease={() => onDecrease(item.id)}
                    onRemove={() => onRemove(item.id)}
                  />
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="customer-name" className="text-sm font-medium">
                  Nama pelanggan
                </label>

                <Input
                  id="customer-name"
                  value={customerName}
                  onChange={(event) => onCustomerNameChange(event.target.value)}
                  placeholder="Masukkan nama Anda"
                />
              </div>

              <div className="space-y-3 rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah menu</span>
                  <span>{totalItems} menu</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    Rp {total.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="px-4">
          <Button
            type="button"
            className="w-full"
            disabled={
              items.length === 0 ||
              customerName.trim().length === 0 ||
              isSubmitting
            }
            onClick={onSubmit}>
            {isSubmitting ? "Mengirim Pesanan..." : "Kirim Pesanan"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
