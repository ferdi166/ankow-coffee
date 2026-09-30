"use server";

import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth-constant";
import { USER_ROLES } from "@/constants/user-roles";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: AuthFormState, formData: FormData) {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validateFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      errors: {
        ...validateFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validateFields.data);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  if (!user) {
    return {
      status: "error",
      errors: {
        _form: ["Data user tidak ditemukan."],
      },
    };
  }

  const { data: profile } = await supabase
    .from("profile_users")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (profile) {
    const cookiesStore = await cookies();
    cookiesStore.set("user_profile", JSON.stringify(profile), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (profile?.is_active !== true) {
    await supabase.auth.signOut();

    return {
      status: "error",
      errors: {
        _form: ["Akun tidak aktif"],
      },
    };
  }

  const role = profile.role;

  if (role === USER_ROLES.ADMIN) {
    redirect("/dashboard");
  } else if (role === USER_ROLES.BARISTA_KITCHEN) {
    redirect("/kitchen");
  } else {
    redirect("/");
  }
}
