import { Spot, SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import FormSpot from "./form-spot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { editSpot } from "../action";
import { INITIAL_STATE_SPOT } from "@/constants/spot-constant";
import { Preview } from "@/types/general";
import { toast } from "@/components/ui/toast";

export default function DialogEditSpot({
  spot,
  refetch,
  onSuccess,
}: {
  spot: Spot;
  refetch: () => void;
  onSuccess: () => void;
}) {
  const form = useForm<SpotForm>({
    resolver: zodResolver(SpotSchemaForm),
    defaultValues: {
      title: spot.title,
      category_tag: spot.category_tag,
      capacity_text: spot.capacity_text,
      description: spot.description,
      image_url: spot.image_url,
      features: spot.features,
      is_active: spot.is_active,
    },
  });

  const [editSpotState, editSpotAction, isPendingEditSpot] = useActionState(
    editSpot,
    INITIAL_STATE_SPOT,
  );

  const [preview, setPreview] = useState<Preview | undefined>(() => {
    const image_url = spot.image_url;

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
      } else if (key === "features") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value ?? ""));
      }
    });

    formData.append("id", spot.id);
    formData.append("old_image_url", spot.image_url ?? "");

    startTransition(() => {
      editSpotAction(formData);
    });
  });

  useEffect(() => {
    if (
      (editSpotState.status !== "success" &&
        editSpotState.status !== "error") ||
      hasHandledResult.current
    ) {
      return;
    }

    hasHandledResult.current = true;

    if (editSpotState.status === "error") {
      toast.add({
        type: "error",
        title: "Edit Galeri Spot gagal",
        description: editSpotState.errors?._form?.[0],
        priority: "high",
      });

      return;
    }

    toast.add({
      type: "success",
      title: "Edit Galeri Spot berhasil",
      description: "Data spot berhasil dirubah",
    });

    onSuccess();
    refetch();
  }, [editSpotState, form, onSuccess, refetch]);

  return (
    <>
      <FormSpot
        type="Edit"
        form={form}
        spot={spot}
        isLoading={isPendingEditSpot}
        onSubmit={onSubmit}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
