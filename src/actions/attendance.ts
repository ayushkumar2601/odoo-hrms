"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function checkIn(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  // Check if already checked in today
  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today } }
  });

  if (existing) throw new Error("Already checked in today.");

  await prisma.attendance.create({
    data: {
      employeeId,
      date: new Date(),
      checkIn: new Date(),
      status: "PRESENT"
    }
  });

  revalidatePath("/dashboard/attendance");
}

export async function checkOut(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: { employeeId, date: { gte: today } },
    orderBy: { createdAt: 'desc' }
  });

  if (!existing || existing.checkOut) throw new Error("Cannot check out.");

  await prisma.attendance.update({
    where: { id: existing.id },
    data: { checkOut: new Date() }
  });

  revalidatePath("/dashboard/attendance");
}

export async function getMyAttendance(employeeId: string) {
  return await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' }
  });
}