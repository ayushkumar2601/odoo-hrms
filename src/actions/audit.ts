"use server";
import { prisma } from "@/lib/prisma";

export async function logAudit(userId: string, action: string, metadata?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        metadata
      }
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
