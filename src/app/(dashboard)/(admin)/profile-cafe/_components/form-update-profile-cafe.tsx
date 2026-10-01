import {
  ProfileCafe,
  ProfileCafeForm,
  ProfileCafeSchemaForm,
} from "@/validations/profile-cafe-validation";
import FormProfileCafe from "./form-profile-cafe";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { updateProfileCafe } from "../action";
import { INITIAL_STATE_PROFILE_CAFE } from "@/constants/profile-cafe-constant";
import { Preview } from "@/types/general";
import { toast } from "@/components/ui/toast";

export default function FormUpdateProfileCafe({
  profile_cafe,
  refetch,
}: {
  profile_cafe: ProfileCafe;
  refetch?: () => void;
}) {
  const form = useForm<ProfileCafeForm>({
    resolver: zodResolver(ProfileCafeSchemaForm),
    defaultValues: {
      cafe_name: profile_cafe.cafe_name,
      tagline: profile_cafe.tagline,
      description: profile_cafe.description,
      banner_url: profile_cafe.banner_url,
      open_time: profile_cafe.open_time,
      close_time: profile_cafe.close_time,
    },
  });

  const [
    updateProfileCafeState,
    updateProfileCafeAction,
    isPendingUpdateProfileCafe,
  ] = useActionState(updateProfileCafe, INITIAL_STATE_PROFILE_CAFE);

  const [preview, setPreview] = useState<Preview | undefined>(() => {
    const bannerUrl = profile_cafe.banner_url;

    if (typeof bannerUrl !== "string" || !bannerUrl) {
      return undefined;
    }

    return {
      displayUrl: bannerUrl,
    };
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    formData.append("id", profile_cafe.id);
    formData.append("old_banner_url", profile_cafe.banner_url ?? "");

    startTransition(() => {
      updateProfileCafeAction(formData);
    });
  });

  useEffect(() => {
    if (updateProfileCafeState.status === "error") {
      toast.add({
        type: "error",
        title: "Update Profile Cafe gagal",
        description: updateProfileCafeState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (updateProfileCafeState.status === "success") {
      toast.add({
        type: "success",
        title: "Update Profile Cafe berhasil",
        description: "Data profil kafe berhasil",
      });
      refetch?.();
    }
  }, [updateProfileCafeState, refetch]);

  return (
    <FormProfileCafe
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingUpdateProfileCafe}
      preview={preview}
      setPreview={setPreview}
    />
  );
}
