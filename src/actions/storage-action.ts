"use server";

import { environment } from "@/configs/environment";
import { createClient } from "@/lib/supabase/server";

export async function uploadFile(
  bucket: string,
  file: File,
  folder?: string,
  prevPath?: string,
) {
  const supabase = await createClient();

  const fileName = `${Date.now()}-${file.name}`;
  const newPath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage.from(bucket).upload(newPath, file);
  if (error) {
    return {
      status: "errors",
      errors: {
        _form: [error.message],
      },
    };
  }

  if (prevPath) {
    const { error } = await supabase.storage.from(bucket).remove([prevPath]);
    if (error) {
      return {
        status: "errors",
        errors: {
          _form: [error.message],
        },
      };
    }
  }

  return {
    status: "success",
    data: {
      url: `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
      path: newPath,
    },
  };
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return {
      status: "errors",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
