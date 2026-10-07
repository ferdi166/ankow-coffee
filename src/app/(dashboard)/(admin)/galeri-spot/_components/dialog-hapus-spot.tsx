import { Spot } from "@/validations/spot-validation";
import { startTransition, useActionState, useEffect } from "react";
import { hapusSpot } from "../action";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "@/components/ui/toast";
import DialogHapus from "@/components/common/dialog-hapus";

export default function DialogHapusSpot({
  spot,
  refetch,
  onSuccess,
}: {
  spot: Spot;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const [hapusSpotState, hapusSpotAction, isPendingHapusSpot] = useActionState(
    hapusSpot,
    INITIAL_STATE_ACTION,
  );

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", spot!.id as string);
    formData.append("image_url", spot!.image_url as string);

    startTransition(() => {
      hapusSpotAction(formData);
    });
  };

  useEffect(() => {
    if (hapusSpotState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Galeri Spot gagal",
        description: hapusSpotState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (hapusSpotState.status === "success") {
      toast.add({
        type: "success",
        title: "Hapus Spot berhasil",
        description: "Data spot berhasil dihapus",
      });
      onSuccess();
      refetch();
    }
  }, [hapusSpotState.errors, hapusSpotState.status, onSuccess, refetch]);

  return (
    <DialogHapus
      title="Spot"
      description={
        <>
          Apakah Anda yakin ingin menghapus spot{" "}
          <span className="font-semibold text-foreground">{spot.title}</span>?
          Data spot dan gambar terkait akan dihapus secara permanen.
        </>
      }
      onSubmit={onSubmit}
      isLoading={isPendingHapusSpot}
    />
  );
}
