const fs = require('fs');
const path = require('path');

const files = {
  'src/middleware.ts': `import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";

const protectedRoutes = {
  ADMIN: ["/dashboard/admin", "/employees", "/departments"],
  HR: ["/dashboard/admin", "/employees"],
  EMPLOYEE: ["/dashboard/employee", "/profile"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/employees") || pathname.startsWith("/profile")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Check mustChangePassword
  const user = session.user as any;
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
`,
  'src/modules/auth/actions.ts': `"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function registerOrganizationAction(data: any) {
  const { companyName, name, email, phone, password } = data;
  
  const companyCode = companyName.substring(0, 2).toUpperCase(); // simplified

  // create company & user transaction
  const result = await prisma.$transaction(async (tx: any) => {
    const company = await tx.company.create({
      data: { name: companyName, code: companyCode },
    });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = await tx.user.create({
      data: {
        id: userId,
        name,
        email,
        emailVerified: false,
        role: "ADMIN",
        companyId: company.id,
        mustChangePassword: false, // Admin doesn't need force reset on reg
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.account.create({
      data: {
        id: uuidv4(),
        accountId: userId,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await tx.auditLog.create({
       data: {
         action: "COMPANY_REGISTERED",
         userId: user.id,
         metadata: JSON.stringify({ companyId: company.id })
       }
    });

    return { company, user };
  });

  return { success: true, user: result.user };
}
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}
