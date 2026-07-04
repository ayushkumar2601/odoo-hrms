import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { companyName, companyCode, name, email, password } = body;

    if (!companyName || !companyCode || !name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Check if company code exists
    const existingCompany = await prisma.company.findUnique({ where: { code: companyCode } });
    if (existingCompany) {
      return NextResponse.json({ error: "Company code already exists" }, { status: 400 });
    }

    // Transaction to create company and admin user
    const result = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          code: companyCode.toUpperCase(),
        },
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
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Better Auth requires an account if email/password is used
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

      return { company, user };
    });

    return NextResponse.json({ success: true, user: result.user }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
