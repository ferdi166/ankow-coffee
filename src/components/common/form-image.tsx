import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import type { Preview } from "@/types/general";
import { Input } from "../ui/input";
import { getImageData } from "@/lib/utils";

export default function FormImageInput<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
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
            <FieldLabel>{label}</FieldLabel>

            <div className="relative aspect-video overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
              {preview?.displayUrl && (
                <Image
                  src={preview?.displayUrl}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 960px"
                />
              )}
            </div>

            <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary">
              <UploadCloud className="mb-2 size-8 text-primary" />
              <span className="text-sm font-semibold">
                Unggah foto banner baru
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
