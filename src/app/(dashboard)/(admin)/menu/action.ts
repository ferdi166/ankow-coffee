"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { MenuSchemaForm } from "@/validations/menu-validation";

export async function createMenu(prevState: MenuFormState, formData: FormData) {
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
    const { errors, data } = await uploadFile(
      "menu",
      validateFields.data.image_url,
      undefined,
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

  const { error } = await supabase.from("menu").insert({
    name: validateFields.data.name,
    description: validateFields.data.description,
    price: validateFields.data.price,
    image_url: validateFields.data.image_url,
    category_id: validateFields.data.category_id,
    is_available: validateFields.data.is_available,
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
