"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { SpotFormState } from "@/types/spot";
import { SpotSchemaForm } from "@/validations/spot-validation";

export async function createSpot(prevState: SpotFormState, formData: FormData) {
  let validateFields = SpotSchemaForm.safeParse({
    title: formData.get("title"),
    category_tag: formData.get("category_tag"),
    capacity_text: formData.get("capacity_text"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    features: JSON.parse(String(formData.get("features") ?? "[]")),
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

  if (validateFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      "galleries",
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

  const { error } = await supabase.from("galleries").insert({
    title: validateFields.data.title,
    category_tag: validateFields.data.category_tag,
    capacity_text: validateFields.data.capacity_text,
    description: validateFields.data.description,
    image_url: validateFields.data.image_url,
    features: validateFields.data.features,
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
