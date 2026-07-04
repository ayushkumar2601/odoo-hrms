"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { determineAttendanceStatus } from "./services/attendance-status.service";

export async function checkInAction(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: { gte: today }
    }
  });

  if (existing) {
    return { error: "Already checked in today" };
  }

  const record = await prisma.attendance.create({
    data: {
      employeeId,
      date: new Date(),
      checkIn: new Date(),
      status: "ABSENT" // default until checkout
    }
  });

  await prisma.auditLog.create({
    data: { action: "ATTENDANCE_CHECKIN", metadata: JSON.stringify({ attendanceId: record.id }) }
  });

  return { success: true, record };
}

export async function checkOutAction(employeeId: string) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId,
      date: { gte: today }
    }
  });

  if (!existing || !existing.checkIn || existing.checkOut) {
    return { error: "Cannot check out" };
  }

  const checkOutTime = new Date();
  const diffMs = checkOutTime.getTime() - existing.checkIn.getTime();
  const workedMinutes = Math.floor(diffMs / 60000);
  
  const status = determineAttendanceStatus(workedMinutes);

  const record = await prisma.attendance.update({
    where: { id: existing.id },
    data: {
      checkOut: checkOutTime,
      workedMinutes,
      status
    }
  });

  await prisma.auditLog.create({
    data: { action: "ATTENDANCE_CHECKOUT", metadata: JSON.stringify({ attendanceId: record.id }) }
  });

  return { success: true, record };
}
