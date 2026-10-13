import { useForm } from "react-hook-form";
import FormSpot from "./form-spot";
import { SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_SPOT, INITIAL_STATE_SPOT } from "@/constants/spot-constant";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Preview } from "@/types/general";
import { createSpot } from "../action";
import { toast } from "@/components/ui/toast";
import FormMenu from "./form-menu";

export default function DialogTambahMenu({
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

  const [preview, setPreview] = useState<Preview | undefined>(undefined);

  return (
    <>
      <FormMenu
        type="Tambah"
        form={form}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
