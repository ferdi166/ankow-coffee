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
import { createPesanan, editPesanan } from "@/actions/order-action";
import { OrdersFormState } from "@/types/orders";
import { toast } from "@/components/ui/toast";

type ActiveOrder = {
  id: string;
  customer_name: string | null;
  order_type: string;
  total_amount: number;
  payment_status: string;
  order_status: string;
  order_items: {
    id: string;
    menu_item_id: string;
    quantity: number;
    notes: string | null;
  }[];
};

type Props = {
  tableId: string;
  tableNumber: string;
  menu: Menu[];
  activeOrder: ActiveOrder | null;
  onSubmitOrder?: (data: OrdersWithItemsForm) => void;
};

export default function CustomerOrderPage({
  tableId,
  tableNumber,
  menu,
  activeOrder,
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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(
    activeOrder?.id ?? null,
  );

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { reset } = form;

  useEffect(() => {
    if (!activeOrder) {
      return;
    }

    reset({
      customer_name: activeOrder.customer_name ?? `Meja ${tableNumber}`,
      table_id: tableId,
      order_type: "Dine In",
      items: activeOrder.order_items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        notes: item.notes ?? "",
      })),
    });
  }, [activeOrder, reset, tableId, tableNumber]);

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

  async function saveCustomerOrder(
    previousState: OrdersFormState,
    formData: FormData,
  ) {
    const currentOrderId = formData.get("id");

    if (typeof currentOrderId === "string" && currentOrderId.length > 0) {
      return editPesanan(previousState, formData);
    }

    return createPesanan(previousState, formData);
  }

  const [orderState, saveOrderAction, isPending] = useActionState(
    saveCustomerOrder,
    INITIAL_STATE_ORDERS,
  );

  function submitOrder(data: OrdersWithItemsForm) {
    const formData = new FormData();

    formData.append("customer_name", `Meja ${tableNumber}`);
    formData.append("table_id", tableId);
    formData.append("order_type", "Dine In");
    formData.append("items", JSON.stringify(data.items));

    if (orderId) {
      formData.append("id", orderId);
    }

    startTransition(() => {
      saveOrderAction(formData);
    });
  }

  useEffect(() => {
    if (orderState.status === "error") {
      toast.add({
        type: "error",
        title: "Buat Pesanan gagal",
        description: orderState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (orderState.status === "success") {
      toast.add({
        type: "success",
        title:
          orderState.data?.action === "update"
            ? "Pesanan berhasil diperbarui"
            : "Pesanan berhasil dibuat",
        description:
          orderState.data?.action === "update"
            ? "Perubahan pesanan berhasil disimpan"
            : "Pesanan berhasil dikirim",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCartOpen(false);
    }
  }, [orderState.errors, orderState.status, form, orderState.data?.action]);

  useEffect(() => {
    if (orderState.status === "success" && orderState.data?.order_id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrderId(orderState.data.order_id);
    }
  }, [orderState]);

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
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onIncrease={increaseQuantityById}
        onDecrease={decreaseQuantityById}
        onRemove={removeItemById}
        onSubmit={form.handleSubmit(submitOrder)}
        isSubmitting={isPending}
      />
    </form>
  );
}
