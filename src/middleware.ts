import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";

const protectedRoutes = {
  ADMIN: [
    "/dashboard/admin", 
    "/dashboard/employees", 
    "/dashboard/attendance", 
    "/dashboard/leave", 
    "/dashboard/payroll", 
    "/dashboard/profile", 
    "/dashboard/settings"
  ],
  HR: [
    "/dashboard/hr", 
    "/dashboard/employees", 
    "/dashboard/attendance", 
    "/dashboard/leave", 
    "/dashboard/profile"
  ],
  EMPLOYEE: [
    "/dashboard/employee", 
    "/dashboard/profile", 
    "/dashboard/attendance", 
    "/dashboard/leave", 
    "/dashboard/payroll"
  ],
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

  // Unauthenticated user trying to access /dashboard
  if (!data || !data.session) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  const user = data.user;
  const role = user.role as "ADMIN" | "HR" | "EMPLOYEE";

  // Redirect authenticated users away from public auth pages
  if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
    const defaultRoute = role === "ADMIN" ? "/dashboard/admin" : role === "HR" ? "/dashboard/hr" : "/dashboard/employee";
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // RBAC checks for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const allowedRoutes = protectedRoutes[role] || [];
    const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));
    
    if (!isAllowed) {
       return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
