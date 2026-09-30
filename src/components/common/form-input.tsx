import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>

          {type === "textarea" ? (
            <Textarea
              {...field}
              id={name}
              placeholder={placeholder}
              autoComplete="off"
              className="resize-none text-sm"
              aria-invalid={fieldState.invalid}
            />
          ) : type === "number" ? (
            <Input
              {...field}
              type="number"
              id={name}
              placeholder={placeholder}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-outer-button]:appearance-none"
              onWheel={(e) => e.currentTarget.blur()}
            />
          ) : (
            <Input
              id={name}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              aria-invalid={fieldState.invalid}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
