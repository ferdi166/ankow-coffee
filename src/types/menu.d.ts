export type MenuFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    price?: string[];
    image_url?: string[];
    is_available?: string[];
    category_id?: string[];
    _form?: string[];
  };
};
