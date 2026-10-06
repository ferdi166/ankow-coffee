export type SpotFormState = {
  status?: string;
  errors?: {
    id?: string[];
    title?: string[];
    category_tag?: string[];
    capacity_text?: string[];
    description?: string[];
    image_url?: string[];
    features?: string[];
    is_active?: string[];
    _form?: string[];
  };
};
