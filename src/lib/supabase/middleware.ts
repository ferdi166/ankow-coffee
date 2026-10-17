import { environment } from "@/configs/environment";
import { USER_ROLES } from "@/constants/user-roles";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { SUPABASE_URL, SUPABASE_KEY } = environment;

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // List of CMS and KDS routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/pesanan-dapur",
    "/profile-cafe",
    "/galeri-spot",
    "/menu",
    "/tables",
    "/pesanan",
    "/kds",
    "/users",
    "/settings",
    "/kds-tablet",
    "/admin",
  ];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // If user is not authenticated and attempts to access protected route
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const { data: profile } = await supabase
      .from("profile_users")
      .select("role")
      .eq("id", user.id)
      .eq("is_active", true)
      .single();

    const url = request.nextUrl.clone();

    if (profile?.role === USER_ROLES.KITCHEN) {
      url.pathname = "/pesanan-dapur";
    } else if (profile?.role === USER_ROLES.ADMIN) {
      url.pathname = "/dashboard";
    } else {
      url.pathname = "/";
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
