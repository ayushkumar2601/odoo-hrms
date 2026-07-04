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
    "/dashboard/settings",
    "/dashboard/audit-logs",
    "/dashboard/copilot",
    "/dashboard/reports",
    "/dashboard/analytics"
  ],
  HR: [
    "/dashboard/hr", 
    "/dashboard/employees", 
    "/dashboard/attendance", 
    "/dashboard/leave", 
    "/dashboard/profile",
    "/dashboard/copilot",
    "/dashboard/reports",
    "/dashboard/analytics"
  ],
  EMPLOYEE: [
    "/dashboard/employee", 
    "/dashboard/profile", 
    "/dashboard/attendance", 
    "/dashboard/leave", 
    "/dashboard/payroll",
    "/dashboard/copilot",
    "/dashboard/reports"
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

  // Define protected route prefixes
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                           pathname.startsWith("/attendance") || 
                           pathname.startsWith("/leave") || 
                           pathname.startsWith("/payroll") || 
                           pathname.startsWith("/profile");

  // Unauthenticated user trying to access a protected route
  if (!data || !data.session) {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }
    return NextResponse.next();
  }

  const user = data.user;
  console.log("Middleware user object:", user);

  // Force password change check
  if (user.mustChangePassword && pathname !== "/change-password" && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  const role = user.role as "ADMIN" | "HR" | "EMPLOYEE";

  // Redirect authenticated users away from public auth pages or the base dashboard route
  if (pathname === "/" || pathname === "/signin" || pathname === "/signup" || pathname === "/dashboard") {
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
