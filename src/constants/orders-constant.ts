import { OrdersWithItemsForm } from "@/validations/orders-validation";

export const INITIAL_ORDERS: OrdersWithItemsForm = {
  customer_name: "",
  order_type: "Takeaway",
  table_id: null,
  items: [],
};

export const INITIAL_STATE_ORDERS = {
  status: "idle",
  errors: {
    customer_name: [],
    order_type: [],
    table_id: [],
    items: [],
    _form: [],
  },
};
