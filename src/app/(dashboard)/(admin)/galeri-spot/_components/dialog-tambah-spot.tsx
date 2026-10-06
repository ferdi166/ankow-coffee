import { useForm } from "react-hook-form";
import FormSpot from "./form-spot";
import { SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_SPOT, INITIAL_STATE_SPOT } from "@/constants/spot-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Preview } from "@/types/general";
import { createSpot } from "../action";
import { toast } from "@/components/ui/toast";

export default function DialogTambahSpot({
  refetch,
  onSuccess,
}: {
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<SpotForm>({
    resolver: zodResolver(SpotSchemaForm),
    defaultValues: INITIAL_SPOT,
  });

  const [createSpotState, createSpotAction, isPendingCreateSpot] =
    useActionState(createSpot, INITIAL_STATE_SPOT);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === "features") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    startTransition(() => {
      createSpotAction(formData);
    });
  });

  useEffect(() => {
    if (createSpotState.status === "error") {
      toast.add({
        type: "error",
        title: "Tambah Galeri Spot gagal",
        description: createSpotState.errors?._form?.[0],
        priority: "high",
      });
    }

    if (createSpotState.status === "success") {
      toast.add({
        type: "success",
        title: "Tambah Galeri Spot berhasil",
        description: "Data spot berhasil ditambahkan",
      });
      form.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(undefined);
      onSuccess();
      refetch();
    }
  }, [createSpotState, form, onSuccess, refetch]);

  return (
    <>
      <FormSpot
        type="Tambah"
        form={form}
        isLoading={isPendingCreateSpot}
        onSubmit={onSubmit}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
