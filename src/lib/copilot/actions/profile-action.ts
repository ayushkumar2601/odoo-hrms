import { prisma } from "@/lib/prisma";

export interface ProfileActionPayload {
  field: "phone" | "address";
  value: string;
}

export async function parseProfileAction(prompt: string): Promise<ProfileActionPayload | null> {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("phone")) {
    const match = prompt.match(/\b\d{10}\b/);
    if (match) {
      return { field: "phone", value: match[0] };
    }
  }
  
  if (lower.includes("address")) {
    const parts = prompt.split(/to|as|address is/i);
    if (parts.length > 1) {
      return { field: "address", value: parts[parts.length - 1].trim() };
    }
  }

  return null;
}

export async function executeProfileAction(userId: string, payload: ProfileActionPayload) {
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    include: { employee: true }
  });

  if (!userRecord || !userRecord.employee) {
    throw new Error("Employee profile not found.");
  }

  const dataToUpdate: Record<string, string> = {};
  dataToUpdate[payload.field] = payload.value;

  const updatedEmployee = await prisma.employee.update({
    where: { id: userRecord.employee.id },
    data: dataToUpdate
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "Profile Updated via Copilot",
      message: `Your ${payload.field} has been updated to "${payload.value}".`,
      read: false
    }
  });

  return updatedEmployee;
}
