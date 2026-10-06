import { useForm } from "react-hook-form";
import FormSpot from "./form-spot";
import { SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_SPOT, INITIAL_STATE_SPOT } from "@/constants/spot-constant";
import { useActionState, useState } from "react";
import { Preview } from "@/types/general";
import { createSpot } from "../action";

export default function DialogTambahSpot({ refetch }: { refetch: () => void }) {
  const form = useForm<SpotForm>({
    resolver: zodResolver(SpotSchemaForm),
    defaultValues: INITIAL_SPOT,
  });

  const [createSpotState, createSpotAction, isPendingCreateSpot] =
    useActionState(createSpot, INITIAL_STATE_SPOT);

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
  });

  return (
    <>
      <FormSpot
        type="Tambah"
        form={form}
        isLoading={isPendingCreateSpot}
        onSubmit={onSubmit}
      />
    </>
  );
}
