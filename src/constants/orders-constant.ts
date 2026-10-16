import {
  OrdersWithItemsForm,
  PaymentForm,
} from "@/validations/orders-validation";

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

export const INITIAL_PAYMENT = {
  received_amount: 0,
} satisfies PaymentForm;

export const INITIAL_STATE_PAYMENT = {
  status: "idle",
  errors: {
    received_amount: [],
    _form: [],
  },
};
