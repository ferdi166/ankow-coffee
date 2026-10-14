import { startTransition, useActionState, useEffect } from "react";
import { hapusMeja } from "../action";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "@/components/ui/toast";
import DialogHapus from "@/components/common/dialog-hapus";
import { Table } from "@/validations/table-validation";

export default function DialogHapusMeja({
  meja,
  refetch,
  onSuccess,
}: {
  meja: Table;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const [hapusMejaState, hapusMejaAction, isPendingHapusMeja] = useActionState(
    hapusMeja,
    INITIAL_STATE_ACTION,
  );

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", meja!.id as string);

    startTransition(() => {
      hapusMejaAction(formData);
    });
  };

  useEffect(() => {
    if (hapusMejaState.status === "error") {
      toast.add({
        type: "error",
        title: "Hapus Meja gagal",
        description: hapusMejaState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (hapusMejaState.status === "success") {
      toast.add({
        type: "success",
        title: "Hapus Meja berhasil",
        description: "Data Meja berhasil dihapus",
      });
      onSuccess();
      refetch();
    }
  }, [hapusMejaState.errors, hapusMejaState.status, onSuccess, refetch]);

  return (
    <DialogHapus
      title="Menu"
      description={
        <>
          Apakah Anda yakin ingin menghapus meja{" "}
          <span className="font-semibold text-foreground">
            {meja.table_number}
          </span>
          ? Data meja akan dihapus secara permanen.
        </>
      }
      onSubmit={onSubmit}
      isLoading={isPendingHapusMeja}
    />
  );
}
