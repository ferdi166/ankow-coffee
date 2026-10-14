"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { OrdersFormState } from "@/types/orders";
import { TableFormState } from "@/types/table";
import {
  OrderItemForm,
  OrdersWithItemsSchemaForm,
} from "@/validations/orders-validation";
import { TableSchemaForm } from "@/validations/table-validation";

export async function createPesanan(
  prevState: OrdersFormState,
  formData: FormData,
) {
  let items: unknown;

  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return {
      status: "error",
      errors: {
        items: ["Format items tidak valid"],
        _form: [],
      },
    };
  }

  const validateFields = OrdersWithItemsSchemaForm.safeParse({
    customer_name: formData.get("customer_name"),
    table_id: formData.get("table_id") || null,
    order_type: formData.get("order_type"),
    items,
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();
  const orderData = validateFields.data;

  // Harga diambil dari database, bukan dipercaya dari client.
  const menuIds = orderData.items.map((item) => item.menu_item_id);

  const { data: menus, error: menuError } = await supabase
    .from("menu_items")
    .select("id, price")
    .in("id", menuIds);

  if (menuError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [menuError.message],
      },
    };
  }

  if (!menus || menus.length !== menuIds.length) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Ada menu yang tidak ditemukan"],
      },
    };
  }

  const orderItems = orderData.items.map((item: OrderItemForm) => {
    const menu = menus.find((menu) => menu.id === item.menu_item_id);

    if (!menu) {
      throw new Error("Menu tidak ditemukan");
    }

    return {
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: menu.price,
      subtotal: menu.price * item.quantity,
      notes: item.notes || null,
    };
  });

  const totalAmount = orderItems.reduce(
    (total, item) => total + item.subtotal,
    0,
  );

  const orderNumber = `AKW-${Date.now()}`;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: orderData.customer_name,
      table_id: orderData.table_id,
      order_type: orderData.order_type,
      total_amount: totalAmount,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [orderError?.message ?? "Order gagal dibuat"],
      },
    };
  }

  const { error: itemError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    })),
  );

  if (itemError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [itemError.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function editMeja(prevState: TableFormState, formData: FormData) {
  const validateFields = TableSchemaForm.safeParse({
    table_number: formData.get("table_number"),
    area_zone: formData.get("area_zone"),
    capacity: formData.get("capacity"),
    is_active: formData.get("is_active") === "true",
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const tableNumber = validateFields.data.table_number;

  const orderingUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/table/${encodeURIComponent(tableNumber)}`;

  const { error } = await supabase
    .from("tables")
    .update({
      table_number: validateFields.data.table_number,
      area_zone: validateFields.data.area_zone,
      capacity: validateFields.data.capacity,
      is_active: validateFields.data.is_active,
      // qr_code_url: orderingUrl,
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function hapusMeja(prevState: TableFormState, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
