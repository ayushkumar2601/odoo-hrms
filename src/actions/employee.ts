"use server";
import { prisma } from "@/lib/prisma";
import { generateEmployeeId } from "@/lib/id-generator";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sendWelcomeEmail } from "@/lib/email/send-email";
import { logAudit } from "./audit";
import { createNotification } from "./notification";

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!firstName || !lastName || !email || !role) {
    throw new Error("Missing required fields: first name, last name, email, or role.");
  }

  // Check if an employee with this email already exists
  const existingEmp = await prisma.employee.findUnique({
    where: { email }
  });

  let empId = "";
  if (existingEmp) {
    empId = existingEmp.employeeId;
    await prisma.employee.update({
      where: { email },
      data: {
        firstName,
        lastName,
        role,
        isActive: true,
      }
    });
  } else {
    empId = await generateEmployeeId();
    
    // Check if a User account already exists with this email and is not linked yet
    const existingUser = await prisma.user.findUnique({ where: { email } });
    let connectUser = undefined;
    if (existingUser) {
      const userAlreadyLinked = await prisma.employee.findUnique({ where: { userId: existingUser.id } });
      if (!userAlreadyLinked) {
        connectUser = { connect: { id: existingUser.id } };
      }
    }

    await prisma.employee.create({
      data: {
        employeeId: empId,
        firstName,
        lastName,
        email,
        role,
        joiningDate: new Date(),
        isActive: true,
        ...(connectUser ? { user: connectUser } : {})
      }
    });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    const actionType = existingEmp ? "EMPLOYEE_UPDATED" : "EMPLOYEE_CREATED";
    const actionMsg = `${existingEmp ? "Updated" : "Created"} employee ${firstName} ${lastName} (${empId})`;
    await logAudit(session.user.id, actionType, actionMsg);
    await createNotification(session.user.id, existingEmp ? "Employee Updated" : "Employee Created", actionMsg);
  }

  // Send welcome email reliably without failing the transaction if network lags
  try {
    await sendWelcomeEmail(`${firstName} ${lastName}`, empId, role, email);
  } catch (emailErr) {
    console.error("Notice: Welcome email delivery encountered an error:", emailErr);
  }

  revalidatePath("/dashboard/employees");
}

export async function getEmployees() {
  return await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
}