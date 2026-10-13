import { Spot } from "@/validations/spot-validation";
import { startTransition, useActionState, useEffect } from "react";
import { hapusMenu } from "../action";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "@/components/ui/toast";
import DialogHapus from "@/components/common/dialog-hapus";
import { Menu } from "@/validations/menu-validation";

export default function DialogHapusMenu({
  menu,
  refetch,
  onSuccess,
}: {
  menu: Menu;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const [hapusMenuState, hapusMenuAction, isPendingHapusMenu] = useActionState(
    hapusMenu,
    INITIAL_STATE_ACTION,
  );

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", menu!.id as string);
    formData.append("image_url", menu!.image_url as string);

    startTransition(() => {
      hapusMenuAction(formData);
    });
  };

  useEffect(() => {
    if (hapusMenuState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Menu gagal",
        description: hapusMenuState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (hapusMenuState.status === "success") {
      toast.add({
        type: "success",
        title: "Hapus Menu berhasil",
        description: "Data Menu berhasil dihapus",
      });
      onSuccess();
      refetch();
    }
  }, [hapusMenuState.errors, hapusMenuState.status, onSuccess, refetch]);

  return (
    <DialogHapus
      title="Menu"
      description={
        <>
          Apakah Anda yakin ingin menghapus menu{" "}
          <span className="font-semibold text-foreground">{menu.name}</span>?
          Data menu dan gambar terkait akan dihapus secara permanen.
        </>
      }
      onSubmit={onSubmit}
      isLoading={isPendingHapusMenu}
    />
  );
}
