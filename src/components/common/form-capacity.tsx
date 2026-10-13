import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const CAPACITY_OPTIONS = ["2", "4", "6", "custom"];

export default function FormCapacity<T extends FieldValues>({
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
      render={({ field, fieldState }) => {
        const isCustom =
          field.value &&
          !CAPACITY_OPTIONS.slice(0, -1).includes(String(field.value));

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Kapasitas Tempat Duduk *</FieldLabel>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CAPACITY_OPTIONS.map((option) => {
                const isSelected =
                  option === "custom"
                    ? isCustom
                    : String(field.value) === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`h-10 rounded-xl border text-sm transition-colors ${
                      isSelected
                        ? "border-espresso bg-espresso font-semibold text-white"
                        : "border-border bg-background text-muted-foreground hover:bg-muted"
                    }`}
                    onClick={() => {
                      if (option === "custom") {
                        field.onChange("");
                      } else {
                        field.onChange(option);
                      }
                    }}>
                    {option === "custom" ? "Kustom" : `${option} Pax`}
                  </button>
                );
              })}
            </div>

            {isCustom && (
              <Input
                type="number"
                min={1}
                placeholder="Masukkan kapasitas"
                value={field.value ?? ""}
                onChange={(event) => field.onChange(event.target.value)}
                className="mt-2"
              />
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
