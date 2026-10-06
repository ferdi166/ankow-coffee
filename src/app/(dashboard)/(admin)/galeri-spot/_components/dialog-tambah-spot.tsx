import { useForm } from "react-hook-form";
import FormSpot from "./form-spot";
import { SpotForm, SpotSchemaForm } from "@/validations/spot-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { INITIAL_SPOT } from "@/constants/spot-constant";

export default function DialogTambahSpot() {
  const form = useForm<SpotForm>({
    resolver: zodResolver(SpotSchemaForm),
    defaultValues: INITIAL_SPOT,
  });
  return (
    <>
      <FormSpot type="Tambah" form={form} />
    </>
  );
}
