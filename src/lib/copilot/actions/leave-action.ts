import { prisma } from "@/lib/prisma";

export interface LeaveActionPayload {
  leaveType: string;
  startDate: string;
  endDate: string;
  remarks?: string;
}

export async function parseLeaveAction(prompt: string): Promise<LeaveActionPayload | null> {
  // Simple NLP/regex parser for leave requests like "Apply sick leave tomorrow" or "Apply paid leave from July 10 to July 12"
  const lower = prompt.toLowerCase();
  
  let leaveType = "PAID";
  if (lower.includes("sick")) leaveType = "SICK";
  else if (lower.includes("casual")) leaveType = "CASUAL";
  else if (lower.includes("unpaid")) leaveType = "UNPAID";

  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  if (lower.includes("tomorrow")) {
    startDate.setDate(today.getDate() + 1);
    endDate.setDate(today.getDate() + 1);
  } else if (lower.includes("next monday")) {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) + 7; // next Monday
    startDate.setDate(diff);
    endDate.setDate(diff);
  } else {
    // Default to tomorrow if dates not easily parsed by basic regex
    startDate.setDate(today.getDate() + 1);
    endDate.setDate(today.getDate() + 1);
  }

  return {
    leaveType,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    remarks: `Applied via Zindle AI Copilot: "${prompt}"`
  };
}

export async function executeLeaveAction(userId: string, payload: LeaveActionPayload) {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    include: { employee: true }
  });

  if (!userRecord || !userRecord.employee) {
    throw new Error("You must have an associated Employee profile to apply for leave.");
  }

  const newLeave = await prisma.leaveRequest.create({
    data: {
      employeeId: userRecord.employee.id,
      leaveType: payload.leaveType,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      status: "PENDING",
      remarks: payload.remarks || "Applied via AI Copilot"
    }
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      title: "Leave Request Submitted",
      message: `Your ${payload.leaveType} leave request from ${payload.startDate} to ${payload.endDate} has been submitted for approval.`,
      read: false
    }
  });

  return newLeave;
}
