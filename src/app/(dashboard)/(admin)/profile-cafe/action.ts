"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { ProfileCafeState } from "@/types/profile-cafe";
import { ProfileCafeSchemaForm } from "@/validations/profile-cafe-validation";

export async function UpdateProfileCafe(
  prevState: ProfileCafeState,
  formData: FormData,
) {
  let validateFields = ProfileCafeSchemaForm.safeParse({
    cafe_name: formData.get("cafe_name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    banner_url: formData.get("banner_url"),
    open_time: formData.get("open_time"),
    close_time: formData.get("close_time"),
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

  if (validateFields.data.banner_url instanceof File) {
    const oldImageUrl = formData.get("old_banner_url") as string;
    const oldPath = oldImageUrl
      ? oldImageUrl.split("/storage/v1/object/public/banner-cafe/")[1]
      : undefined;
    const { errors, data } = await uploadFile(
      "banner-cafe",
      validateFields.data.banner_url,
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
        banner_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profile_cafe")
    .update({
      cafe_name: validateFields.data.cafe_name,
      tagline: validateFields.data.tagline,
      description: validateFields.data.description,
      banner_url: validateFields.data.banner_url,
      open_time: validateFields.data.open_time,
      close_time: validateFields.data.close_time,
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
