import FormInput from "@/components/common/form-input";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

export default function CustomerField<T extends FieldValues>({
  form,
}: Props<T>) {
  return (
    <div className="mt-3">
      <FormInput
        form={form}
        name={"customer_name" as Path<T>}
        label="Nama Pelanggan"
        placeholder="Masukkan nama pelanggan"
      />
    </div>
  );
}
