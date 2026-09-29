"use server";

import { createClient } from "@/lib/supabase/server";
import { USER_ROLES } from "@/constants/user-roles";
import { loginSchemaForm } from "@/validations/auth-validation";
import { LoginActionState } from "@/constants/auth-constant";
import { redirect } from "next/navigation";

export async function login(
  _prevState: LoginActionState | null,
  formData: FormData,
): Promise<LoginActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchemaForm.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      errors: {
        email: fieldErrors.email,
        password: fieldErrors.password,
      },
      message: "Periksa kembali input data Anda.",
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !user) {
    return {
      status: "error",
      errors: {
        _form: [
          authError?.message === "Invalid login credentials"
            ? "Email atau password yang Anda masukkan salah."
            : authError?.message || "Gagal masuk ke sistem. Silakan coba lagi.",
        ],
      },
      message: "Autentikasi gagal.",
    };
  }

  // Fetch profile to verify role and status
  const { data: profile } = await supabase
    .from("profile_users")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    return {
      status: "error",
      errors: {
        _form: [
          "Akun Anda telah dinonaktifkan. Silakan hubungi Administrator.",
        ],
      },
      message: "Akun nonaktif.",
    };
  }

  const role = profile?.role || user.user_metadata?.role;

  if (role === USER_ROLES.BARISTA_KITCHEN) {
    redirect("/kds");
  } else {
    redirect("/dashboard");
  }
}

export const loginAction = login;

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profile_users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile || null;
}
