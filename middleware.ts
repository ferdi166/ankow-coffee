import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images)
     * Feel free to modify this pattern to include more paths.
     */
    "/dashboard/:path*",
    "/menu/:path*",
    "/meja/:path*",
    "/pesanan/:path*",
    "/galeri-spot/:path*",
    "/profile-cafe/:path*",
    "/login",
  ],
};
