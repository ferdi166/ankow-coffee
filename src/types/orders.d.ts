import { OrdersWithItems } from "@/validations/orders-validation";

export type OrdersFormState = {
  status?: string;
  data?: {
    order_id: string;
  };
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    order_type?: string[];
    items?: string[];
    _form?: string[];
  };
};

export type PaymentSuccessData = Pick<
  OrdersWithItems,
  "received_amount" | "change_amount" | "payment_method"
>;

export type PaymentFormState = {
  status?: string;
  data?: PaymentSuccessData;
  errors?: {
    received_amount?: string[];
    _form?: string[];
  };
};

export type UpdateOrderStatusInput = Pick<
  OrdersWithItems,
  "id" | "order_status"
>;
