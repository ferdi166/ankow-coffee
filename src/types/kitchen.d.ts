export type KitchenOrder = Pick<
  OrdersWithItems,
  | "id"
  | "order_number"
  | "order_status"
  | "notes"
  | "created_at"
  | "tables"
  | "order_items"
>;
