import { Spot, SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import FormSpot from "./form-spot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function DialogEditSpot({
  spot,
  refetch,
}: {
  spot: Spot;
  refetch: () => void;
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

  return (
    <>
      <FormSpot
        type="Edit"
        form={form}
        spot={spot}
        isLoading={isPendingCreateSpot}
        onSubmit={onSubmit}
        preview={preview}
        setPreview={setPreview}
      />
    </>
  );
}
