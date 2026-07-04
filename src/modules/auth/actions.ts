"use server";
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
