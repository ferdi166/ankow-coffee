import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

export default function FormSwitch<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          orientation="horizontal"
          data-invalid={fieldState.invalid}
          className="items-center justify-between border-t pt-4">
          <div>
            <FieldLabel>Tampilkan di Website</FieldLabel>
            <FieldDescription>
              Spot langsung terlihat publik pada galeri landing page
            </FieldDescription>
          </div>

          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
        </Field>
      )}
    />
  );
}
