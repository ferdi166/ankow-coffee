import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CAPACITY_OPTIONS = ["2", "4", "6", "custom"];

export default function FormCapacity<T extends FieldValues>({
  form,
  name,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
}) {
  const initialValue = String(form.getValues(name) ?? "");
  const [isCustomSelected, setIsCustomSelected] = useState(
    Boolean(initialValue) &&
      !CAPACITY_OPTIONS.slice(0, -1).includes(initialValue),
  );

  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const isPresetValue = CAPACITY_OPTIONS.slice(0, -1).includes(
          String(field.value),
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Kapasitas Tempat Duduk *</FieldLabel>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CAPACITY_OPTIONS.map((option) => {
                const isSelected =
                  option === "custom"
                    ? isCustomSelected
                    : !isCustomSelected && String(field.value) === option;

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
                        setIsCustomSelected(true);

                        if (isPresetValue) {
                          field.onChange("");
                        }

                        return;
                      }

                      setIsCustomSelected(false);
                      field.onChange(option);
                    }}>
                    {option === "custom" ? "Kustom" : `${option} Pax`}
                  </button>
                );
              })}
            </div>

            {isCustomSelected && (
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
