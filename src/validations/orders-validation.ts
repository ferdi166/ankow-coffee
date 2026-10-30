import z from "zod";

export const OrderItemFormSchema = z.object({
  menu_item_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const OrdersWithItemsSchemaForm = z
  .object({
    customer_name: z.string().optional(),
    table_id: z.string().uuid().nullable(),
    order_type: z.enum(["Dine In", "Takeaway"]),
    items: z.array(OrderItemFormSchema).min(1, "Minimal pilih satu menu"),
  })
  .superRefine((data, context) => {
    if (data.order_type === "Takeaway" && !data.customer_name?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customer_name"],
        message: "Nama pelanggan wajib diisi untuk Takeaway",
      });
    }
  });

export type OrderItemForm = z.infer<typeof OrderItemFormSchema>;
export type OrdersWithItemsForm = z.infer<typeof OrdersWithItemsSchemaForm>;

const TableSchema = z.object({
  id: z.string(),
  table_number: z.string(),
  area_zone: z.string(),
});

const OrderItemSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  unit_price: z.number(),
  subtotal: z.number(),
  notes: z.string().nullable(),
  menu_items: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const OrdersWithItemsSchema = z.object({
  id: z.string(),
  order_number: z.string(),
  table_id: z.string().nullable(),
  customer_name: z.string(),
  order_type: z.string(),
  total_amount: z.number(),
  received_amount: z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
  change_amount: z
    .number()
    .nullable()
    .transform((value) => value ?? 0),
  order_status: z.string(),
  payment_status: z.string(),
  payment_method: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  tables: TableSchema.nullable(),
  order_items: z.array(OrderItemSchema),
});

export type OrdersWithItems = z.infer<typeof OrdersWithItemsSchema>;

export const PaymentSchemaForm = z.object({
  received_amount: z.string().min(1, "Nominal pembayaran wajib diisi"),
});

export type PaymentForm = z.infer<typeof PaymentSchemaForm>;
