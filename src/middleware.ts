import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";

const protectedRoutes = {
  ADMIN: ["/dashboard/admin", "/employees", "/departments"],
  HR: ["/dashboard/admin", "/employees"],
  EMPLOYEE: ["/dashboard/employee", "/profile"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data } = await betterFetch<{ session: Session, user: any }>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!data || !data.session) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/employees") || pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Check mustChangePassword
  const user = data.user;
  if (user?.mustChangePassword && pathname !== "/change-password" && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  if (pathname === "/login" || pathname === "/organization-register") {
    const defaultRoute = user.role === "EMPLOYEE" ? "/dashboard/employee" : "/dashboard/admin";
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // RBAC
  const role = user.role as "ADMIN" | "HR" | "EMPLOYEE";
  const allowedRoutes = protectedRoutes[role] || [];
  
  const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));
  
  if (!isAllowed && (pathname.startsWith("/dashboard") || pathname.startsWith("/employees") || pathname.startsWith("/profile"))) {
     return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
