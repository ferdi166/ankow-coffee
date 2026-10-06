import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { FACILITY_LIST } from "@/constants/facility-constant";
import { Facility } from "@/types/galeri-spot";

export default function FormFacilities<T extends FieldValues>({
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
      defaultValue={[] as T[Path<T>]}
      render={({ field }) => {
        const selectedFacilities = (field.value ?? []) as Facility[];

        return (
          <Field>
            <FieldLabel>Fasilitas</FieldLabel>

            <div className="grid grid-cols-2 gap-3 rounded-lg border p-3">
              {FACILITY_LIST.map((facility) => {
                const checked = selectedFacilities.some(
                  (item) => item.icon === facility.icon,
                );

                return (
                  <label
                    key={facility.value}
                    className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) => {
                        const nextFacilities = value
                          ? [
                              ...selectedFacilities,
                              {
                                icon: facility.icon,
                                label: facility.label,
                              },
                            ]
                          : selectedFacilities.filter(
                              (item) => item.icon !== facility.icon,
                            );

                        field.onChange(nextFacilities);
                      }}
                    />

                    {facility.label}
                  </label>
                );
              })}
            </div>
          </Field>
        );
      }}
    />
  );
}
