"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../action";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

// Native Zod resolver for react-hook-form without extra dependencies
const customZodResolver = async (values: LoginForm) => {
  const result = loginSchemaForm.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const fieldName = issue.path[0] as string;
    if (!errors[fieldName]) {
      errors[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }
  }

  return { values: {}, errors };
};

export default function Login() {
  const form = useForm<LoginForm>({
    resolver: customZodResolver,
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM,
  );

  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    startTransition(() => {
      loginAction(formData);
    });
  });

  return (
    <Card className="border-border shadow-sm bg-white">
      <CardHeader className="space-y-1.5 pb-4">
        <CardTitle className="text-xl font-bold text-card-foreground">
          Masuk ke Akun
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Akses CMS Admin atau Live KDS Dapur menggunakan akun staf terdaftar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Server-Side Form Error Banner */}
          {loginState?.errors?._form && loginState.errors._form.length > 0 && (
            <div className="flex animate-in items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive duration-200 fade-in-50">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{loginState.errors._form[0]}</span>
            </div>
          )}

          <FormInput
            form={form}
            type="email"
            name="email"
            label="Email Staf"
            placeholder="nama@ankowcoffee.id"
          />

          <FormInput
            form={form}
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
          />

          <Button
            type="submit"
            disabled={isPendingLogin}
            className="h-10 w-full cursor-pointer bg-primary text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60">
            {isPendingLogin ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Memverifikasi...
              </span>
            ) : (
              "Masuk Sekarang"
            )}
          </Button>

          {/* Link back to Home */}
          {/* <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-[#796E65] hover:text-[#1E1012] transition-colors">
              <ArrowLeft className="size-3" />
              Kembali ke Halaman Utama
            </Link>
          </div> */}
        </form>
      </CardContent>
    </Card>
  );
}
