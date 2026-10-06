import z from "zod";

const FacilitySchema = z.object({
  icon: z.string().min(1, "Icon fasilitas wajib diisi"),
  label: z.string().min(1, "Label fasilitas wajib diisi"),
});

export const SpotSchemaForm = z.object({
  title: z.string().min(1, "Title wajib diisi"),
  category_tag: z.string().min(1, "Kategori Area wajib diisi"),
  capacity_text: z.string().min(1, "Kapasitas wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  image_url: z.union([z.string(), z.instanceof(File)]),
  features: z.array(FacilitySchema).min(1, "Pilih minimal satu fasilitas"),
  is_active: z.boolean(),
});

export type SpotForm = z.infer<typeof SpotSchemaForm>;
export type Spot = z.infer<typeof SpotSchemaForm> & { id: string };
