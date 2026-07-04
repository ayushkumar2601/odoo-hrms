"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyLeave(employeeId: string, formData: FormData) {
  const leaveType = formData.get("leaveType") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const remarks = formData.get("remarks") as string;

  await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType,
      startDate,
      endDate,
      remarks,
      status: "PENDING"
    }
  });

  revalidatePath("/dashboard/leave");
}

export async function updateLeaveStatus(id: string, status: string) {
  await prisma.leaveRequest.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/dashboard/leave");
}