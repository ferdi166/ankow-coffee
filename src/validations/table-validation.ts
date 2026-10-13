import z from "zod";

export const TableSchemaForm = z.object({
  table_number: z.string().min(1, "Nama Menu wajib diisi"),
  area_zone: z.string().min(1, "Area Zone wajib diisi"),
  capacity: z.string().min(1, "Capacity wajib diisi"),
  is_active: z.boolean(),
  qr_code_url: z.string().optional(),
});

export type TableForm = z.infer<typeof TableSchemaForm>;
export type Table = z.infer<typeof TableSchemaForm> & {
  id: string;
  qr_code_url: string;
};
