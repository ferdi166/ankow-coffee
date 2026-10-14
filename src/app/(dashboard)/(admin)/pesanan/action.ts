"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { OrdersFormState } from "@/types/orders";
import { TableFormState } from "@/types/table";
import { MenuSchemaForm } from "@/validations/menu-validation";
import { TableSchemaForm } from "@/validations/table-validation";

export async function createMeja(
  prevState: OrdersFormState,
  formData: FormData,
) {
  const validateFields = TableSchemaForm.safeParse({
    customer_name: formData.get("customer_name"),
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

  const orderNumber = `AKW-`;

  const { error } = await supabase.from("orders").insert({
    table_number: validateFields.data.table_number,
    area_zone: validateFields.data.area_zone,
    capacity: validateFields.data.capacity,
    is_active: validateFields.data.is_active,
  });

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
