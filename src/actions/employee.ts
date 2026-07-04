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

  if (!firstName || !lastName || !email || !role) throw new Error("Missing fields");

  const empId = await generateEmployeeId();

  const newEmp = await prisma.employee.create({
    data: {
      employeeId: empId,
      firstName,
      lastName,
      email,
      role,
      joiningDate: new Date(),
      isActive: true,
    }
  });

  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    await logAudit(session.user.id, "EMPLOYEE_CREATED", `Created employee ${empId}`);
    await createNotification(session.user.id, "Employee Created", `Successfully created employee ${firstName} ${lastName} (${empId})`);
  }

  // Send email (do not await to fail if it fails, or rather wait and log)
  await sendWelcomeEmail(`${firstName} ${lastName}`, empId, role, email);

  revalidatePath("/dashboard/employees");
}

export async function getEmployees() {
  return await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
}