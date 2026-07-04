"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { logAudit } from "./audit";
import { createNotification } from "./notification";

export async function registerEmployeeAccount(employeeId: string, email: string, password: string) {
  try {
    // 1. Verify Employee ID exists and is active
    const employee = await prisma.employee.findUnique({
      where: { employeeId }
    });

    if (!employee) return { error: "Invalid Employee ID" };
    if (!employee.isActive) return { error: "Employee profile is inactive" };
    if (employee.userId) return { error: "This Employee ID is already linked to an account" };
    if (employee.email !== email) return { error: "Email does not match the registered employee profile" };

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return { error: "An account with this email already exists" };

    // 3. Create User and Account manually for Better Auth compatibility
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const fullName = `${employee.firstName} ${employee.lastName}`;

    await prisma.$transaction(async (tx) => {
      // Create User with role from Employee
      const newUser = await tx.user.create({
        data: {
          id: userId,
          name: fullName,
          email,
          emailVerified: true,
          role: employee.role,
          mustChangePassword: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Create Credential Account
      await tx.account.create({
        data: {
          id: uuidv4(),
          accountId: newUser.id,
          providerId: "credential",
          userId: newUser.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Link Employee to User
      await tx.employee.update({
        where: { id: employee.id },
        data: { userId: newUser.id }
      });

      // Log Audit
      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: "EMPLOYEE_CREATED",
          metadata: `Account registered and linked to ${employeeId}`
        }
      });

      // Create Notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: "Welcome to Zindle",
          message: `Your account has been successfully linked to your employee profile (${employeeId}).`
        }
      });
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Signup error:", error);
    return { error: "An unexpected error occurred during signup." };
  }
}
