export type TableFormState = {
  status?: string;
  errors?: {
    table_number?: string[];
    area_zone?: string[];
    capacity?: string[];
    is_active?: string[];
    _form?: string[];
  };
};
