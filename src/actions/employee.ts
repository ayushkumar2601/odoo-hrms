"use server";
import { prisma } from "@/lib/prisma";
import { generateEmployeeId } from "@/lib/id-generator";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  if (!firstName || !lastName || !email || !role) throw new Error("Missing fields");

  const empId = await generateEmployeeId();

  await prisma.employee.create({
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

  revalidatePath("/dashboard/employees");
}

export async function getEmployees() {
  return await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } });
}