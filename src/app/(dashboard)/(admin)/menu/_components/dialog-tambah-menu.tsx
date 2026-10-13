import { useForm } from "react-hook-form";
import { SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Preview } from "@/types/general";
import { createMenu } from "../action";
import { toast } from "@/components/ui/toast";
import FormMenu from "./form-menu";
import { INITIAL_MENU, INITIAL_STATE_MENU } from "@/constants/menu-constant";
import { MenuForm, MenuSchemaForm } from "@/validations/menu-validation";

export default function DialogTambahMenu({
  refetch,
  onSuccess,
}: {
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(MenuSchemaForm),
    defaultValues: INITIAL_MENU,
  });

  const [createMenuState, createMenuAction, isPendingCreateMenu] =
    useActionState(createMenu, INITIAL_STATE_MENU);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === "price") {
        formData.append(key, String(Number(value)));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    startTransition(() => {
      createMenuAction(formData);
    });
  });

  useEffect(() => {
    if (createMenuState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Menu gagal",
        description: createMenuState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (createMenuState.status === "success") {
      toast.add({
        type: "success",
        title: "Tambah Menu berhasil",
        description: "Data Menu berhasil ditambahkan",
      });
      form.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(undefined);
      onSuccess();
      refetch();
    }
  }, [
    createMenuState.errors,
    createMenuState.status,
    form,
    onSuccess,
    refetch,
  ]);

  return (
    <>
      <FormMenu
        type="Tambah"
        form={form}
        isLoading={isPendingCreateMenu}
        onSubmit={onSubmit}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
