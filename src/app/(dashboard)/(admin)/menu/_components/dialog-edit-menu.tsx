import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { editMenu } from "../action";
import { INITIAL_STATE_SPOT } from "@/constants/spot-constant";
import { Preview } from "@/types/general";
import { toast } from "@/components/ui/toast";
import { Menu, MenuForm, MenuSchemaForm } from "@/validations/menu-validation";
import FormMenu from "./form-menu";

export default function DialogEditMenu({
  menu,
  refetch,
  onSuccess,
}: {
  menu: Menu;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(MenuSchemaForm),
    defaultValues: {
      name: menu.name,
      description: menu.description,
      price: String(menu.price),
      image_url: menu.image_url,
      is_available: menu.is_available,
      category_id: menu.categories.id,
    },
  });

  const [editMenuState, editMenuAction, isPendingEditMenu] = useActionState(
    editMenu,
    INITIAL_STATE_SPOT,
  );

  const [preview, setPreview] = useState<Preview | undefined>(() => {
    const image_url = menu.image_url;

    if (typeof image_url !== "string" || !image_url) {
      return undefined;
    }

    return {
      displayUrl: image_url,
    };
  });

  const hasHandledResult = useRef(false);

  // eslint-disable-next-line react-hooks/refs
  const onSubmit = form.handleSubmit((data) => {
    hasHandledResult.current = false;
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

    formData.append("id", menu.id);
    formData.append("old_image_url", menu.image_url ?? "");

    startTransition(() => {
      editMenuAction(formData);
    });
  });

  useEffect(() => {
    if (
      (editMenuState.status !== "success" &&
        editMenuState.status !== "error") ||
      hasHandledResult.current
    ) {
      return;
    }

    hasHandledResult.current = true;

    if (editMenuState.status === "error") {
      toast.add({
        type: "error",
        title: "Edit Menu gagal",
        description: editMenuState.errors?._form?.[0],
        priority: "high",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Edit Menu berhasil",
      description: "Data Menu berhasil dirubah",
    });

    onSuccess();
    refetch();
  }, [editMenuState, form, onSuccess, refetch]);

  return (
    <>
      <FormMenu
        type="Edit"
        form={form}
        menu={menu}
        isLoading={isPendingEditMenu}
        onSubmit={onSubmit}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
