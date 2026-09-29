import { LoginForm } from "@/validations/auth-validation";

export const INITIAL_LOGIN_FORM: LoginForm = {
  email: "",
  password: "",
};

export interface LoginActionState {
  status: "idle" | "success" | "error";
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
}

export const INITIAL_STATE_LOGIN_FORM: LoginActionState = {
  status: "idle",
  errors: {},
  message: "",
};
