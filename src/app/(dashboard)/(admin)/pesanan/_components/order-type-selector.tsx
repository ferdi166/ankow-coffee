import { Button } from "@/components/ui/button";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

export default function OrderTypeSelector<T extends FieldValues>({
  form,
}: Props<T>) {
  return (
    <Controller
      control={form.control}
      name={"order_type" as Path<T>}
      render={({ field, fieldState }) => (
        <div>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
            <Button
              type="button"
              variant={field.value === "Takeaway" ? "default" : "ghost"}
              onClick={() => field.onChange("Takeaway")}>
              Takeaway
            </Button>

            <Button
              type="button"
              variant={field.value === "Dine In" ? "default" : "ghost"}
              onClick={() => field.onChange("Dine In")}>
              Dine-In (Meja)
            </Button>
          </div>

          {fieldState.error && (
            <p className="mt-1 text-xs text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
