import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import type { Preview } from "@/types/general";
import { Input } from "../ui/input";
import { getImageData } from "@/lib/utils";

export default function FormImage<T extends FieldValues>({
  form,
  type,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  type: "Form Profil Kafe" | "Form Dialog";
  name: Path<T>;
  label: string;
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <Field data-invalid={fieldState.invalid}>
            {type === "Form Dialog" && <FieldLabel>{label}</FieldLabel>}

            {preview?.displayUrl && (
              <div className="relative aspect-video overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
                <Image
                  src={preview?.displayUrl}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 960px"
                />
              </div>
            )}

            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary">
              <ImagePlus className="mb-2 size-8 text-primary" />
              <span className="text-sm font-semibold">
                Unggah foto {label} baru
              </span>
              <span className="mt-1 text-xs text-muted-foreground">
                PNG, JPG, atau WebP hingga 5 MB
              </span>

              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => {
                  const imageData = getImageData(event);

                  if (!imageData) return;

                  field.onChange(imageData.file);
                  setPreview?.(imageData);
                }}
              />
            </label>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
