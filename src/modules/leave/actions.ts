"use server";
import { prisma } from "@/lib/prisma";
import { LeaveType, LeaveStatus } from "@prisma/client";

export async function applyLeaveAction(employeeId: string, data: any) {
  const { leaveType, startDate, endDate, reason } = data;

  const record = await prisma.leaveRequest.create({
    data: {
      employeeId,
      leaveType: leaveType as LeaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: LeaveStatus.PENDING
    }
  });

  await prisma.auditLog.create({
    data: { action: "LEAVE_APPLIED", metadata: JSON.stringify({ leaveId: record.id }) }
  });

  return { success: true, record };
}

export async function approveLeaveAction(leaveId: string, adminUserId: string) {
  const leave = await prisma.leaveRequest.update({
    where: { id: leaveId },
    data: { status: LeaveStatus.APPROVED, reviewedById: adminUserId, reviewedAt: new Date() }
  });

  // Deduct balance logic omitted for brevity in MVP but would update LeaveBalance here
  await prisma.auditLog.create({
    data: { action: "LEAVE_APPROVED", metadata: JSON.stringify({ leaveId }) }
  });

  return { success: true, leave };
}
