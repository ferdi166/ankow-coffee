"use server";

import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { TableFormState } from "@/types/table";
import { MenuSchemaForm } from "@/validations/menu-validation";
import { TableSchemaForm } from "@/validations/table-validation";

export async function createMeja(
  prevState: TableFormState,
  formData: FormData,
) {
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

  const { error } = await supabase.from("tables").insert({
    table_number: validateFields.data.table_number,
    area_zone: validateFields.data.area_zone,
    capacity: validateFields.data.capacity,
    is_active: validateFields.data.is_active,
    qr_code_url: orderingUrl,
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

export async function editMenu(prevState: MenuFormState, formData: FormData) {
  let validateFields = MenuSchemaForm.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    image_url: formData.get("image_url"),
    category_id: formData.get("category_id"),
    is_available: formData.get("is_available") === "true",
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

  if (validateFields.data.image_url instanceof File) {
    const oldImageUrl = formData.get("old_image_url") as string;
    const oldPath = oldImageUrl
      ? oldImageUrl.split("/storage/v1/object/public/galleries/")[1]
      : undefined;
    const { errors, data } = await uploadFile(
      "menu-items",
      validateFields.data.image_url,
      undefined,
      oldPath,
    );

    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    validateFields = {
      ...validateFields,
      data: {
        ...validateFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("menu_items")
    .update({
      name: validateFields.data.name,
      description: validateFields.data.description,
      price: validateFields.data.price,
      image_url: validateFields.data.image_url,
      category_id: validateFields.data.category_id,
      is_available: validateFields.data.is_available,
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

export async function hapusMenu(prevState: MenuFormState, formData: FormData) {
  const supabase = await createClient();
  const image = formData.get("image_url") as string;
  const { status, errors } = await deleteFile("menu-items", image);

  if (status === "error") {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [errors?._form?.[0] ?? "Unknown error"],
      },
    };
  }

  const { error } = await supabase
    .from("menu_items")
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
