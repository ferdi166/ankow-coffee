"use client";

import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  OrdersWithItemsForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";
import { Menu } from "@/validations/menu-validation";
import MenuCustomer from "./menu-customer";
import CartItem from "./cart-item";
import CartSheet from "./cart-sheet";

type Props = {
  tableId: string;
  tableNumber: string;
  menu: Menu[];
  onSubmitOrder?: (data: OrdersWithItemsForm) => void;
};

export default function CustomerOrderPage({
  tableId,
  tableNumber,
  menu,
  onSubmitOrder,
}: Props) {
  const form = useForm<OrdersWithItemsForm>({
    resolver: zodResolver(OrdersWithItemsSchemaForm),
    defaultValues: {
      customer_name: "",
      table_id: tableId,
      order_type: "Dine In",
      items: [],
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const selectedItems = fields.map((field) => {
    const menuItem = menu.find((item) => item.id === field.menu_item_id);

    return {
      ...field,
      menuItem,
    };
  });

  const total = useMemo(() => {
    return selectedItems.reduce((totalPrice, item) => {
      if (!item.menuItem) {
        return totalPrice;
      }

      return totalPrice + item.menuItem.price * item.quantity;
    }, 0);
  }, [selectedItems]);

  const cartItems = selectedItems.flatMap((item) => {
    if (!item.menuItem) {
      return [];
    }

    return [
      {
        id: item.menu_item_id,
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      },
    ];
  });

  function addMenuItem(menuItem: Menu) {
    const existingIndex = fields.findIndex(
      (field) => field.menu_item_id === menuItem.id,
    );

    if (existingIndex !== -1) {
      const existingItem = fields[existingIndex];

      update(existingIndex, {
        menu_item_id: existingItem.menu_item_id,
        quantity: existingItem.quantity + 1,
        notes: existingItem.notes ?? "",
      });

      return;
    }

    append({
      menu_item_id: menuItem.id,
      quantity: 1,
      notes: "",
    });
  }

  function increaseQuantity(index: number) {
    const item = fields[index];

    update(index, {
      menu_item_id: item.menu_item_id,
      quantity: item.quantity + 1,
      notes: item.notes ?? "",
    });
  }

  function decreaseQuantity(index: number) {
    const item = fields[index];

    if (item.quantity <= 1) {
      remove(index);
      return;
    }

    update(index, {
      menu_item_id: item.menu_item_id,
      quantity: item.quantity - 1,
      notes: item.notes ?? "",
    });
  }

  function getItemIndex(id: string) {
    return fields.findIndex((field) => field.menu_item_id === id);
  }

  function increaseQuantityById(id: string) {
    const index = getItemIndex(id);

    if (index !== -1) {
      increaseQuantity(index);
    }
  }

  function decreaseQuantityById(id: string) {
    const index = getItemIndex(id);

    if (index !== -1) {
      decreaseQuantity(index);
    }
  }

  function removeItemById(id: string) {
    const index = getItemIndex(id);

    if (index !== -1) {
      remove(index);
    }
  }

  function submitOrder(data: OrdersWithItemsForm) {
    onSubmitOrder?.(data);
  }

  return (
    <form
      onSubmit={form.handleSubmit(submitOrder)}
      className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 py-4 pb-28">
      {/* Informasi meja */}
      <div className="rounded-xl bg-espresso p-4 text-white">
        <p className="text-xs text-white/70">Pesanan untuk</p>
        <h1 className="mt-1 text-lg font-semibold">Meja {tableNumber}</h1>
      </div>

      {/* Daftar menu */}
      <section className="space-y-3">
        <MenuCustomer menu={menu} onAdd={addMenuItem} />
      </section>

      {/* Data pelanggan */}
      <Card>
        <CardHeader className="px-4 pt-4 pb-0">
          <h2 className="font-semibold">Data Pemesan</h2>
        </CardHeader>

        <CardContent className="space-y-2 p-4">
          <label htmlFor="customer_name" className="text-sm font-medium">
            Nama pelanggan
          </label>

          <Input
            id="customer_name"
            placeholder="Masukkan nama Anda"
            {...form.register("customer_name")}
          />

          {form.formState.errors.customer_name && (
            <p className="text-xs text-destructive">
              {form.formState.errors.customer_name.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ringkasan dan submit */}
      <Card className="border-primary/20">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-lg font-bold text-primary">
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={fields.length === 0}>
            Kirim Pesanan
          </Button>
        </CardContent>
      </Card>
      <CartSheet
        items={cartItems}
        customerName={form.watch("customer_name")}
        onCustomerNameChange={(value) =>
          form.setValue("customer_name", value, {
            shouldValidate: true,
          })
        }
        onIncrease={increaseQuantityById}
        onDecrease={decreaseQuantityById}
        onRemove={removeItemById}
        onSubmit={form.handleSubmit(submitOrder)}
      />
    </form>
  );
}
