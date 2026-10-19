"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  OrdersWithItemsForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";
import { Menu } from "@/validations/menu-validation";
import MenuCustomer from "./menu-customer";
import CartSheet from "./cart-sheet";
import { INITIAL_STATE_ORDERS } from "@/constants/orders-constant";
import { createPesanan } from "@/actions/order-action";
import { toast } from "@/components/ui/toast";

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

  const [orderStatus, setOrderStatus] = useState<string>("unpaid");
  const [createPesananState, createPesananAction, isPendingCreatePesanan] =
    useActionState(createPesanan, INITIAL_STATE_ORDERS);

  function submitOrder(data: OrdersWithItemsForm) {
    const formData = new FormData();

    formData.append("customer_name", `Meja ${tableNumber}`);
    formData.append("table_id", tableId);
    formData.append("order_type", "Dine In");
    formData.append("items", JSON.stringify(data.items));

    startTransition(() => {
      createPesananAction(formData);
    });
  }

  useEffect(() => {
    if (createPesananState.status === "error") {
      toast.add({
        type: "error",
        title: "Buat Pesanan gagal",
        description: createPesananState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (createPesananState.status === "success") {
      toast.add({
        type: "success",
        title: "Buat Pesanan berhasil",
        description: "Data Pesanan berhasil dikirim",
      });
    }
  }, [createPesananState.errors, createPesananState.status, form]);

  useEffect(() => {
    if (orderStatus === "paid") {
      form.reset({
        customer_name: "",
        table_id: tableId,
        order_type: "Dine In",
        items: [],
      });
    }
  }, [form, orderStatus, tableId]);

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
      <MenuCustomer menu={menu} onAdd={addMenuItem} />

      <CartSheet
        items={cartItems}
        onIncrease={increaseQuantityById}
        onDecrease={decreaseQuantityById}
        onRemove={removeItemById}
        onSubmit={form.handleSubmit(submitOrder)}
        isSubmitting={isPendingCreatePesanan}
      />
    </form>
  );
}
