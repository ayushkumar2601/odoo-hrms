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

  if (!existing || !existing.checkIn || existing.checkOut) throw new Error("Cannot check out.");

  const checkOutTime = new Date();
  const diffMs = checkOutTime.getTime() - existing.checkIn.getTime();
  const workedMinutes = Math.floor(diffMs / 60000);

  let status = "ABSENT";
  if (workedMinutes >= 480) {
    status = "PRESENT";
  } else if (workedMinutes >= 240) {
    status = "HALF_DAY";
  }

  await prisma.attendance.update({
    where: { id: existing.id },
    data: { 
      checkOut: checkOutTime,
      workedMinutes,
      status
    }
  });

  revalidatePath("/dashboard/attendance");
}

export async function getMyAttendance(employeeId: string) {
  return await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: 'desc' }
  });
}