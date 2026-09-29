export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    full_name?: string[];
    role?: string[];
    _form?: string[];
  };
};

export type ProfileUser = {
  id?: string;
  full_name?: string;
  role?: UserRole;
};
