import z from "zod";

const CategorySchema = z.object({
  category_id: z.string(),
  name: z.string(),
});

export const MenuFormSchema = z.object({
  name: z.string().min(1, "Nama Menu wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.number().min(1, "Harga wajib diisi"),
  image_url: z.union([z.string(), z.instanceof(File)]),
  is_available: z.boolean(),
  category_id: z.string(),
});

export const MenuSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image_url: z.string(),
  is_available: z.boolean(),
  categories: z.array(CategorySchema),
});

export type MenuForm = z.infer<typeof MenuFormSchema>;
export type Menu = z.infer<typeof MenuSchema> & { id: string };
