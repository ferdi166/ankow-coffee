export type OrdersFormState = {
  status?: string;
  errors?: {
    customer_name?: string[];
    table_id?: string[];
    order_type?: string[];
    items?: string[];
    _form?: string[];
  };
};
